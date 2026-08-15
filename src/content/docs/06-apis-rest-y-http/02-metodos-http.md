---
title: 02 — Métodos HTTP
description: "Los verbos de la web: leer, crear, actualizar y borrar 🚦"
---

<p><small>Los verbos de la web: leer, crear, actualizar y borrar 🚦</small></p>

> 🗺️ **Estás en:** 🌐 **U06 · APIs REST y HTTP** → 02 · Métodos HTTP

---

## 📬 La idea en una frase

> HTTP tiene **verbos** (métodos) que dicen qué quieres hacer con un recurso: **GET** lo lee, **POST** lo crea, **PUT** lo reemplaza, **PATCH** lo retoca y **DELETE** lo borra.

Los métodos HTTP se corresponden con las operaciones **CRUD** de las bases de datos: Create, Read, Update, Delete. Elegir el verbo correcto es la primera decisión de una API bien hecha.

---

## 🚦 Los verbos de HTTP

| Método | CRUD | Uso | Cuerpo |
|--------|------|-----|--------|
| `GET` | Read | Obtener datos | ❌ No |
| `POST` | Create | Crear recurso | ✅ Sí |
| `PUT` | Update | Reemplazar completo | ✅ Sí |
| `PATCH` | Update | Actualizar parcial | ✅ Sí |
| `DELETE` | Delete | Borrar recurso | ❌ No |

Un mismo recurso puede "vivir" con todos los verbos. La URL no cambia: cambia el método:

```
GET    /usuarios        → Listar usuarios
GET    /usuarios/5      → Obtener usuario 5
POST   /usuarios        → Crear usuario
PUT    /usuarios/5      → Actualizar usuario 5
DELETE /usuarios/5      → Borrar usuario 5
```

---

## 🧾 ¿Qué es la idempotencia?

Un método es **idempotente** si llamarlo **una vez o varias produce el mismo resultado**. Piensa en un interruptor: "apagar la luz" es idempotente (da igual cuántas veces lo hagas, la luz queda apagada); "sumar 1" no lo es.

| Método | Idempotente | Por qué |
|---|---|---|
| `GET` | ✅ | Leer 5 veces devuelve lo mismo |
| `PUT` | ✅ | Reemplazar el recurso completo: el estado final es igual |
| `DELETE` | ✅ | Borrar algo ya borrado sigue borrado |
| `POST` | ❌ | Cada llamada crea un recurso **nuevo**: 2 llamadas = 2 recursos |
| `PATCH` | ⚠️ | Depende de la operación parcial que apliques |

> 💡 Si un cliente reenvía una petición por culpa de un timeout, un método idempotente (PUT) es seguro de repetir; un POST podría duplicar el recurso.

---

## 🐍 Métodos en Python

Con `requests`, cada método es una función: `requests.get`, `requests.post`, `requests.put`, `requests.delete`…

```python
import requests

# POST — crear un recurso
nuevo_usuario = {"nombre": "Ana", "email": "ana@x.com"}
resp = requests.post("https://miapi.com/usuarios", json=nuevo_usuario)
print(resp.status_code)  # 201 Created

# DELETE — borrar
resp = requests.delete("https://miapi.com/usuarios/5")
print(resp.status_code)  # 204 No Content
```

El `json=` de `requests.post` convierte el diccionario Python a JSON automáticamente y lo envía en el cuerpo de la petición. Lo verás en detalle en el [punto 7](/ApuntesPSP/06-apis-rest-y-http/07-requests-post).

---

## 🧠 Mini-chequeo

1. ¿Qué método usarías para… a) ver un artículo, b) crearlo, c) cambiarlo entero, d) borrarlo?
2. ¿Por qué POST no es idempotente y PUT sí?
3. ¿GET lleva cuerpo en la petición? ¿Y POST?

<details>
<summary>🔄 Respuestas</summary>

1. a) **GET**, b) **POST**, c) **PUT** (o PATCH para solo un campo), d) **DELETE**.
2. Porque cada **POST** crea un **recurso nuevo**: llamarlo dos veces duplica. **PUT** reemplaza el recurso completo, así que el estado final tras una o mil llamadas es el mismo.
3. **GET no lleva cuerpo** (solo la URL y cabeceras); **POST sí** (el cuerpo es el recurso a crear).
</details>

---

## ✅ Resumen en 3 frases

- HTTP tiene cinco verbos con un propósito claro: GET lee, POST crea, PUT reemplaza, PATCH retoca y DELETE borra.
- La idempotencia distingue los métodos seguros de repetir (GET, PUT, DELETE) del que crea (POST).
- En Python, cada método es una función de `requests` y `json=` se encarga del cuerpo automáticamente.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Método HTTP | El verbo que dice qué hacer con el recurso |
| GET | Leer datos (sin cuerpo, idempotente) |
| POST | Crear un recurso (con cuerpo, no idempotente) |
| PUT | Reemplazar el recurso completo |
| PATCH | Actualizar solo una parte |
| DELETE | Borrar el recurso |
| Idempotente | Repetirlo no cambia el resultado |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/06-apis-rest-y-http) · **Anterior:** [01 · Web y HTTP](/ApuntesPSP/06-apis-rest-y-http/01-web-y-http) · **Siguiente:** [03 · Principios REST](/ApuntesPSP/06-apis-rest-y-http/03-principios-rest)