---
title: "08 — Práctica: APIs comerciales"
description: "Sé el código, el programa completo y los ejercicios del lápiz 🛠️"
---

<p><small>Sé el código, el programa completo y los ejercicios del lápiz 🛠️</small></p>

> 🗺️ **Estás en:** 🧪 **U07 · APIs Comerciales** → 08 · Práctica: APIs comerciales

---

## 📬 La idea en una frase

> Aquí juntas todo lo aprendido en un solo programa: un **cliente de APIs comerciales** que pide el tiempo a OpenWeatherMap y charla con OpenAI, con las claves en el `.env` — y un paseo "siendo" la petición.

De aquí saldrás con el programa más real del módulo: dos APIs de pago consumidas como se hace en producción.

---

## 🏗️ El programa completo: tiempo + cerebro

```python
import requests
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY")
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

if not OPENWEATHER_KEY or not OPENAI_KEY:
    raise ValueError("❌ Faltan claves en .env")


def clima(ciudad):
    """Devuelve y muestra el tiempo actual de una ciudad."""
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": ciudad, "appid": OPENWEATHER_KEY, "units": "metric", "lang": "es"}
    resp = requests.get(url, params=params)
    if resp.status_code != 200:
        print(f"❌ {ciudad}: {resp.json().get('message', 'error desconocido')}")
        return
    datos = resp.json()
    print(f"🌤️  {datos['name']}: {datos['main']['temp']}°C "
          f"({datos['weather'][0]['description']})")


def preguntar_a_gpt(pregunta):
    """Envía una pregunta a OpenAI y devuelve la respuesta."""
    cliente = OpenAI(api_key=OPENAI_KEY)
    respuesta = cliente.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Eres un profesor de Python divertido."},
            {"role": "user", "content": pregunta}
        ],
        max_tokens=100,
        temperature=0.7
    )
    return respuesta.choices[0].message.content


if __name__ == "__main__":
    clima("Madrid")
    clima("Barcelona")
    clima("Sevilla")
    print("\n💬 GPT dice:", preguntar_a_gpt("¿Qué es un Lock en 2 frases?"))
```

Fíjate en el esqueleto que se repite en toda la unidad: clave del `.env` → `requests.get`/`OpenAI` → comprobar / parsear → usar los datos. Es el mismo patrón del [punto 6 de la U06](/ApuntesPSP/06-apis-rest-y-http/06-requests-get), ahora con API key.

---

## ⭐ Sé el código: la consulta meteorológica

> "Sé el programa que pregunta por el tiempo, desde que escribes 'python clima.py' hasta que ves el resultado."

```python
$ python clima.py Barcelona
```

**Traza interna:**

```
1. load_dotenv() → carga .env → obtiene API_KEY
2. Construye URL: https://api.openweathermap.org/data/2.5/weather
   ?q=Barcelona&appid=abc123...&units=metric&lang=es

3. requests.get() → abre socket TCP
   → DNS lookup: api.openweathermap.org → 104.16.x.x
   → Conexión TLS (HTTPS)
   → Envía petición HTTP GET

4. ⏳ Latencia de red (~200ms)

5. Recibe HTTP 200 + JSON:
   HTTP/1.1 200 OK
   Content-Type: application/json
   {"name":"Barcelona","main":{"temp":21.3},"weather":[{"description":"nubes dispersas"}]}

6. resp.json() → dict de Python
7. Extrae datos['main']['temp'] = 21.3
8. Extrae datos['weather'][0]['description'] = "nubes dispersas"
9. print → "🌤️  Barcelona: 21.3°C"
10. print → "   nubes dispersas" 🏁
```

En los pasos 3 a 5 ocurre lo que en la U04 hacías a mano con sockets: DNS, TCP, TLS y el GET HTTP. La única novedad frente a la U06 es el paso 1: la **API key** que ahora viaja en la petición.

---

## 🛠️ Herramientas para probar APIs

Antes de escribir Python, puedes probar una API a mano con estas herramientas:

| Herramienta | Tipo | Para qué |
|-------------|------|----------|
| **Postman** | GUI | Probar APIs, colecciones, tests |
| **curl** | CLI | `curl https://api.github.com/users/python` |
| **httpie** | CLI moderno | `http https://api.github.com/users/python` |
| **Insomnia** | GUI | Alternativa open source a Postman |

