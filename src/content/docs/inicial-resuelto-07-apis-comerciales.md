---
title: "✅ INICIAL RESUELTO 7 — APIs Comerciales"
nav_order: 7
---
### 1. Clima de tu ciudad

```python
import requests
API_KEY = "tu_api_key_real"
params = {"q": "Sevilla", "appid": API_KEY, "units": "metric"}
resp = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params)
print(resp.json()["main"]["temp"], "°C")
```

Necesitas una API key real de OpenWeatherMap (gratuita).

### 2. Sensación térmica

```python
import requests
API_KEY = "tu_api_key"
params = {"q": "Madrid", "appid": API_KEY, "units": "metric"}
datos = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params).json()
print(f"Sensación: {datos['main']['feels_like']}°C")
```

### 3. Error 401

```python
import requests
resp = requests.get("https://api.openweathermap.org/data/2.5/weather",
                    params={"q": "Sevilla", "appid": "falsa", "units": "metric"})
print(resp.status_code)  # 401
```

API key incorrecta → 401 Unauthorized.
