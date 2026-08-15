---
title: "07 — requests: POST, PUT y DELETE"
description: "Enviar datos a la API y manejar los errores 📤"
---

<p><small>Enviar datos a la API y manejar los errores 📤</small></p>

> 🗺️ **Estás en:** 🌐 **U06 · APIs REST y HTTP** → 07 · requests: POST, PUT y DELETE

---

## 📬 La idea en una frase

> Con `requests.post`, `requests.put` y `requests.delete` **creas, reemplazas y borras recursos**: el cuerpo se envía con `json=` y la respuesta se trata igual que en el GET.

Los verbos del [punto 2](/ApuntesPSP/06-apis-rest-y-http/02-metodos-http) cobran vida: `json=` convierte tu diccionario a JSON y lo pone en el cuerpo de la petición.

---

## 📤 POST: crear un recurso

Para crear, `requests.post` con `json=`:

```python
import requests

resp = requests.post(
    "https://jsonplaceholder.typicode.com/posts",
    json={"title": "foo", "body": "bar", "userId": 1}
)
print(resp.status_code)     # 201 Created
print(resp.json())          # La respuesta parseada como dict
```

JSONPlaceholder es una API de pruebas: cada POST te devuelve el recurso creado con un ID nuevo (101, 102…). Un POST exitoso responde **201 Created** (visto en el [punto 4](/ApuntesPSP/06-apis-rest-y-http/04-codigos-de-estado)).

---

## 📝 PUT y PATCH: actualizar

**PUT** reemplaza el recurso **completo** (idempotente); **PATCH** actualiza solo **una parte**:

```python
import requests

# PUT — reemplazo completo
resp = requests.put(
    "https://jsonplaceholder.typicode.com/posts/1",
    json={"title": "nuevo titulo", "body": "nuevo cuerpo", "userId": 1}
)
print(resp.status_code)          # 200 OK
print(resp.json()["title"])      # "nuevo titulo"
```

En la práctica casi todo el mundo usa `requests.put` con `json=` del mismo modo; `requests.patch` existe para los casos de "toca solo este campo".

---

## 🗑️ DELETE: borrar

```python
import requests

resp = requests.delete("https://jsonplaceholder.typicode.com/posts/1")
print(resp.status_code)          # 200 OK (JSONPlaceholder)
# En REST puro, un borrado exitoso devuelve 204 No Content
```

El código de estado te confirma el resultado: en REST canónico, DELETE exitoso → **204 No Content** (sin cuerpo que leer).

---

## 🛡️ Manejo de errores: status_code y raise_for_status

Como viste en el [punto 4](/ApuntesPSP/06-apis-rest-y-http/04-codigos-de-estado), `requests` **no lanza excepción** ante un 4xx/5xx. Dos estrategias:

```python
import requests

# Opción 1: comprobar el código a mano
resp = requests.post("https://jsonplaceholder.typicode.com/posts",
                     json={"title": "x", "body": "y"})
if resp.status_code == 201:
    print("✅ Post creado con ID", resp.json()["id"])
else:
    print("❌ Algo falló:", resp.status_code)

# Opción 2: raise_for_status() lanza excepción si es 4xx/5xx
try:
    resp = requests.get("https://httpbin.org/status/404")
    resp.raise_for_status()          # lanza HTTPError
    datos = resp.json()
except requests.exceptions.HTTPError as e:
    print("⚠️ Error HTTP:", e)
```

`raise_for_status()` es la vía rápida: si la respuesta es mala, lanza una excepción y tu código no sigue parseando un error.

---

## 🧩 Pool Puzzle — Petición API con errores

Estas líneas hacen una petición a una API y manejan errores. ¿En qué orden van?

```
a)     if respuesta.status_code == 200:
b) import requests
c)         print("Error:", respuesta.status_code)
d) respuesta = requests.get("https://api.github.com/users/python")
e)         datos = respuesta.json()
f)     else:
g)             print(datos["login"])
h) try:
```

<details>
<summary>🔓 Solución</summary>

**Orden correcto:** b → h → d → a → e → g → f → c

```python
import requests                                            # b) import
try:                                                       # h) try por si falla la red
    respuesta = requests.get("https://api.github.com/users/python")  # d) petición
    if respuesta.status_code == 200:                       # a) ¿OK?
        datos = respuesta.json()                           # e) parsear JSON
        print(datos["login"])                              # g) "python"
    else:                                                  # f) error HTTP
        print("Error:", respuesta.status_code)             # c) 404, 500, etc.
```

**Claves del puzzle:**
- El `try` rodea toda la operación de red
- Primero se comprueba el código HTTP, luego se parsea
- Sin el `if` de status, podrías intentar parsear un 404
</details>

---

## 🧠 Mini-chequeo

1. ¿Qué hace `json=` en `requests.post`?
2. ¿Qué código devuelve un POST exitoso y qué devuelve un DELETE exitoso?
3. ¿Qué lanza `raise_for_status()` y cuándo lo usarías?

<details>
<summary>🔄 Respuestas</summary>

1. Convierte el **diccionario Python a JSON** y lo pone en el **cuerpo** de la petición.
2. POST exitoso → **201 Created**; DELETE exitoso → **204 No Content** (en REST; JSONPlaceholder responde 200).
3. Lanza una excepción `HTTPError` si el código es 4xx/5xx. La usarías para abortar el flujo sin parsear una respuesta mala.
</details>

---

## ✅ Resumen en 3 frases

- `requests.post/put/delete` crean, reemplazan y borran recursos enviando el cuerpo con `json=`.
- El resultado se lee igual que en el GET: `status_code` y `resp.json()`.
- Los errores se manejan comprobando `status_code` o dejando que `raise_for_status()` lance la excepción.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| requests.post | Envía un recurso nuevo con `json=` |
| requests.put | Reemplaza el recurso completo |
| requests.patch | Actualiza solo una parte |
| requests.delete | Borra el recurso |
| json= | Convierte un dict Python a JSON en el cuerpo |
| raise_for_status() | Lanza HTTPError si el código es 4xx/5xx |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/06-apis-rest-y-http) · **Anterior:** [06 · requests: el GET](/ApuntesPSP/06-apis-rest-y-http/06-requests-get) · **Siguiente:** [08 · Práctica: mini cliente de API](/ApuntesPSP/06-apis-rest-y-http/08-practica-api)