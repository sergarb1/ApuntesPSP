---
title: Boletín U07 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de APIs Comerciales
---

# ✅ Boletín U07 — Inicial (Resuelto)

---

## 1. Humedad actual

```python
import requests
API_KEY = "TU_API_KEY"
params = {"q": "Sevilla", "appid": API_KEY, "units": "metric"}
resp = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params)
print(f"Humedad: {resp.json()['main']['humidity']}%")
```

Necesitas una API key real de OpenWeatherMap (gratuita). Con `units=metric` la temperatura viene en grados.

## 2. Descripción del clima

```python
import requests
API_KEY = "TU_API_KEY"
params = {"q": "Sevilla", "appid": API_KEY, "units": "metric", "lang": "es"}
datos = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params).json()
print(datos["weather"][0]["description"])
```

`weather` es una **lista**: el `[0]` coge la condición principal y `description` es su texto.

## 3. Temperatura mínima y máxima

```python
import requests
API_KEY = "TU_API_KEY"
params = {"q": "Sevilla", "appid": API_KEY, "units": "metric"}
datos = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params).json()
print(f"Mínima: {datos['main']['temp_min']}°C")
print(f"Máxima: {datos['main']['temp_max']}°C")
```

`main` contiene `temp`, `temp_min`, `temp_max`, `feels_like` y `humidity`.

## 4. Temperatura y sensación térmica

```python
import requests
API_KEY = "TU_API_KEY"
params = {"q": "Madrid", "appid": API_KEY, "units": "metric"}
datos = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params).json()
print(f"Temperatura: {datos['main']['temp']}°C")
print(f"Sensación: {datos['main']['feels_like']}°C")
```

## 5. Error 401

```python
import requests
resp = requests.get("https://api.openweathermap.org/data/2.5/weather",
                    params={"q": "Sevilla", "appid": "falsa", "units": "metric"})
print(resp.status_code)  # 401
```

API key incorrecta → **401 Unauthorized**: el servidor no te reconoce y rechaza la petición.

## 6. ¿Dónde va la API key?

a) En el parámetro **`appid`** de la query string: `?q=Sevilla&appid=TU_API_KEY`.
b) En la cabecera **`Authorization`** con el esquema **`Bearer`**: `Authorization: Bearer TU_API_KEY`.

## 7. Clave desde el `.env`

```python
from dotenv import load_dotenv
import os

load_dotenv()
print(os.getenv("OPENWEATHER_API_KEY"))  # "test123"
```

El `.env` debe contener la línea `OPENWEATHER_API_KEY=test123`. `load_dotenv()` carga el archivo y `os.getenv` lee el valor.

## 8. Protege el repo

a) En el `.gitignore`:
```
.env
```

b) `os.getenv("MI_CLAVE")` devuelve **`None`** si la variable no existe. Por eso conviene comprobarlo y lanzar un `raise ValueError` con un mensaje claro.

> Los **4xx** son error del cliente (tu clave, tu URL, tus parámetros): el 401 es el típico cuando la API key es mala.