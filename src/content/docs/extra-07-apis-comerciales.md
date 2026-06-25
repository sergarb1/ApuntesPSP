---
title: "⭐ AVANZADO 7 — APIs Comerciales"
nav_order: 7
---

## ⭐ AVANZADO 07 — APIs Comerciales


---

### 1. 🎯 Pronóstico extendido

Usa OpenWeatherMap para obtener el pronóstico de 5 días de tu ciudad.

**Pista**: OpenWeatherMap tiene un endpoint `/forecast` que devuelve datos cada 3 horas. Usa `lang=es` para descripciones en español. Para obtener un dato por día, salta 8 elementos (24 horas ÷ 3 horas = 8 intervalos).

---

### 2. 🔍 Múltiples ciudades

Obtén el clima de 5 ciudades a la vez usando un solo bucle.

**Pista**: Itera sobre una lista de ciudades y haz una petición a OpenWeatherMap por cada una. Añade `time.sleep(0.2)` entre peticiones para evitar el rate limit. Cada respuesta contiene `main.temp` y `weather[0].description`.

---

### 3. 🧩 GPT: explicador automático

Pregunta a GPT-3.5 que explique 3 conceptos de Python: Lock, Semaphore, Barrier.

**Pista**: La API de chat de OpenAI recibe una lista de mensajes. Puedes iterar sobre una lista de conceptos y pedir una explicación corta para cada uno, limitando la respuesta con `max_tokens`.

---

### 4. 🎭 Conversación con contexto

Chat con GPT que recuerda el historial de la conversación.

**Pista**: Mantén una lista `mensajes` que acumule cada interacción. Empieza con un mensaje `{"role": "system"}` para definir el rol. En cada turno, añade el mensaje del usuario y la respuesta del asistente para mantener el contexto.

---

### 5. ⏱ Monitor de uptime

Comprueba cada 30s si una API responde. Si falla 3 veces seguidas, alerta.

**Pista**: Un bucle infinito con `time.sleep(30)` dentro. Un contador de fallos consecutivos se incrementa en cada error y se reinicia al obtener una respuesta OK. Cuando supere el máximo, muestra una alerta.

---

### 6. 🏗️ Agregador de APIs

Llama a 3 APIs distintas y combina sus respuestas en un solo resumen.

**Pista**: Define una función que llame a varias APIs y guarde los datos relevantes en un diccionario. Cada API aporta una clave diferente. Usa GitHub para datos de usuario, JSONPlaceholder para el conteo de posts y httpbin para la IP.
