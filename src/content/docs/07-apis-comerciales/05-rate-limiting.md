---
title: 05 — Rate limiting
description: Límites, cuotas y el temido 429 🐢
---

<p><small>Límites, cuotas y el temido 429 🐢</small></p>

> 🗺️ **Estás en:** 🧪 **U07 · APIs Comerciales** → 05 · Rate limiting

---

## 📬 La idea en una frase

> Toda API comercial **limita cuánto puedes pedir**: si te pasas, responde **429 Too Many Requests**, y tu programa debe esperar antes de reintentar.

No es un castigo: es protección. Un cliente desbocado derribaría el servidor de todos los demás usuarios.

---

## ⏳ ¿Qué es el rate limit?

El **rate limit** es la cuota de peticiones que tu API key puede hacer en un intervalo de tiempo. Si la superas, la API deja de responderte.

| API | Límite típico del plan gratis |
|---|---|
| OpenWeatherMap | 60 peticiones/minuto |
| GitHub API | 60 peticiones/hora |
| OpenAI | Por tokens por minuto (varía con el plan) |

Estos límites existen por una razón sencilla: **una API no es tu base de datos**. Un bucle sin freno que pregunta el tiempo de 1.000 ciudades en un segundo es exactamente el comportamiento que quieren cortar.

---

## 🐢 El error 429

Cuando te pasas del límite, la respuesta es:

```
HTTP/1.1 429 Too Many Requests
```

Y OpenWeatherMap añade un mensaje en el JSON:

```json
{ "cod": 429, "message": "You have exceeded your quota." }
```

> 💡 Algunas APIs van más allá y **bloquean tu IP** temporalmente si insistes. Por eso el 429 se toma en serio: esperas, no machacas.

---

## 😴 Esperar antes de reintentar

La respuesta natural a un 429 es **parar, esperar y volver a intentar**:

```python
import requests
import time

resp = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={"q": "Sevilla", "appid": "TU_API_KEY", "units": "metric"}
)

if resp.status_code == 429:
    print("🐢 Demasiadas peticiones. Esperando...")
    time.sleep(5)  # Respiramos 5 segundos antes de reintentar
```

Si quieres comprobar cuánto te queda, muchas APIs mandan cabeceras con la cuota restante (por ejemplo `X-RateLimit-Remaining`).

---

## 🔁 Reintentos inteligentes (backoff)

Esperar siempre lo mismo no es la mejor idea: si el servidor está saturado, mejor ir espaciando cada vez más los reintentos. Ese es el **backoff exponencial**:

```python
import time, requests

def conectar_con_backoff(url, params, max_intentos=5):
    for intento in range(max_intentos):
        try:
            resp = requests.get(url, params=params, timeout=5)
            resp.raise_for_status()
            return resp.json()
        except:
            espera = 2 ** intento  # 1, 2, 4, 8, 16 segundos
            print(f"⚠️ Intento {intento+1} fallido. Esperando {espera}s...")
            time.sleep(espera)
    raise Exception("No se pudo conectar tras varios intentos")
```

La progresión de esperas con `2 ** intento`:

```
Intento 1 fallido → espera 1s
Intento 2 fallido → espera 2s
Intento 3 fallido → espera 4s
Intento 4 fallido → espera 8s
Intento 5 fallido → espera 16s → se rinde
```

> El **backoff exponencial** evita saturar un servidor que ya está tocado. Es la técnica que usan los clientes profesionales y la retomarás en la [U11 · asyncio](/ApuntesPSP/11-asyncio-y-disponibilidad) para verla de otra forma.

---

## 🧠 Mini-chequeo

1. ¿Qué código HTTP indica que te has pasado del límite de peticiones?
2. ¿Por qué no es buena idea reintentar sin parar cuando ves un 429?
3. ¿Cuánto espera `conectar_con_backoff` antes del intento 4?

<details>
<summary>🔄 Respuestas</summary>

1. **429 Too Many Requests**.
2. Porque machacas un servidor ya saturado y puede acabar **bloqueando tu IP**. Lo correcto es esperar (con backoff) antes de reintentar.
3. `2 ** (intento-1)` → antes del intento 4 espera **8 segundos** (1, 2, 4, 8).
</details>

---

## ✅ Resumen en 3 frases

- Las APIs limitan tus peticiones por tiempo (cuota) y te avisan con **429** cuando te pasas.
- La respuesta profesional es esperar y reintentar con calma, nunca machacar.
- El **backoff exponencial** duplica la espera entre intentos (`1, 2, 4, 8…`) para no saturar al servidor.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Rate limit | Cuota de peticiones por tiempo |
| Cuota | El máximo que tu plan te permite |
| 429 | Too Many Requests: te has pasado del límite |
| Backoff exponencial | Espera que se duplica entre reintentos |
| X-RateLimit-Remaining | Cabecera con las peticiones que te quedan |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Anterior:** [04 · OpenAI](/ApuntesPSP/07-apis-comerciales/04-openai) · **Siguiente:** [06 · Errores HTTP](/ApuntesPSP/07-apis-comerciales/06-errores-http)