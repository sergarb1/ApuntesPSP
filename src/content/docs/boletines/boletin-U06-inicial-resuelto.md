---
title: Boletín U06 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de APIs REST y HTTP
---

# ✅ Boletín U06 — Inicial (Resuelto)

---

## 1. GET a JSONPlaceholder

```python
import requests
resp = requests.get("https://jsonplaceholder.typicode.com/posts/1")
print(resp.status_code)  # 200
```

`requests.get` no lanza excepción ante errores: el código de estado te lo dice `resp.status_code`.

## 2. Título del post

```python
import requests
resp = requests.get("https://jsonplaceholder.typicode.com/posts/1")
print(resp.json()["title"])
```

`resp.json()` convierte el cuerpo JSON a un **dict** de Python, y con `["title"]` accedes al campo.

## 3. Contar usuarios

```python
import requests
resp = requests.get("https://jsonplaceholder.typicode.com/users")
usuarios = resp.json()
print(f"Hay {len(usuarios)} usuarios")  # 10
```

Cuando la respuesta es una lista de recursos, `resp.json()` devuelve una **lista** de diccionarios y `len()` cuenta los elementos.

## 4. GET a GitHub

```python
import requests
resp = requests.get("https://api.github.com/users/python")
print(resp.status_code)  # 200
```

## 5. Mostrar JSON

```python
import requests
resp = requests.get("https://api.github.com/users/python")
print(resp.json())
```

`resp.json()` convierte el JSON a diccionario Python.

## 6. Nombre real

```python
import requests
datos = requests.get("https://api.github.com/users/python").json()
print(datos["name"])  # "Python"
```

Encadenas `requests.get(...).json()` para ir directo al dict, y con `datos["name"]` sacas el nombre real.

## 7. Métodos HTTP

| Método | Operación CRUD | Uso |
|---|---|---|
| GET | **Read** | Obtener datos (sin cuerpo) |
| POST | **Create** | Crear recurso (con cuerpo) |
| PUT | **Update** | Reemplazar el recurso completo |
| PATCH | **Update** | Actualizar solo una parte |
| DELETE | **Delete** | Borrar el recurso |

## 8. Códigos de estado

a) 200 → **OK** (GET exitoso)
b) 201 → **Created** (POST exitoso, recurso creado)
c) 204 → **No Content** (DELETE exitoso)
d) 400 → **Bad Request** (enviaste datos incorrectos)
e) 401 → **Unauthorized** (falta autenticación)
f) 404 → **Not Found** (el recurso no existe)
g) 500 → **Internal Server Error** (error del servidor)

> Los **2xx** son éxito, los **4xx** son error del cliente (tuyo) y los **5xx** son error del servidor.