---
title: "TEMA 07 — APIs Comerciales"
nav_order: 07
---

## TEMA 07 — APIs Comerciales (RA4a-b)

> "Las APIs de verdad no son de mentira. Te piden API key, te limitan las peticiones, se caen y tienes que manejar sus errores como un adulto."

---

## Índice

1. [API Key — el carnet de identidad](#api-key--el-carnet-de-identidad)
2. [Variables de entorno con dotenv](#variables-de-entorno-con-dotenv)
3. [OpenWeatherMap — el tiempo en tu ciudad](#openweathermap--el-tiempo-en-tu-ciudad)
4. [Be the code, my friend, my friend — Consulta meteorológica](#be-the-code-my-friend-my-friend--consulta-meteorológica)
5. [OpenAI — el cerebro artificial](#openai--el-cerebro-artificial)
6. [Errores y rate limiting](#errores-y-rate-limiting)
7. [Reintentos inteligentes (backoff)](#reintentos-inteligentes-backoff)
8. [🥊 El ring de los conceptos — REST vs SOAP vs GraphQL](#el-ring-de-los-conceptos--rest-vs-soap-vs-graphql)
9. [Herramientas para probar APIs](#herramientas-para-probar-apis)
10. [Preguntas tontas — APIs Comerciales](#preguntas-tontas--apis-comerciales)
11. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
12. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## API Key — el carnet de identidad

Las APIs comerciales te dan una **API key** (o token) que identifica quién eres y cuánto puedes usar.

```python
import requests

API_KEY = "tu-api-key-aqui"  # ⚠️ NUNCA subas esto a GitHub

resp = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={"q": "Sevilla", "appid": API_KEY, "units": "metric"}
)
```

> **Regla de oro**: las API keys nunca van en el código. Usa variables de entorno.

---

## Variables de entorno con dotenv

```python
# pip install python-dotenv
from dotenv import load_dotenv
import os

load_dotenv()  # Carga el archivo .env

API_KEY = os.getenv("OPENWEATHER_API_KEY")
if not API_KEY:
    raise ValueError("❌ Falta OPENWEATHER_API_KEY en .env")
```

**.env** (este archivo NO se sube a git):
```
OPENWEATHER_API_KEY=abc123...
OPENAI_API_KEY=sk-...
```

**.gitignore**:
```
.env
```

---

## OpenWeatherMap — el tiempo en tu ciudad

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

**Respuesta JSON**:
```json
{
  "name": "Sevilla",
  "main": { "temp": 18.5, "feels_like": 17.2, "humidity": 65 },
  "weather": [{ "description": "cielo claro" }]
}
```

---

## Be the code, my friend, my friend — Consulta meteorológica

> "Sé el programa que pregunta por el tiempo, desde que escribes 'python clima.py' hasta que ves el resultado."

```
$ python clima.py Barcelona

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

---

## OpenAI — el cerebro artificial

```python
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

cliente = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

respuesta = cliente.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "Eres un profesor de Python divertido."},
        {"role": "user", "content": "Explica qué es un Lock en 2 frases."}
    ],
    max_tokens=100,
    temperature=0.7
)

print(respuesta.choices[0].message.content)
```

### Alternativa con httpx (sin librería oficial)

```python
import httpx

API_KEY = os.getenv("OPENAI_API_KEY")
resp = httpx.post(
    "https://api.openai.com/v1/chat/completions",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Hola!"}]
    }
)
print(resp.json()["choices"][0]["message"]["content"])
```

---

## Errores y rate limiting

Las APIs comerciales **fallan**. Y fallan a menudo. Prepárate.

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

---

## Reintentos inteligentes (backoff)

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

> El **backoff exponencial** evita saturar un servidor que ya está tocado.

---

## 🥊 El ring de los conceptos — REST vs SOAP vs GraphQL

**REST**: "Mira, soy el estándar. Simple, recursos, JSON. Todo el mundo me conoce."

**SOAP**: "Yo fui el rey en los 2000. XML, WSDL, muy estructurado. Aún vivo en bancos."

**GraphQL**: "Yo soy el moderno. Una sola URL, pides exactamente lo que necesitas, ni más ni menos."

**REST**: "¿Y eso es bueno? Yo tengo URLs claras: `/usuarios/5`, `/productos`."

**GraphQL**: "Sí, pero si quieres el nombre y el email del usuario y los títulos de sus posts, ¿cuántas peticiones necesitas?"

**REST**: "Dos: `/usuarios/5` y `/usuarios/5/posts`."

**GraphQL**: "Yo con una: `query { usuario(id:5) { nombre email posts { titulo } } }`."

**REST**: "Vale, eres más eficiente. Pero yo soy más simple para empezar."

**GraphQL**: "Tienes razón. Para proyectos pequeños, REST gana. Para grandes, yo escalo mejor."

---

## Herramientas para probar APIs

| Herramienta | Tipo | Para qué |
|-------------|------|----------|
| **Postman** | GUI | Probar APIs, colecciones, tests |
| **curl** | CLI | `curl https://api.github.com/users/python` |
| **httpie** | CLI moderno | `http https://api.github.com/users/python` |
| **Insomnia** | GUI | Alternativa open source a Postman |

---

## Preguntas tontas — APIs Comerciales

**❓ ¿Me pueden banear por usar mucho la API?**
Sí. Todas tienen límites (rate limits). Lee la documentación. OpenWeatherMap gratis: 60 peticiones/minuto.

**❓ ¿Qué pasa si me paso del límite?**
HTTP 429 (Too Many Requests). Algunas APIs bloquean tu IP por un tiempo.

**❓ ¿OpenAI es caro?**
GPT-3.5-turbo cuesta ~$0.0015 por 1000 tokens. Una pregunta normal son ~100 tokens = $0.00015. Muy barato para pruebas.

**❓ ¿Puedo guardar la API key en el código para pruebas?**
Solo si el código nunca va a GitHub. Mejor acostúmbrate a `.env` desde el principio.

---

## ✏️ Aprieta el lápiz

1. **Clima en 3 ciudades**: Usa OpenWeatherMap para mostrar el clima de Madrid, Barcelona y Sevilla a la vez.
2. **Chat con GPT**: Pregúntale a GPT-3.5 qué es un semáforo en Python y que te ponga un ejemplo.
3. **API con errores**: Conéctate a una URL que no existe y captura el error. Luego a una con API key falsa (401).
4. **Backoff test**: Crea una función que intente conectarse a un servidor que no existe y muestre el tiempo de espera entre intentos.

---

## RAs cubiertos y criterios de evaluación

### RA4 — Servicios en red (a-b, completo)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA4a | Utiliza APIs REST para obtener datos externos | ✅ |
| RA4b | Maneja peticiones HTTP y procesa respuestas JSON | ✅ |

> RA4c (servidores concurrentes) y RA4d (ThreadPool) se cubren en el **TEMA 10**. RA4e-g (asyncio, disponibilidad, comparativa) se cubren en el **TEMA 11**.
