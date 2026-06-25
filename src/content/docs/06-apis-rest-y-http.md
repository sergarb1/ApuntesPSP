---
title: "TEMA 06 — APIs REST y HTTP"
nav_order: 06
---

## TEMA 06 — APIs REST y HTTP (RA4a-b)

> "Una API REST es como un camarero: tú le dices lo que quieres (GET/POST), y él te lo trae (JSON). No tienes que saber cómo lo cocina la cocina."

---

## Índice

1. [¿Qué es una API?](#qué-es-una-api)
2. [REST — el estándar de las APIs modernas](#rest--el-estándar-de-las-apis-modernas)
3. [HTTP — los verbos](#http--los-verbos)
4. [Códigos de estado — ¿salió bien o mal?](#códigos-de-estado--salió-bien-o-mal)
5. [La librería requests](#la-librería-requests)
6. [JSON — el idioma de las APIs](#json--el-idioma-de-las-apis)
7. [Cabeceras y parámetros](#cabeceras-y-parámetros)
8. [Be the code, my friend, my friend — Petición paso a paso](#be-the-code-my-friend-my-friend--petición-paso-a-paso)
9. [🥊 El ring de los conceptos — GET vs POST vs PUT vs DELETE](#el-ring-de-los-conceptos--get-vs-post-vs-put-vs-delete)
10. [Preguntas tontas — APIs y REST](#preguntas-tontas--apis-y-rest)
11. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
12. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## ¿Qué es una API?

**API** = Application Programming Interface. Un conjunto de reglas para que dos programas se comuniquen.

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

---

## REST — el estándar de las APIs modernas

**REST** (Representational State Transfer) se basa en:
- **Recursos**: cada entidad tiene una URL (`/usuarios`, `/productos/123`)
- **Verbos HTTP**: GET (leer), POST (crear), PUT (actualizar), DELETE (borrar)
- **Sin estado**: cada petición contiene todo lo necesario
- **JSON**: formato de intercambio

```
GET    /usuarios        → Listar usuarios
GET    /usuarios/5      → Obtener usuario 5
POST   /usuarios        → Crear usuario
PUT    /usuarios/5      → Actualizar usuario 5
DELETE /usuarios/5      → Borrar usuario 5
```

---

## HTTP — los verbos

| Método | CRUD | Uso | Cuerpo |
|--------|------|-----|--------|
| `GET` | Read | Obtener datos | ❌ No |
| `POST` | Create | Crear recurso | ✅ Sí |
| `PUT` | Update | Reemplazar completo | ✅ Sí |
| `PATCH` | Update | Actualizar parcial | ✅ Sí |
| `DELETE` | Delete | Borrar recurso | ❌ No |

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

---

## Códigos de estado — ¿salió bien o mal?

| Código | Significado | Situación típica |
|--------|-------------|------------------|
| **200** | OK | GET exitoso |
| **201** | Created | POST exitoso (recurso creado) |
| **204** | No Content | DELETE exitoso |
| **301** | Moved Permanently | La URL cambió |
| **400** | Bad Request | Enviaste datos incorrectos |
| **401** | Unauthorized | Falta autenticación |
| **403** | Forbidden | No tienes permiso |
| **404** | Not Found | El recurso no existe |
| **429** | Too Many Requests | Te pasaste del límite |
| **500** | Internal Server Error | Error del servidor |
| **503** | Service Unavailable | El servicio está caído |

> **Consejo**: los códigos 2xx son éxito, 4xx son error TUYO, 5xx son error DEL SERVIDOR.

```python
resp = requests.get("https://api.github.com/users/python")
if resp.status_code == 200:
    print("✅ Todo bien:", resp.json()["login"])
elif resp.status_code == 404:
    print("❌ Usuario no encontrado")
else:
    print(f"⚠️ Código inesperado: {resp.status_code}")
```

---

## La librería requests

`requests` es la librería estándar de facto para hacer peticiones HTTP en Python.

```python
import requests

# GET básico
resp = requests.get("https://api.github.com")
print(resp.status_code)     # 200
print(resp.headers)         # Cabeceras de respuesta
print(resp.elapsed)         # Tiempo que tardó

# POST con JSON
resp = requests.post(
    "https://jsonplaceholder.typicode.com/posts",
    json={"title": "foo", "body": "bar", "userId": 1}
)
print(resp.json())          # La respuesta parseada como dict
```

### Propiedades de una respuesta

| Propiedad | Qué devuelve |
|-----------|--------------|
| `resp.status_code` | Código HTTP (int) |
| `resp.ok` | `True` si 200-399 |
| `resp.text` | Cuerpo como string |
| `resp.json()` | Cuerpo como dict (¡lanza excepción si no es JSON!) |
| `resp.headers` | Dict con cabeceras |
| `resp.elapsed` | Objeto timedelta |

---

## JSON — el idioma de las APIs

JSON = JavaScript Object Notation. Es el formato de intercambio de datos más usado en APIs.

```json
{
  "nombre": "Ana",
  "edad": 25,
  "email": "ana@x.com",
  "activo": true,
  "intereses": ["Python", "redes", "cripto"]
}
```

En Python, JSON se convierte automáticamente a diccionarios y listas:

```python
import requests

resp = requests.get("https://api.github.com/users/python")
datos = resp.json()

print(datos["login"])          # "python"
print(datos["public_repos"])   # 42
print(datos["avatar_url"])     # "https://..."
```

---

## Cabeceras y parámetros

### Parámetros de consulta (query params)

```python
params = {"q": "python", "page": 1, "per_page": 10}
resp = requests.get("https://api.github.com/search/repositories", params=params)
# URL final: https://api.github.com/search/repositories?q=python&page=1&per_page=10
```

### Cabeceras personalizadas

```python
cabeceras = {
    "Authorization": "Bearer mi-token-secreto",
    "Accept": "application/json",
    "User-Agent": "MiApp/1.0"
}
resp = requests.get("https://api.github.com/user", headers=cabeceras)
```

---

## Be the code, my friend, my friend — Petición paso a paso

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

7. requests.parsea el JSON → dict de Python

8. Extraemos datos['login'] → "python"
```

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

## 🥊 El ring de los conceptos — GET vs POST vs PUT vs DELETE

**GET**: — Yo soy el más usado. Solo pido información, no cambio nada. Soy seguro, idempotente y cacheable.

**POST**: — Pues yo soy el que crea cosas. Sin mí no habría nuevos recursos. Eso sí, no soy idempotente: si llamas dos veces, creo dos veces.

**PUT**: — Idempotente, como GET, pero yo actualizo. Mando el recurso completo y reemplazo lo que haya.

**DELETE**: — Y yo elimino. También idempotente: da igual cuántas veces lo llames, el recurso ya no está.

**GET**: — Oye, ¿y PATCH? Siempre se nos olvida...

**POST**: — Ese es el primo moderno que actualiza solo un campo. Pero mejor no liarnos, que ya somos suficientes.

> **Moraleja**: Cada verbo HTTP tiene un propósito: GET (leer), POST (crear), PUT (reemplazar), DELETE (borrar). Elegir el correcto es hacer bien REST.

---

## Preguntas tontas — APIs y REST

**❓ ¿Necesito siempre una API key?**
No, hay APIs públicas sin key (como la de GitHub para datos públicos). Pero la mayoría requiere autenticación.

**❓ ¿Puedo modificar datos con GET?**
Técnicamente sí, pero **no debes**. GET es para leer. POST/PUT para modificar. Si usas GET para modificar, violas REST.

**❓ ¿Qué es CORS y me afecta en Python?**
CORS es una restricción del navegador. En Python no te afecta (no hay navegador). Es cosa de JavaScript.

**❓ ¿Qué significa que una API sea "sin estado" (stateless)?**
Que cada petición contiene toda la información necesaria. El servidor no guarda contexto entre peticiones. Como un camarero que no recuerda tu cara: cada vez le tienes que decir todo.

**❓ ¿JSON o XML?**
Hoy en día, JSON gana por goleada. XML solo se usa en entornos legacy (bancos, SOAP).

---

## ✏️ Aprieta el lápiz

1. **GET a GitHub API**: Obtén los datos del usuario "python" y muestra su nombre real, repos públicos y seguidores.
2. **Parámetros de búsqueda**: Busca repositorios de Python con más de 1000 estrellas usando `/search/repositories`.
3. **POST a JSONPlaceholder**: Crea un post nuevo en `jsonplaceholder.typicode.com/posts` y muestra el ID devuelto.
4. **Manejo de errores**: Haz GET a una URL que no existe (404) y una que dé error 500. Muestra mensajes adecuados.

---

## RAs cubiertos y criterios de evaluación

### RA4 — Servicios en red (a-b)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA4a | Utiliza APIs REST para obtener datos externos | ✅ |
| RA4b | Maneja peticiones HTTP y procesa respuestas JSON | ✅ |

> RA4c (servidores concurrentes) y RA4d (ThreadPool) se cubren en el **TEMA 10**. RA4e-g (asyncio, disponibilidad, comparativa) se cubren en el **TEMA 11**.
