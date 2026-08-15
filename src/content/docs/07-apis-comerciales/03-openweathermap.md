---
title: 03 — OpenWeatherMap
description: El tiempo en tu ciudad con una llamada 🌤️
---

<p><small>El tiempo en tu ciudad con una llamada 🌤️</small></p>

> 🗺️ **Estás en:** 🧪 **U07 · APIs Comerciales** → 03 · OpenWeatherMap

---

## 📬 La idea en una frase

> **OpenWeatherMap** te da el tiempo de cualquier ciudad con un solo GET: construyes la URL, pasas `q`, `appid`, `units` y `lang`, y parseas el JSON que te devuelve.

Es la API comercial más sencilla que vas a tocar en el módulo: perfecta para estrenar tu primera API key de verdad.

---

## 🗺️ Registro y API key

1. Entra en [openweathermap.org](https://openweathermap.org) y crea una cuenta gratuita.
2. En el panel, apartado **API Keys**, te generan tu clave personal.
3. Guárdala en tu `.env` (punto 2) como `OPENWEATHER_API_KEY`.

> 🎁 **Plan gratis:** suficiente para clase. Te permite 60 peticiones por minuto (el límite exacto lo verás en el [punto 5](/ApuntesPSP/07-apis-comerciales/05-rate-limiting)).

---

## 📍 La URL y sus parámetros

El endpoint del tiempo actual es:

```
https://api.openweathermap.org/data/2.5/weather
```

| Parámetro | Qué hace | Ejemplo |
|---|---|---|
| `q` | La ciudad (o "ciudad,país") | `q=Sevilla` |
| `appid` | Tu API key (punto 1) | `appid=TU_API_KEY` |
| `units` | Unidades: `metric`, `imperial`, `standard` | `units=metric` |
| `lang` | Idioma de las descripciones | `lang=es` |

> 💡 Sin `units=metric` la temperatura llega en **kelvin**. Con `metric` llega en grados centígrados: mucho más amigable.

---

## 🌤️ Llamada y parseo

```python
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

def clima(ciudad):
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": ciudad, "appid": API_KEY, "units": "metric", "lang": "es"}

    resp = requests.get(url, params=params)
    if resp.status_code != 200:
        print(f"❌ Error: {resp.json().get('message', 'desconocido')}")
        return

    datos = resp.json()
    print(f"🌤️  {datos['name']}: {datos['main']['temp']}°C")
    print(f"   Sensación: {datos['main']['feels_like']}°C")
    print(f"   Humedad: {datos['main']['humidity']}%")
    print(f"   {datos['weather'][0]['description']}")

clima("Sevilla")
```

**Respuesta JSON** (simplificada):

```json
{
  "name": "Sevilla",
  "main": { "temp": 18.5, "feels_like": 17.2, "humidity": 65 },
  "weather": [{ "description": "cielo claro" }]
}
```

Los campos que usamos:

| Ruta en el JSON | Qué es |
|---|---|
| `datos['name']` | El nombre de la ciudad |
| `datos['main']['temp']` | Temperatura actual |
| `datos['main']['feels_like']` | Sensación térmica |
| `datos['main']['humidity']` | Humedad en % |
| `datos['weather'][0]['description']` | Texto descriptivo del cielo |

> 💡 `weather` es una **lista** de diccionarios (porque puede haber varias condiciones), por eso se accede con `[0]`.

---

## 🧠 Mini-chequeo

1. ¿Qué parámetro convierte la temperatura a grados centígrados?
2. ¿Por qué `datos['weather'][0]['description']` necesita el `[0]`?
3. ¿Qué compruebas antes de hacer `resp.json()` en la función `clima`?

<details>
<summary>🔄 Respuestas</summary>

1. `units=metric`. Sin él, la API devuelve kelvin.
2. Porque `weather` es una **lista** de condiciones: el `[0]` coge la primera (la principal).
3. Que `resp.status_code == 200`. Si no, se imprime el mensaje de error de la propia API (`resp.json().get('message', 'desconocido')`).
</details>

---

## ✅ Resumen en 3 frases

- OpenWeatherMap devuelve el tiempo con un GET a `/data/2.5/weather` pasando `q`, `appid`, `units` y `lang`.
- La respuesta es JSON anidado: `main` guarda temperaturas y `weather` la descripción.
- Comprobar el `status_code` antes de parsear evita errores feos cuando la API falla.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Endpoint | La URL concreta de un recurso (`/data/2.5/weather`) |
| `q` | Parámetro de ciudad |
| `units=metric` | Devuelve grados centígrados en lugar de kelvin |
| `lang=es` | Descripciones del tiempo en español |
| `main` | Objeto con temperaturas y humedad |
| `weather` | Lista con las descripciones del cielo |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Anterior:** [02 · Variables de entorno](/ApuntesPSP/07-apis-comerciales/02-variables-de-entorno) · **Siguiente:** [04 · OpenAI](/ApuntesPSP/07-apis-comerciales/04-openai)