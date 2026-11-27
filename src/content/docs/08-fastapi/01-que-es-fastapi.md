---
title: 01 — ¿Qué es FastAPI?
description: "El framework para construir APIs en Python: ASGI, uvicorn y Pydantic 🧩"
---

<p><small>El framework para construir APIs en Python: ASGI, uvicorn y Pydantic 🧩</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 01 · ¿Qué es FastAPI?

---

## 📬 La idea en una frase

> **FastAPI** es un framework de Python que convierte una función en un endpoint HTTP: tú declaras la ruta y los tipos, y él se encarga del resto (JSON, validación, errores y documentación).

Hasta ahora has sido el cliente: `requests.get()` llamaba a servidores ajenos. En esta unidad cruzas la puerta y te pones detrás del mostrador.

---

## 🔁 Del cliente al servidor

En la UD 7 aprendiste la conversación completa: el cliente envía `GET /juegos`, el servidor responde `200 OK` con un JSON. Todo eso lo hacía un servidor que no era tuyo.

```text
Cliente (requests)  ──GET /juegos──▶  Servidor  ──▶  JSON de respuesta
```

Ahora ese servidor lo escribes tú. Y no a mano con `socket`: usas un framework que se ocupa de la fontanería.

| Pieza | Quién la pone | Qué hace |
|---|---|---|
| Red, TCP y HTTP | `uvicorn` | Escucha en el puerto, acepta conexiones y parsea la petición |
| Rutas y respuestas JSON | **FastAPI** | Decide qué función atiende cada ruta y serializa el resultado |
| Validación de datos | **Pydantic** | Comprueba tipos, rangos y campos obligatorios |
| Documentación | **FastAPI** | Genera Swagger y ReDoc a partir de tu propio código |

---

## 🧱 ¿Qué es un framework?

Un **framework** es una biblioteca que marca la estructura de tu programa: tú rellenas los huecos y él controla el flujo. En Flask o FastAPI el hueco se llama **ruta**:

```python
@app.get("/saludo")
def saludar():
    return {"mensaje": "hola"}
```

La frase `@app.get("/saludo")` registra la función `saludar` como respuesta a un `GET /saludo`. Nadie llama a `saludar()` a mano: la llama el framework cuando llega la petición.

> 💡 Es el patrón **inversión de control**: no llamas tú al framework, es el framework el que te llama a ti cuando toca.

---

## ⚡ ASGI y WSGI: el motor debajo

Un framework web necesita un **servidor** que hable HTTP y le pase las peticiones. Hay dos estándares:

| Estándar | Qué significa | Frameworks | Servidores |
|---|---|---|---|
| **WSGI** | Interfaz síncrona (una petición por hilo/proceso) | Flask, Django clásico | `gunicorn`, `waitress` |
| **ASGI** | Interfaz asíncrona (peticiones concurrentes en un bucle de eventos) | FastAPI, Starlette | `uvicorn`, `hypercorn` |

FastAPI se apoya en **Starlette** (ASGI) y en **Pydantic**. Se arranca con `uvicorn`, que es el servidor ASGI de referencia:

```bash
uvicorn main:app --reload
#         └──┬─┘ └┬┘ └──┬──┘
#          módulo │    recarga automática al guardar
#                 └── nombre de la variable FastAPI()
```

> 🔌 **Analogía:** ASGI es como un camarero que atiende varias mesas sin quedarse esperando a la cocina; WSGI es un camarero que acompaña cada plato hasta el final. Para muchas conexiones lentas (esperas de base de datos), ASGI gana.

---

## ✅ ¿Por qué FastAPI y no Flask?

| Ventaja | En la práctica |
|---|---|
| **Tipos que validan** | Si declaras `anio: int`, un `"dos mil"` se rechaza con un 422 y un mensaje claro |
| **Documentación gratis** | `/docs` (Swagger) y `/redoc` se generan solos, siempre sincronizados |
| **Rendimiento** | Al ser ASGI, aguanta mucha concurrencia de E/S con pocos recursos |
| **Menos código** | Una función con tipos sustituye a decenas de líneas de comprobaciones |
| **Estándar de la industria** | Es el framework de referencia en ofertas de backend Python |

Flask sigue siendo estupendo para proyectos pequeños y plantillas HTML. Para **APIs JSON**, FastAPI es hoy la opción por defecto.

---

## 📦 Instalación

Siempre en un entorno virtual, para no ensuciar el Python del sistema:

```bash
python3 -m venv venv
source venv/bin/activate        # En Windows: venv\Scripts\activate
pip install "fastapi[standard]"
```

`fastapi[standard]` instala también `uvicorn`, `httpx` (para pruebas) y el cliente de línea de órdenes `fastapi`. Verifica:

```bash
pip list | grep -i fastapi
```

> ⚠️ **Ojo con el nombre:** el paquete se llama `fastapi` y se importa igual (`from fastapi import FastAPI`). No existe ningún paquete llamado `fast-api`.

---

## 🧠 Mini-chequeo

1. ¿Qué tres piezas se encargan de la red, las rutas y la validación?
2. ¿Qué diferencia hay entre WSGI y ASGI?
3. ¿Qué hace `--reload` al arrancar `uvicorn`?

<details>
<summary>🔄 Respuestas</summary>

1. **uvicorn** (red/HTTP), **FastAPI** (rutas y JSON) y **Pydantic** (validación).
2. **WSGI** es síncrono (un hilo o proceso por petición); **ASGI** es asíncrono y permite atender muchas peticiones concurrentes en un bucle de eventos.
3. Vigila los ficheros y **reinicia el servidor** automáticamente al guardar cambios. Es cómodo en desarrollo, no se usa en producción.
</details>

---

## ✅ Resumen en 3 frases

- FastAPI es un framework ASGI que convierte funciones de Python en endpoints HTTP, con validación de tipos y documentación automática.
- Se apoya en Starlette para la parte web y en Pydantic para validar los datos, y se arranca con `uvicorn main:app`.
- Frente a Flask, gana en validación, documentación y concurrencia, que es justo lo que necesita una API REST.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Framework | Biblioteca que marca la estructura del programa y llama a tu código |
| Endpoint | Ruta concreta que atiende una petición (`GET /juegos`) |
| ASGI | Interfaz asíncrona entre framework web y servidor |
| WSGI | Interfaz síncrona, la de Flask y Django clásico |
| uvicorn | Servidor ASGI que ejecuta la aplicación |
| Pydantic | Biblioteca de validación de datos por tipos |
| OpenAPI | Esquema que describe la API y del que nacen `/docs` y `/redoc` |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Siguiente:** [02 · Primera aplicación y rutas](/ApuntesPSP/08-fastapi/02-primera-aplicacion-y-rutas)
