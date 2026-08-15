---
title: Boletín U07 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de APIs Comerciales
---

# 💪 Boletín U07 — Avanzado (Resuelto)

---

## 1. Clima con .env para dos ciudades

```python
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")


def clima(ciudad):
    params = {"q": ciudad, "appid": API_KEY, "units": "metric", "lang": "es"}
    datos = requests.get("https://api.openweathermap.org/data/2.5/weather",
                         params=params).json()
    return datos["main"]["temp"]


t1 = clima("Madrid")
t2 = clima("Barcelona")
print(f"Madrid: {t1}°C | Barcelona: {t2}°C")
print("Gana Madrid" if t1 > t2 else "Gana Barcelona")
```

La función devuelve la temperatura y el programa compara las dos llamadas. La clave nunca está en el código: viene del `.env`.

## 2. GPT con temperatura creativa

```python
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
cliente = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

resp = cliente.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Cuenta una historia corta sobre Python."}],
    temperature=0.9,   # más creativo
    max_tokens=200
)
print(resp.choices[0].message.content)
```

`temperature=0.9` da respuestas más creativas y variadas; `temperature=0` sería literal y repetitivo.

## 3. Capturar errores HTTP

```python
import requests

for codigo in (404, 500):
    try:
        resp = requests.get(f"https://httpbin.org/status/{codigo}")
        resp.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print(f"❌ Error {e.response.status_code} en {e.request.url}")
```

`raise_for_status()` lanza una `HTTPError` para cualquier 4xx/5xx, y `e.response.status_code` te dice qué código ha sido.

## 4. Comprobación de claves

```python
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
if not API_KEY:
    raise ValueError("❌ Falta OPENWEATHER_API_KEY en .env")
print("Clave cargada correctamente")
```

Si la variable no existe, `os.getenv` devuelve `None` y el programa muere con un mensaje claro **antes** de hacer ninguna petición con clave vacía.

## 5. Chat con GPT y rol system

```python
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
cliente = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

resp = cliente.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "Eres un profesor de Python divertido."},
        {"role": "user", "content": "¿Qué es Python?"}
    ]
)
print(resp.choices[0].message.content)
```

El mensaje `system` define el **carácter y las reglas** del asistente; el `user` lleva la pregunta.

## 6. Timeout

```python
import requests

try:
    resp = requests.get("https://192.0.2.1", timeout=3)
except requests.exceptions.Timeout:
    print("Timeout — el servidor no responde")
```

192.0.2.1 es una IP de test que nunca responde. El `timeout=3` hace que `requests` aborte a los 3 segundos y lanza `requests.exceptions.Timeout`.

## 7. 🎯 Pronóstico extendido

```python
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

params = {
    "q": "Sevilla",
    "appid": API_KEY,
    "units": "metric",
    "lang": "es"
}
datos = requests.get("https://api.openweathermap.org/data/2.5/forecast",
                     params=params).json()

for i in range(0, len(datos["list"]), 8):  # cada 8 elementos = 1 día
    dia = datos["list"][i]
    fecha = dia["dt_txt"][:10]
    temp = dia["main"]["temp"]
    desc = dia["weather"][0]["description"]
    print(f"{fecha}: {temp}°C — {desc}")
```

El endpoint `/forecast` devuelve datos cada 3 horas: 24 ÷ 3 = **8 intervalos por día**. Saltando de 8 en 8 obtienes un dato por día del pronóstico de 5 días.

## 8. 🔍 Múltiples ciudades

```python
import requests, time
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

ciudades = ["Madrid", "Barcelona", "Sevilla", "Valencia", "Bilbao"]

for ciudad in ciudades:
    params = {"q": ciudad, "appid": API_KEY, "units": "metric", "lang": "es"}
    datos = requests.get("https://api.openweathermap.org/data/2.5/weather",
                         params=params).json()
    print(f"{datos['name']}: {datos['main']['temp']}°C — "
          f"{datos['weather'][0]['description']}")
    time.sleep(0.2)  # respiro entre peticiones: evita el rate limit
```

El `time.sleep(0.2)` espacia las peticiones para no disparar el límite de 60/min del plan gratis.

## 9. 🧩 GPT: explicador automático

```python
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
cliente = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

conceptos = ["Lock", "Semaphore", "Barrier"]

for concepto in conceptos:
    resp = cliente.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user",
                   "content": f"Explica qué es {concepto} en 2 frases."}],
        max_tokens=60
    )
    print(f"{concepto}: {resp.choices[0].message.content}\n")
```

Se itera sobre la lista de conceptos y cada uno recibe una pregunta con `max_tokens` corto para limitar la longitud (y el coste).

## 10. 🎭 Conversación con contexto

```python
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
cliente = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

mensajes = [{"role": "system", "content": "Eres un tutor de Python."}]

while True:
    pregunta = input("Tú: ")
    if pregunta.lower() == "salir":
        break

    mensajes.append({"role": "user", "content": pregunta})

    resp = cliente.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=mensajes,
        max_tokens=150
    )

    respuesta = resp.choices[0].message.content
    print(f"GPT: {respuesta}")
    mensajes.append({"role": "assistant", "content": respuesta})
```

La lista `mensajes` acumula cada turno (`user` → `assistant` → `user` → …): así el modelo "recuerda" lo hablado. El mensaje `system` inicial fija el rol del tutor.

## 11. ⏱ Monitor de uptime

```python
import requests, time
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

URL = "https://api.openweathermap.org/data/2.5/weather"
params = {"q": "Sevilla", "appid": API_KEY, "units": "metric"}

fallos = 0
MAX_FALLOS = 3

while True:
    try:
        resp = requests.get(URL, params=params, timeout=5)
        if resp.status_code == 200:
            print("✅ La API responde OK")
            fallos = 0
        else:
            print(f"⚠️ Respuesta inesperada: {resp.status_code}")
            fallos += 1
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        fallos += 1

    if fallos >= MAX_FALLOS:
        print("🚨 ALERTA: la API lleva 3 fallos seguidos")
        fallos = 0

    time.sleep(30)  # comprobamos cada 30 segundos
```

El contador `fallos` se incrementa con cada error y se **reinicia** al obtener un 200. Cuando llega a 3, salta la alerta. Este es el esqueleto de los monitores de disponibilidad que verás en la U11 con asyncio.

## 12. 🏗️ Agregador de APIs

```python
import requests

def resumen():
    resultado = {}

    usuario = requests.get("https://api.github.com/users/python").json()
    resultado["login"] = usuario["login"]
    resultado["repos"] = usuario["public_repos"]

    posts = requests.get("https://jsonplaceholder.typicode.com/posts").json()
    resultado["posts_publicados"] = len(posts)

    ip = requests.get("https://httpbin.org/ip").json()
    resultado["mi_ip"] = ip["origin"]

    return resultado

info = resumen()
print(f"👤 Usuario: {info['login']}")
print(f"📦 Repos públicos: {info['repos']}")
print(f"📝 Posts en JSONPlaceholder: {info['posts_publicados']}")
print(f"🖥️ Mi IP (según httpbin): {info['mi_ip']}")
```

Cada API aporta una clave distinta al diccionario: GitHub los datos de usuario, JSONPlaceholder el conteo de posts y httpbin la IP. Una función centraliza las tres llamadas y combina lo relevante en un solo resumen.