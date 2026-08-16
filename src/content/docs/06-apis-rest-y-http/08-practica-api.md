---
title: "08 — Práctica: mini cliente de API"
description: "Sé el código, un cliente completo y los ejercicios del lápiz 🛠️"
---

<p><small>Sé el código, un cliente completo y los ejercicios del lápiz 🛠️</small></p>

> 🗺️ **Estás en:** 🌐 **U06 · APIs REST y HTTP** → 08 · Práctica: mini cliente de API

---

## 📬 La idea en una frase

> Aquí junta todo lo aprendido en un solo programa: un **mini cliente de API** que pide datos a servicios reales, los parsea y maneja los errores — y un paseo "siendo" la librería `requests`.

De aquí saldrás con un programa completo que ya habla el idioma de la web.

---

## 🏗️ El mini cliente de API

Un cliente de API típico se compone de tres bloques: hacer la petición, comprobar el estado y procesar los datos. Todo junto:

```python
import requests

def obtener_usuario(nombre):
    """Devuelve un dict con los datos del usuario o None si no existe."""
    resp = requests.get(f"https://api.github.com/users/{nombre}")
    if resp.status_code == 200:
        return resp.json()
    if resp.status_code == 404:
        print(f"❌ El usuario '{nombre}' no existe.")
    else:
        print(f"⚠️ Código inesperado: {resp.status_code}")
    return None

def resumen_usuario(datos):
    print(f"👤 Login:     {datos['login']}")
    print(f"📛 Nombre:    {datos['name']}")
    print(f"📦 Repos:     {datos['public_repos']}")
    print(f"🧑‍🤝‍🧑 Seguidores: {datos['followers']}")

if __name__ == "__main__":
    datos = obtener_usuario("python")
    if datos:
        resumen_usuario(datos)
```

Observa el patrón que repite cualquier cliente real: `requests.get` → comprobar `status_code` → `resp.json()` → usar los datos. Es el mismo esqueleto del [punto 6](/ApuntesPSP/06-apis-rest-y-http/06-requests-get), ahora con errores bien delimitados.

---

## ⭐ Sé el código: una petición GET, milisegundo a milisegundo

> "Sé la librería requests y recorre cada milisegundo de una petición GET."

```python
import requests

# 1. Construimos la URL y parámetros
url = "https://api.github.com/users/python"

# 2. Llamamos a requests.get()
respuesta = requests.get(url)

# 3. Procesamos la respuesta
datos = respuesta.json()
print(f"Usuario: {datos['login']}")
print(f"Repos: {datos['public_repos']}")
```

**Traza interna**:
```
1. requests.get("https://api.github.com/users/python")

2. requests construye la URL:
   → scheme: https
   → host: api.github.com
   → path: /users/python

3. Abre conexión TCP a api.github.com:443 (HTTPS)
   → DNS lookup: api.github.com → 140.82.121.5
   → Three-way handshake TCP
   → Handshake TLS (cifrado)

4. Envía petición HTTP:
   GET /users/python HTTP/1.1
   Host: api.github.com
   User-Agent: python-requests/2.31.0
   Accept-Encoding: gzip, deflate
   Accept: */*

5. ⏳ Espera respuesta (~150ms)

6. Recibe respuesta:
   HTTP/1.1 200 OK
   Content-Type: application/json
   ...

7. requests parsea el JSON → dict de Python

8. Extraemos datos['login'] → "python"
```

Todo lo que en la U04 hacías a mano —DNS, TCP, TLS, construir la petición— lo hace `requests` en una línea. Tu única tarea es leer la respuesta.

---

## ✏️ Aprieta el lápiz

1. **GET a GitHub API**: obtén los datos del usuario "python" y muestra su nombre real, repos públicos y seguidores.
2. **Parámetros de búsqueda**: busca repositorios de Python con más de 1000 estrellas usando `/search/repositories`.
3. **POST a JSONPlaceholder**: crea un post nuevo en `jsonplaceholder.typicode.com/posts` y muestra el ID devuelto.
4. **Manejo de errores**: haz GET a una URL que no existe (404) y una que dé error 500. Muestra mensajes adecuados.

<details>
<summary>🔓 Soluciones</summary>

**1. GET a GitHub API**

```python
import requests
datos = requests.get("https://api.github.com/users/python").json()
print(f"Nombre real: {datos['name']}")
print(f"Repos públicos: {datos['public_repos']}")
print(f"Seguidores: {datos['followers']}")
```

**2. Parámetros de búsqueda**

```python
import requests
params = {"q": "python stars:>1000", "sort": "stars", "per_page": 5}
resp = requests.get("https://api.github.com/search/repositories", params=params)
for repo in resp.json()["items"]:
    print(repo["full_name"], "★", repo["stargazers_count"])
```

`params` construye la query string automáticamente y `sort=stars` ordena por estrellas.

**3. POST a JSONPlaceholder**

```python
import requests
resp = requests.post(
    "https://jsonplaceholder.typicode.com/posts",
    json={"title": "foo", "body": "bar", "userId": 1}
)
print(resp.status_code)          # 201 Created
print("ID del post:", resp.json()["id"])    # 101
```

**4. Manejo de errores**

```python
import requests

def pedir(url):
    resp = requests.get(url)
    if resp.status_code == 200:
        print(f"✅ {url}: OK")
    elif resp.status_code == 404:
        print(f"❌ {url}: no encontrado")
    elif resp.status_code >= 500:
        print(f"⚠️ {url}: error del servidor ({resp.status_code})")
    else:
        print(f"⚠️ {url}: código {resp.status_code}")

pedir("https://jsonplaceholder.typicode.com/posts/1")      # 200
pedir("https://jsonplaceholder.typicode.com/posts/999999") # 404
pedir("https://httpbin.org/status/500")                    # 500
```
</details>

---

## 🧠 Mini-chequeo

1. ¿Cuál es el esqueleto de cualquier petición con `requests`?
2. En la traza del "Sé el código", ¿qué hace `requests` entre el paso 3 y el 6?
3. ¿Por qué comprobar `status_code` antes de `resp.json()` es una buena práctica?

<details>
<summary>🔄 Respuestas</summary>

1. `requests.get(url)` → comprobar `status_code` (o `resp.ok`) → `resp.json()` → usar los datos.
2. Abre la conexión TCP, hace el handshake TLS, envía la petición HTTP y espera y recibe la respuesta.
3. Porque si la respuesta es un 404/500, `resp.json()` puede lanzar una excepción al intentar parsear un cuerpo que no es JSON. Primero confirmas que hay datos, luego los lees.
</details>

---

## ✅ Resumen en 3 frases

- Un cliente de API se reduce a tres bloques: petición, comprobación de estado y procesamiento de datos.
- `requests` hace por ti todo el trabajo de red (DNS, TCP, TLS) que en la U04 hacías a mano con sockets.
- El patrón `status_code` → `json()` es la clave para que tu código no reviente ante respuestas de error.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Cliente de API | Programa que habla con una API mediante peticiones HTTP |
| Esqueleto de petición | `requests.get` → `status_code` → `resp.json()` → usar datos |
| Traza interna | El camino que sigue la petición dentro de la librería |
| Endpoint | La URL concreta de un recurso o acción de la API |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/06-apis-rest-y-http) · **Anterior:** [07 · requests: POST, PUT y DELETE](/ApuntesPSP/06-apis-rest-y-http/07-requests-post) · **Siguiente:** [09 · Cierre](/ApuntesPSP/06-apis-rest-y-http/09-cierre)