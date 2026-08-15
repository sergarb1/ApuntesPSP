---
title: 01 — API Keys
description: El carnet de identidad de las APIs comerciales 🎫
---

<p><small>El carnet de identidad de las APIs comerciales 🎫</small></p>

> 🗺️ **Estás en:** 🧪 **U07 · APIs Comerciales** → 01 · API Keys

---

## 📬 La idea en una frase

> Una **API key** es el carnet de identidad que te da la API comercial: identifica quién eres, cuánto puedes usar y quién te facturará si te pasas.

Las APIs de verdad no son de mentira. Te piden API key, te limitan las peticiones, se caen y tienes que manejar sus errores como un adulto. La API key es la puerta de entrada a todo eso.

---

## 🎫 ¿Qué es una API key?

Una **API key** (o token) es una cadena secreta que la API te asigna al registrarte. Cada petición que haces la lleva contigo, y el servidor sabe así tres cosas:

| Qué sabe el servidor | Ejemplo |
|---|---|
| **Quién eres** | El usuario `sergio` tiene la key `abc123...` |
| **Cuánto puedes usar** | Tu plan gratis permite 60 peticiones/minuto |
| **Quién paga el exceso** | Si pasas del plan, la factura cae en tu cuenta |

Es exactamente el **carnet de identidad** del mundo de las APIs: sin él, el servidor no sabe si eres un estudiante probando o un robot mandando 10.000 peticiones por segundo.

---

## 🗝️ ¿Cómo se obtiene?

1. Te registras en la web del proveedor (OpenWeatherMap, OpenAI, GitHub…).
2. Creas una clave desde el **panel de control** (suele llamarse "API Keys", "Tokens" o "Credentials").
3. Copias la cadena y **nunca, jamás, la subes a GitHub**.

> Las claves de OpenAI empiezan por `sk-` y las de OpenWeatherMap son una cadena alfanumérica larga. En este curso usarás siempre el marcador `TU_API_KEY` para no escribir claves reales.

---

## 📍 ¿Dónde va la clave?

Hay dos formas habituales de enviar la clave en la petición:

1. **Como parámetro de la URL** (lo usa OpenWeatherMap con `appid`):
   ```
   GET /data/2.5/weather?q=Sevilla&appid=TU_API_KEY&units=metric
   ```

2. **Como cabecera `Authorization`** (lo usa OpenAI con `Bearer`):
   ```
   Authorization: Bearer TU_API_KEY
   ```

Con `requests`, las dos formas se escriben así:

```python
import requests

API_KEY = "TU_API_KEY"  # ⚠️ NUNCA subas esto a GitHub

# Opción 1: la clave en la query string (params)
resp = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={"q": "Sevilla", "appid": API_KEY, "units": "metric"}
)

# Opción 2: la clave en la cabecera Authorization (headers)
resp = requests.get(
    "https://api.github.com/user",
    headers={"Authorization": f"Bearer {API_KEY}"}
)
```

> ⚠️ **Ojo con la URL:** si la clave va en la query string, queda registrada en los logs del servidor y en tu historial. Las cabeceras son más discretas. Por eso OpenAI exige `Bearer` y OpenWeatherMap (más antiguo) usa `appid`.

---

## 🗝️ La analogía del llavero de acceso

Una API key es como el **llavero de acceso a un edificio de oficinas**:

- Sin llavero no entras: el servidor te responde **401 Unauthorized**.
- Tu llavero tiene un **nivel**: el de estudiante abre la planta del laboratorio, no la sala de servidores (eso sería un **403 Forbidden**).
- Si pierdes el llavero, no vale "borrar el código": hay que **anular la cerradura** y pedir uno nuevo (rotar la clave).

Y la regla de oro que repetiremos toda la unidad:

> **Regla de oro**: las API keys nunca van en el código. Usa variables de entorno.

---

## 🧠 Mini-chequeo

1. ¿Qué tres cosas sabe el servidor cuando le envías tu API key?
2. ¿Dónde puede viajar la clave en una petición HTTP? Pon un ejemplo de cada sitio.
3. ¿Qué te devuelve la API si la clave es incorrecta?

<details>
<summary>🔄 Respuestas</summary>

1. **Quién eres**, **cuánto puedes usar** (tu plan/cuota) y **quién paga** los excesos.
2. En la **query string** (`?appid=TU_API_KEY`, OpenWeatherMap) o en la **cabecera** `Authorization: Bearer TU_API_KEY` (OpenAI).
3. **401 Unauthorized**: el servidor no te reconoce y rechaza la petición.
</details>

---

## ✅ Resumen en 3 frases

- Una API key es el carnet de identidad de las APIs comerciales: identifica quién eres y cuánto puedes usar.
- Se obtiene registrándote en el proveedor y se envía en la query string (`appid`) o en la cabecera `Authorization`.
- Las API keys nunca van en el código: en el [punto 2](/ApuntesPSP/07-apis-comerciales/02-variables-de-entorno) verás dónde se guardan de verdad.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| API key | Carnet de identidad de la API: identifica quién eres |
| Token | Sinónimo de clave de acceso |
| appid | Parámetro donde OpenWeatherMap espera tu clave |
| Authorization | Cabecera HTTP donde se mandan claves y tokens |
| Bearer | Esquema de autorización de la cabecera (`Bearer TU_API_KEY`) |
| 401 | Código de error cuando la clave es inválida o falta |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Siguiente:** [02 · Variables de entorno](/ApuntesPSP/07-apis-comerciales/02-variables-de-entorno)