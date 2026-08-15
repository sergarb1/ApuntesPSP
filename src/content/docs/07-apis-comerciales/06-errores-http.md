---
title: 06 — Errores HTTP
description: "401, 403, 429, 500: el servidor te está hablando ⚠️"
---

<p><small>401, 403, 429, 500: el servidor te está hablando ⚠️</small></p>

> 🗺️ **Estás en:** 🧪 **U07 · APIs Comerciales** → 06 · Errores HTTP

---

## 📬 La idea en una frase

> `requests` **no lanza errores por sí solo**: tú compruebas el `status_code` o llamas a `raise_for_status()`, y capturas las excepciones para que tu programa no reviente.

Las APIs comerciales **fallan**. Y fallan a menudo. Prepárate.

---

## 🚨 Los códigos que verás

Estos son los códigos que una API comercial te va a devolver en la vida real:

| Código | Qué significa | Causa típica |
|---|---|---|
| `400` | Bad Request | Enviaste mal el JSON o los parámetros |
| `401` | Unauthorized | La API key falta o es inválida |
| `403` | Forbidden | La key es válida pero sin permiso para eso |
| `404` | Not Found | La URL o el recurso no existe |
| `429` | Too Many Requests | Te pasaste del rate limit (punto 5) |
| `500` | Internal Server Error | El servidor de la API está tocado |
| `503` | Service Unavailable | La API está de mantenimiento o caída |

> 💡 La regla mnemotécnica de la U06 sigue valiendo: los **4xx** son tu culpa (mira la URL, la key o los parámetros), los **5xx** son del servidor.

---

## 🧯 `raise_for_status()` y try/except

`requests` no lanza excepción cuando recibe un 404 o un 500: te devuelve la respuesta y sigues. Para convertir los errores HTTP en excepciones manejables existe `raise_for_status()`:

```python
import requests

resp = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={"q": "Sevilla", "appid": "falsa", "units": "metric"}
)
print(resp.status_code)  # 401 — la key es inválida

resp.raise_for_status()  # Lanza una excepción HTTPError si es 4xx o 5xx
```

> ⚠️ **Error típico de novato:** llamar a `resp.json()` sin comprobar el código. Si el cuerpo es un error (o no es JSON), `resp.json()` lanza una excepción y el programa revienta con un mensaje que no dice nada útil.

---

## 🛡️ Una llamada segura de verdad

Juntando los códigos, el timeout y los reintentos, la función robusta queda así:

```python
import requests

def llamada_segura(url, params, max_intentos=3):
    for intento in range(max_intentos):
        try:
            resp = requests.get(url, params=params, timeout=10)
            resp.raise_for_status()  # Lanza excepción si 4xx o 5xx
            return resp.json()

        except requests.exceptions.Timeout:
            print(f"⏱ Timeout (intento {intento+1})")

        except requests.exceptions.HTTPError as e:
            codigo = e.response.status_code
            if codigo == 429:  # Rate limit
                print("🐢 Demasiadas peticiones. Esperando...")
                import time
                time.sleep(5)
                continue
            elif codigo == 401:
                print("🔑 API key inválida")
                return None
            else:
                print(f"❌ HTTP {codigo}: {e.response.text}")
                return None

        except requests.exceptions.ConnectionError:
            print(f"🔌 Error de conexión (intento {intento+1})")
            import time
            time.sleep(2)

    return None
```

El flujo de decisión, en un vistazo:

```
requests.get(timeout=10)
   │
   ├─ Timeout ──────────────► reintenta (hasta max_intentos)
   ├─ HTTPError 429 ────────► espera 5s y reintenta
   ├─ HTTPError 401 ────────► "API key inválida" → None
   ├─ HTTPError 4xx/5xx ────► imprime código y texto → None
   ├─ ConnectionError ──────► espera 2s y reintenta
   └─ OK ───────────────────► devuelve el JSON
```

---

## 🧠 Mini-chequeo

1. ¿Qué diferencia hay entre 401 y 403?
2. ¿Qué hace `raise_for_status()` y qué excepción lanza?
3. ¿Por qué no debes llamar a `resp.json()` sin comprobar antes el código de estado?

<details>
<summary>🔄 Respuestas</summary>

1. **401** = no te has autenticado (falta o es mala la key). **403** = te has autenticado, pero no tienes permiso para esa acción.
2. Comprueba la respuesta y, si el código es 4xx o 5xx, lanza una **`requests.exceptions.HTTPError`** con la respuesta dentro.
3. Porque un cuerpo de error puede no ser JSON: `resp.json()` lanzaría una excepción y el programa moriría con un mensaje poco útil.
</details>

---

## ✅ Resumen en 3 frases

- Los códigos de una API comercial se dividen en 4xx (tu error) y 5xx (error del servidor).
- `raise_for_status()` convierte los códigos malos en excepciones capturables con try/except.
- Una llamada segura combina timeout, comprobación de códigos y reintentos, como `llamada_segura`.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| 401 / 403 | No autenticado / autenticado sin permiso |
| 429 | Rate limit superado |
| 500 / 503 | Error del servidor / API caída |
| `raise_for_status()` | Lanza HTTPError si el código es 4xx o 5xx |
| `requests.exceptions.Timeout` | La petición no obtuvo respuesta a tiempo |
| `requests.exceptions.ConnectionError` | No se pudo conectar al servidor |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Anterior:** [05 · Rate limiting](/ApuntesPSP/07-apis-comerciales/05-rate-limiting) · **Siguiente:** [07 · Seguridad y buenas prácticas](/ApuntesPSP/07-apis-comerciales/07-seguridad-y-buenas-practicas)