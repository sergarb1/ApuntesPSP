---
title: Boletín U06 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de APIs REST y HTTP
---

# 💪 Boletín U06 — Avanzado (Resuelto)

---

## 1. PUT para actualizar

```python
import requests
resp = requests.put(
    "https://jsonplaceholder.typicode.com/posts/1",
    json={"title": "nuevo titulo", "body": "nuevo cuerpo", "userId": 1}
)
print(resp.status_code)            # 200 OK
print(resp.json()["title"])        # "nuevo titulo"
```

`requests.put` con `json=` reemplaza el recurso **completo**. PUT es **idempotente**: repetirlo deja el recurso en el mismo estado.

## 2. DELETE un recurso

```python
import requests
resp = requests.delete("https://jsonplaceholder.typicode.com/posts/1")
print(resp.status_code)            # 200 OK
```

JSONPlaceholder responde **200** con cuerpo vacío. En REST canónico, un borrado exitoso devuelve **204 No Content** (sin cuerpo que leer). DELETE también es **idempotente**: da igual cuántas veces lo llames, el recurso ya no está.

## 3. HEAD request

```python
import requests
resp = requests.head("https://api.github.com")
print(resp.headers["Content-Type"])            # "application/json; charset=utf-8"
print(resp.headers["X-RateLimit-Remaining"])   # 60
```

`requests.head` solo pide **cabeceras**, sin cuerpo: es barato y sirve para comprobar que una API responde o consultar los límites de tasa.

## 4. 🎯 Info de usuario de GitHub

```python
import requests
datos = requests.get("https://api.github.com/users/python").json()

print(f"Nombre: {datos['name']}")
print(f"Bio: {datos['bio']}")
print(f"Repos públicos: {datos['public_repos']}")
print(f"Seguidores: {datos['followers']}")
print(f"Creado: {datos['created_at']}")
```

`resp.json()` te da el dict completo y cada campo se accede por su clave (`name`, `bio`, `public_repos`, `followers`, `created_at`).

## 5. 🔍 Buscador de repositorios

```python
import requests
params = {"q": "python stars:>1000", "sort": "stars", "per_page": 5}
resp = requests.get("https://api.github.com/search/repositories", params=params)

for repo in resp.json()["items"]:
    print(repo["full_name"], "★", repo["stargazers_count"])
```

`params` construye la query string automáticamente. La búsqueda devuelve `items`, una lista de repositorios, y de cada uno sacas `full_name` y `stargazers_count`.

## 6. 🧩 API con paginación

```python
import requests
repos = []

for page in (1, 2):
    params = {"page": page, "per_page": 10}
    resp = requests.get("https://api.github.com/users/python/repos", params=params)
    repos.extend(resp.json())

print(f"Repos obtenidos: {len(repos)}")   # 20
for repo in repos:
    print(repo["name"])
```

Con `page` y `per_page` recorres la paginación: cada petición devuelve 10 repos y `extend()` los acumula en la lista. Es la técnica que usan los clientes reales para traer conjuntos completos.

## 7. 🎭 POST y respuesta

```python
import requests

nuevo = {"title": "Hola API", "body": "Probando POST", "userId": 1}
resp = requests.post("https://jsonplaceholder.typicode.com/posts", json=nuevo)
print(resp.status_code)          # 201 Created
print("ID:", resp.json()["id"])  # 101

verificacion = requests.get("https://jsonplaceholder.typicode.com/posts/101")
print(verificacion.json()["title"])   # "Hola API"
```

El POST devuelve **201 Created** con el recurso creado (ID 101). El GET posterior a ese ID confirma que la creación ha sido real.

## 8. ⏱ Tiempo de respuesta

```python
import requests, time

apis = {
    "GitHub": "https://api.github.com",
    "JSONPlaceholder": "https://jsonplaceholder.typicode.com/posts/1",
    "httpbin": "https://httpbin.org/get",
    "ReqRes": "https://reqres.in/api/users/1",
    "OpenNotify": "http://api.open-notify.org/iss-now.json",
}

for nombre, url in apis.items():
    inicio = time.time()
    requests.get(url)
    fin = time.time()
    ms = (fin - inicio) * 1000
    print(f"{nombre}: {ms:.0f} ms")
```

`time.time()` antes y después de cada `requests.get()` te da los milisegundos. La más rápida cambia según la red del momento, pero siempre es la que menos distancia recorre y mejor responde. Es la comparativa que luego usarás en el [TEMA 11](/ApuntesPSP/11-asyncio-y-disponibilidad) con asyncio.

## 9. 🏗️ Cliente de API con caché

```python
import requests, time

cache = {}
TTL = 60  # segundos de vida de cada entrada

def obtener(url):
    ahora = time.time()
    if url in cache:
        dato, timestamp = cache[url]
        if ahora - timestamp < TTL:
            print(f"📦 Desde caché: {url}")
            return dato
    print(f"🌐 Petición real: {url}")
    dato = requests.get(url).json()
    cache[url] = (dato, ahora)
    return dato

print(obtener("https://jsonplaceholder.typicode.com/posts/1"))
print(obtener("https://jsonplaceholder.typicode.com/posts/1"))  # 📦 Desde caché
```

El diccionario usa la **URL como clave** y guarda `(dato, timestamp)`. Antes de pedir, se comprueba si la URL está en caché y si su timestamp sigue dentro del TTL. La segunda llamada no sale a la red: responde al instante desde el diccionario.