> 💡 Con Postman o curl puedes ver la respuesta cruda de OpenWeatherMap (con tu clave en `appid`) antes de escribir una sola línea de Python. Cuando la API responde en la herramienta, pasas el mismo GET a `requests`.

---

## ✏️ Aprieta el lápiz

1. **Clima en 3 ciudades**: Usa OpenWeatherMap para mostrar el clima de Madrid, Barcelona y Sevilla a la vez.
2. **Chat con GPT**: Pregúntale a GPT-3.5 qué es un semáforo en Python y que te ponga un ejemplo.
3. **API con errores**: Conéctate a una URL que no existe y captura el error. Luego a una con API key falsa (401).
4. **Backoff test**: Crea una función que intente conectarse a un servidor que no existe y muestre el tiempo de espera entre intentos.

<details>
<summary>🔓 Soluciones</summary>

**1. Clima en 3 ciudades**

```python
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

for ciudad in ["Madrid", "Barcelona", "Sevilla"]:
    params = {"q": ciudad, "appid": API_KEY, "units": "metric", "lang": "es"}
    datos = requests.get("https://api.openweathermap.org/data/2.5/weather",
                         params=params).json()
    print(f"🌤️  {datos['name']}: {datos['main']['temp']}°C — "
          f"{datos['weather'][0]['description']}")
```

**2. Chat con GPT**

```python
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
cliente = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

resp = cliente.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user",
               "content": "¿Qué es un semáforo en Python? Pon un ejemplo."}],
    max_tokens=150
)
print(resp.choices[0].message.content)
```

**3. API con errores**

```python
import requests

# URL que no existe → 404
resp = requests.get("https://httpbin.org/status/404")
print(resp.status_code)  # 404

# API key falsa → 401
resp = requests.get("https://api.openweathermap.org/data/2.5/weather",
                    params={"q": "Sevilla", "appid": "falsa", "units": "metric"})
print(resp.status_code)  # 401

# Capturamos los errores con raise_for_status
try:
    resp.raise_for_status()
except requests.exceptions.HTTPError as e:
    print(f"❌ Error {e.response.status_code}: {e.response.text}")
```

**4. Backoff test**

```python
import time, requests

def conectar_con_backoff(url, max_intentos=5):
    for intento in range(max_intentos):
        try:
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
            return resp.json()
        except requests.exceptions.RequestException:
            espera = 2 ** intento  # 1, 2, 4, 8, 16 segundos
            print(f"⚠️ Intento {intento+1} fallido. Esperando {espera}s...")
            time.sleep(espera)
    raise Exception("No se pudo conectar tras varios intentos")

conectar_con_backoff("https://192.0.2.1")  # IP de test que nunca responde
```
</details>

---

## 🧠 Mini-chequeo

1. ¿Qué tres bloques forman el programa completo de esta práctica?
2. En la traza del "Sé el código", ¿qué nuevo paso añade la U07 frente a la U06?
3. ¿Para qué te sirve Postman o curl antes de escribir Python?

<details>
<summary>🔄 Respuestas</summary>

1. **Cargar las claves del `.env`** → llamar a las APIs (OpenWeatherMap con `requests`, OpenAI con el cliente) → **parsear y mostrar** los datos.
2. El **paso 1**: la API key del `.env` viaja en la petición (en `appid` para OpenWeatherMap, en `Authorization` para OpenAI).
3. Para **ver la respuesta cruda** de la API (estado, headers, JSON) y confirmar que tu clave y tus parámetros son correctos antes de escribir código.
</details>

---

## ✅ Resumen en 3 frases

- Un cliente de APIs comerciales = claves del `.env` + llamada a la API + parseo de la respuesta.
- El programa completo consume OpenWeatherMap (tiempo) y OpenAI (chat) siguiendo el mismo patrón `requests` de la U06.
- Postman, curl, httpie e Insomnia te dejan probar la API a mano antes de programar.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Cliente de API | Programa que consume una API |
| Traza interna | El camino paso a paso de la petición |
| `.env` | Donde viven las claves que el programa carga |
| Postman / Insomnia | GUIs para probar APIs |
| curl / httpie | CLIs para probar APIs |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Anterior:** [07 · Seguridad y buenas prácticas](/ApuntesPSP/07-apis-comerciales/07-seguridad-y-buenas-practicas) · **Siguiente:** [09 · Head First](/ApuntesPSP/07-apis-comerciales/09-head-first)