---
title: 01 — Web y HTTP
description: La conversación entre tu código y el servidor 🌍
---

<p><small>La conversación entre tu código y el servidor 🌍</small></p>

> 🗺️ **Estás en:** 🌐 **U06 · APIs REST y HTTP** → 01 · Web y HTTP

---

## 📬 La idea en una frase

> Una **API** es un conjunto de reglas para que dos programas se comuniquen, y **HTTP** es el idioma que usan en la web: tu programa manda una **petición** y el servidor responde.

No necesitas saber cómo está implementado el sistema por dentro: solo le pides algo y te lo devuelve. Esa capa que esconde la complejidad es la magia de las APIs.

---

## 🧩 ¿Qué es una API?

**API** = *Application Programming Interface* (Interfaz de Programación de Aplicaciones). Un conjunto de reglas para que dos programas se comuniquen.

Compara las dos formas de acceder a los datos de una base de usuarios:

```python
# Sin API — accedes directamente a la BD (malo)
import sqlite3
conn = sqlite3.connect("usuarios.db")
conn.execute("SELECT * FROM usuarios")

# Con API — pides datos a un servicio
import requests
respuesta = requests.get("https://miapi.com/usuarios")
datos = respuesta.json()
```

> Las APIs ponen una capa de abstracción: no necesitas saber cómo está implementado el sistema por dentro.

En la segunda opción no sabes qué motor de base de datos hay detrás, ni en qué lenguaje está el servidor, ni cuántos servidores son. Solo sabes la regla: "si pido `GET /usuarios`, me llega una lista". Eso es trabajar con una API.

---

## 🕸️ La web en tres piezas

Toda la web se reduce a tres piezas que ya conoces por navegar:

- **Cliente**: quien pide (tu navegador, tu código Python).
- **Servidor**: quien responde (una máquina en algún lugar del mundo).
- **Protocolo HTTP**: las reglas de la conversación.

La **URL** (*Uniform Resource Locator*) es la dirección a la que mandas la petición. Se divide en partes con significado:

```
 https://api.github.com/users/python?per_page=10
 └─┬──┘ └─────┬──────┘ └────┬─────┘ └─────┬──────┘
scheme      host          path         query params
(https)  (api.github.com) (/users/python) (?per_page=10)
```

| Parte | Ejemplo | Qué es |
|---|---|---|
| scheme | `https` | El protocolo de transporte (cifrado en HTTPS) |
| host | `api.github.com` | El servidor al que hablas |
| path | `/users/python` | El recurso concreto que pides |
| query | `?per_page=10` | Parámetros extra de la petición |

---

## 📬 Petición y respuesta

HTTP funciona por **intercambio de mensajes**: tú envías una petición y el servidor te contesta.

**Petición** (lo que envía el cliente):
```
GET /users/python HTTP/1.1
Host: api.github.com
User-Agent: python-requests/2.31.0
Accept: */*
```

**Respuesta** (lo que devuelve el servidor):
```
HTTP/1.1 200 OK
Content-Type: application/json
Date: ...

{"login": "python", "public_repos": 42}
```

En los próximos puntos desmontarás cada pieza: los **métodos** (GET, POST…) en el [punto 2](/ApuntesPSP/06-apis-rest-y-http/02-metodos-http), los **códigos de estado** (200, 404…) en el [punto 4](/ApuntesPSP/06-apis-rest-y-http/04-codigos-de-estado) y el **cuerpo JSON** en el [punto 5](/ApuntesPSP/06-apis-rest-y-http/05-json).

---

## 🛵 La analogía del pedido a domicilio

Una petición HTTP es como **pedir comida a domicilio**:

1. Buscas el restaurante (**URL**) que vende lo que quieres.
2. Mándasle tu pedido (**petición HTTP**): "una pizza margarita" (GET), "que me pongas en la carta un plato nuevo" (POST).
3. El restaurante (servidor) la cocina y te la entrega (**respuesta HTTP**).
4. La entrega llega con un estado: "✅ todo bien" (200), "❌ el plato no existe" (404), "🔒 el restaurante no te atiende sin reserva" (401).

No te hace falta saber cómo cocina la cocina: solo la dirección y el menú. Esa es la filosofía de las APIs.

---

## 🧠 Mini-chequeo

1. ¿Qué es una API y qué problema resuelve?
2. Identifica las cuatro partes de esta URL: `https://api.openweathermap.org/data/2.5/weather?q=Valencia`.
3. ¿Qué dos mensajes intercambian cliente y servidor en HTTP?

<details>
<summary>🔄 Respuestas</summary>

1. Una **API** es un conjunto de reglas para que dos programas se comuniquen. Resuelve la **abstracción**: no necesitas saber cómo está implementado el sistema por dentro.
2. `scheme` = `https`, `host` = `api.openweathermap.org`, `path` = `/data/2.5/weather`, `query` = `?q=Valencia`.
3. Una **petición** (lo que pide el cliente, con método, URL y cabeceras) y una **respuesta** (lo que devuelve el servidor, con código de estado y cuerpo).
</details>

---

## ✅ Resumen en 3 frases

- Una API es un conjunto de reglas que permite a dos programas comunicarse sin conocer su implementación interna.
- La web funciona con HTTP: el cliente manda una petición y el servidor devuelve una respuesta.
- Una URL se compone de scheme, host, path y query: cada parte tiene un significado en la conversación.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| API | Reglas para que dos programas se comuniquen |
| HTTP | El protocolo de intercambio de mensajes de la web |
| URL | La dirección completa de un recurso |
| Cliente | Quien pide (tu navegador o tu código) |
| Servidor | Quien responde y sirve los datos |
| Query | Parámetros extra de la URL (`?clave=valor`) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/06-apis-rest-y-http) · **Siguiente:** [02 · Métodos HTTP](/ApuntesPSP/06-apis-rest-y-http/02-metodos-http)