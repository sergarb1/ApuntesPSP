---
title: 04 — OpenAI
description: El cerebro artificial al alcance de una API 🤖
---

<p><small>El cerebro artificial al alcance de una API 🤖</small></p>

> 🗺️ **Estás en:** 🧪 **U07 · APIs Comerciales** → 04 · OpenAI

---

## 📬 La idea en una frase

> La API de OpenAI convierte un chat en una función: le pasas una lista de **mensajes con roles** y te devuelve la respuesta de texto que puedes imprimir.

No hay modelo instalado en tu máquina: todo vive en los servidores de OpenAI y tú solo envías peticiones HTTP. Exactamente el mismo patrón que en OpenWeatherMap, pero con un `POST` y una cabecera `Authorization`.

---

## 🧠 Registro y clave

1. Crea una cuenta en [platform.openai.com](https://platform.openai.com).
2. Genera tu clave en **API Keys**: empieza por `sk-`.
3. Guárdala en tu `.env` como `OPENAI_API_KEY` (nunca en el código).

> ⚠️ A diferencia de OpenWeatherMap, la clave de OpenAI se manda en la **cabecera `Authorization: Bearer sk-...`**, no en la URL.

---

## 💬 Chat completions

La librería oficial `openai` hace todo el trabajo. Se instala con `pip install openai`:

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

Desglose:

| Pieza | Qué hace |
|---|---|
| `OpenAI(api_key=...)` | Crea el cliente con tu clave del `.env` |
| `model` | Qué modelo usar (`gpt-3.5-turbo`, barato y suficiente para clase) |
| `messages` | La conversación como lista de mensajes con rol |
| `max_tokens` | Longitud máxima de la respuesta (aquí 100) |
| `temperature` | Creatividad: 0 = literal, 1 = desatado |
| `respuesta.choices[0].message.content` | El texto de la respuesta |

---

## 📜 Mensajes y roles

Una conversación con la API es una **lista de mensajes**, y cada mensaje lleva un rol:

| Rol | Quién habla | Ejemplo |
|---|---|---|
| `system` | Las instrucciones del asistente | "Eres un profesor de Python divertido." |
| `user` | El humano | "Explica qué es un Lock en 2 frases." |
| `assistant` | Las respuestas previas del modelo | (lo rellena la API) |

> 💡 El mensaje `system` es la clave del truco: define **el carácter y las reglas** del asistente. El `user` es la pregunta, y en una conversación larga vas encadenando `user` → `assistant` → `user` → …

---

## 🔄 Alternativa con `httpx` (sin librería oficial)

Si no quieres la librería `openai`, el mismo chat es una petición HTTP normal. Esto te enseña lo que hay debajo:

```python
import httpx, os
from dotenv import load_dotenv

load_dotenv()
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

Fíjate: es un `POST` con un JSON en el cuerpo y la clave en la cabecera. La librería oficial no es magia, solo envuelve esto.

---

## 💰 Consumo y coste

OpenAI **no es gratis**, pero para uso educativo es casi simbólico:

| Dato | Valor |
|---|---|
| Precio de GPT-3.5-turbo | ~$0.0015 por 1.000 tokens |
| Tokens de una pregunta normal | ~100 tokens |
| Coste de esa pregunta | ~$0.00015 (¡menos de un céntimo!) |

Un token es, aproximadamente, una pieza de palabra. Con `max_tokens` controlas cuánto gastas por llamada.

> 🧾 Las preguntas tontas del curso te lo recuerdan en el cierre: "¿OpenAI es caro? GPT-3.5-turbo cuesta ~$0.0015 por 1000 tokens. Muy barato para pruebas."

---

## 🧠 Mini-chequeo

1. ¿En qué cabecera y con qué esquema viaja la clave de OpenAI?
2. ¿Qué rol define el comportamiento del asistente? ¿Cuál es la pregunta del usuario?
3. ¿Qué hace `temperature=0.9` frente a `temperature=0`?

<details>
<summary>🔄 Respuestas</summary>

1. En la cabecera **`Authorization`** con el esquema **`Bearer`**: `Authorization: Bearer sk-...`.
2. `system` define el comportamiento ("Eres un profesor..."); `user` lleva la pregunta.
3. `temperature=0.9` da respuestas **más creativas**; `temperature=0` es literal y repetitivo.
</details>

---

## ✅ Resumen en 3 frases

- OpenAI recibe una lista de mensajes con roles (`system`, `user`, `assistant`) y devuelve el texto en `choices[0].message.content`.
- La clave viaja en `Authorization: Bearer`, y se controla el gasto con `max_tokens` y `temperature`.
- Sin la librería oficial, todo se reduce a un `POST` a `/v1/chat/completions` con `httpx`.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Chat completions | El endpoint que genera texto de conversación |
| messages | La lista de mensajes que define la conversación |
| `system` | Rol que fija las reglas del asistente |
| `temperature` | Parámetro de creatividad (0-1) |
| `max_tokens` | Tope de longitud (y de coste) de la respuesta |
| Bearer | Esquema de autorización en la cabecera |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Anterior:** [03 · OpenWeatherMap](/ApuntesPSP/07-apis-comerciales/03-openweathermap) · **Siguiente:** [05 · Rate limiting](/ApuntesPSP/07-apis-comerciales/05-rate-limiting)