---
title: Boletín U07 — Avanzado
description: Ejercicios avanzados de APIs Comerciales
---

# 💪 Boletín U07 — Avanzado

> Ejercicios que requieren aplicar los conceptos de APIs comerciales, variables de entorno, rate limits y OpenAI de forma más profunda, con programas completos contra APIs reales.

---

## 1. Clima con .env para dos ciudades

Carga tu API key de OpenWeatherMap desde un archivo `.env` con `python-dotenv`. Obtén el clima de dos ciudades distintas y compara sus temperaturas.

**Pista:** `load_dotenv()` + `os.getenv("OPENWEATHER_API_KEY")`. Escribe una función `clima(ciudad)` y llámala dos veces, guardando la temperatura de cada una para compararlas.

## 2. GPT con temperatura creativa

Usa la API de OpenAI para pedir una historia corta sobre Python. Ajusta el parámetro `temperature=0.9` para obtener una respuesta más creativa.

**Pista:** en `cliente.chat.completions.create(...)`, además de `model` y `messages`, pasa `temperature=0.9` y un `max_tokens` razonable para que la historia no se corte.

## 3. Capturar errores HTTP

Haz una petición a `https://httpbin.org/status/404` y otra a `https://httpbin.org/status/500`. Captura los errores usando `raise_for_status()` dentro de un bloque try/except.

**Pista:** dentro del `except requests.exceptions.HTTPError as e`, puedes leer `e.response.status_code` para saber qué código ha fallado.

## 4. Comprobación de claves

Carga el `.env` y comprueba que `OPENWEATHER_API_KEY` existe. Si no existe, lanza un error claro con `raise ValueError`.

**Pista:** `os.getenv` devuelve `None` si la variable falta: esa es la condición para lanzar el error.

## 5. Chat con GPT y rol system

Pregunta a GPT-3.5 "¿Qué es Python?" usando un mensaje `system` que diga "Eres un profesor de Python divertido" antes del mensaje `user`.

## 6. Timeout

Haz una petición a `https://192.0.2.1` con `timeout=3` y captura la excepción de timeout.

**Pista:** `192.0.2.1` es una IP de test que nunca responde. La excepción es `requests.exceptions.Timeout`.

## 7. 🎯 Pronóstico extendido

Usa OpenWeatherMap para obtener el pronóstico de 5 días de tu ciudad.

**Pista**: OpenWeatherMap tiene un endpoint `/forecast` que devuelve datos cada 3 horas. Usa `lang=es` para descripciones en español. Para obtener un dato por día, salta 8 elementos (24 horas ÷ 3 horas = 8 intervalos).

## 8. 🔍 Múltiples ciudades

Obtén el clima de 5 ciudades a la vez usando un solo bucle.

**Pista**: Itera sobre una lista de ciudades y haz una petición a OpenWeatherMap por cada una. Añade `time.sleep(0.2)` entre peticiones para evitar el rate limit. Cada respuesta contiene `main.temp` y `weather[0].description`.

## 9. 🧩 GPT: explicador automático

Pregunta a GPT-3.5 que explique 3 conceptos de Python: Lock, Semaphore, Barrier.

**Pista**: La API de chat de OpenAI recibe una lista de mensajes. Puedes iterar sobre una lista de conceptos y pedir una explicación corta para cada uno, limitando la respuesta con `max_tokens`.

## 10. 🎭 Conversación con contexto

Chat con GPT que recuerda el historial de la conversación.

**Pista**: Mantén una lista `mensajes` que acumule cada interacción. Empieza con un mensaje `{"role": "system"}` para definir el rol. En cada turno, añade el mensaje del usuario y la respuesta del asistente para mantener el contexto.

## 11. ⏱ Monitor de uptime

Comprueba cada 30s si una API responde. Si falla 3 veces seguidas, alerta.

**Pista**: Un bucle infinito con `time.sleep(30)` dentro. Un contador de fallos consecutivos se incrementa en cada error y se reinicia al obtener una respuesta OK. Cuando supere el máximo, muestra una alerta.

## 12. 🏗️ Agregador de APIs

Llama a 3 APIs distintas y combina sus respuestas en un solo resumen.

**Pista**: Define una función que llame a varias APIs y guarde los datos relevantes en un diccionario. Cada API aporta una clave diferente. Usa GitHub para datos de usuario, JSONPlaceholder para el conteo de posts y httpbin para la IP.