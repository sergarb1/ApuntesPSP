---
title: 07 — Documentación automática y pruebas
description: "Swagger, OpenAPI y TestClient: demuestra que tu API funciona ✅"
---

<p><small>Swagger, OpenAPI y TestClient: demuestra que tu API funciona ✅</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 07 · Documentación automática y pruebas

---

## 📬 La idea en una frase

> FastAPI genera un esquema **OpenAPI** con tus rutas y tipos, del que salen `/docs` y `/redoc`, y te da un **TestClient** para probar la API sin levantar el servidor a mano.

Documentar y probar deja de ser un trabajo extra: sale casi solo.

---

## 📖 El esquema OpenAPI

**OpenAPI** es un estándar que describe una API en JSON: rutas, métodos, parámetros, cuerpos, respuestas y códigos. FastAPI lo construye leyendo tus decoradores y modelos.

```bash
curl http://127.0.0.1:8000/openapi.json
```

| Ruta | Qué es | Para quién |
|---|---|---|
| `/openapi.json` | El esquema en bruto | Herramientas y generadores de clientes |
| `/docs` | **Swagger UI**: probar peticiones | Desarrollo y clase |
| `/redoc` | **ReDoc**: leer la documentación | Entregas y documentación formal |

> 🎁 **Ventaja real:** si cambias un modelo, la documentación cambia sola. No existe el documento desactualizado que todos odian.

---

## 🏷️ Mejorar la documentación

Un par de metadatos convierten un `/docs` anónimo en uno presentable:

```python
app = FastAPI(
    title="API de videojuegos retro",
    description="Catálogo de juegos clásicos por consola.",
    version="1.0.0",
)

@app.get(
    "/juegos/{id_juego}",
    summary="Ficha de un juego",
    description="Devuelve un juego por su id, con el nombre de su consola.",
    tags=["juegos"],
    responses={404: {"description": "El juego no existe"}},
)
def leer_juego(id_juego: int):
    ...
```

| Campo | Dónde aparece |
|---|---|
| `summary` | Título corto de la operación |
| `description` | Texto largo explicativo |
| `tags` | Agrupa las rutas por tema (juegos, consolas…) |
| `responses` | Documenta los códigos de error posibles |

---

## 🧪 Probar con `TestClient`

El `TestClient` de FastAPI (basado en `httpx`) llama a la aplicación **en memoria**, sin abrir un puerto:

```python
from fastapi.testclient import TestClient
from main import app

cliente = TestClient(app)


def test_inicio():
    respuesta = cliente.get("/")
    assert respuesta.status_code == 200
    assert "juegos" in respuesta.json()


def test_juego_inexistente():
    respuesta = cliente.get("/juegos/9999")
    assert respuesta.status_code == 404
    assert "detail" in respuesta.json()


def test_alta_invalida():
    respuesta = cliente.post("/juegos", json={"titulo": "", "anio": 1000})
    assert respuesta.status_code == 422
```

Se ejecutan con `pytest`:

```bash
pip install pytest
pytest -q
```

> 💡 **Por qué mola:** no hay que arrancar `uvicorn` ni esperar a que el puerto esté libre. Los tests son rápidos y se pueden lanzar en cada cambio.

---

## 🌐 Probar con un cliente real

`TestClient` es ideal para tests, pero en algún momento querrás comprobar la API tal y como la verá otro programa. Un cliente con `requests` reproduce la vida real:

```python
import requests

BASE = "http://127.0.0.1:8000"

def comprobar(nombre, condicion):
    print(f"  [{'✓' if condicion else '✗'}] {nombre}")
    return condicion

r = requests.get(BASE + "/consolas", timeout=10)
comprobar("lista de consolas", r.status_code == 200)

r = requests.post(
    BASE + "/juegos",
    json={"titulo": "Metroid Fusion", "anio": 2002, "genero": "acción", "consola_id": 7},
    timeout=10,
)
comprobar("alta correcta", r.status_code == 201)
print(r.json())
```

| Herramienta | Cuándo usarla |
|---|---|
| **TestClient** | Pruebas automáticas rápidas dentro del proyecto |
| **`requests`** | Probar de verdad el servidor arrancado, como un cliente externo |
| **`/docs`** | Explorar a mano y enseñar la API |
| **curl** | Un vistazo rápido desde la terminal |

---

## ✅ Qué conviene comprobar

Una batería mínima de pruebas cubre los cuatro caminos que siempre fallan:

| Caso | Petición | Esperado |
|---|---|---|
| Camino feliz | `GET /juegos` | **200** con lista |
| Recurso inexistente | `GET /juegos/9999` | **404** con `detail` |
| Creación correcta | `POST /juegos` válido | **201** con `id` |
| Datos inválidos | `POST /juegos` con año 1000 | **422** sin tocar la base de datos |

> ⚠️ **Un test que no comprueba el código de estado no es un test:** `r.json()` puede devolver un error y el programa seguir. Comprueba siempre `status_code` antes de leer el cuerpo.

---

## 🧠 Mini-chequeo

1. ¿De qué se genera el esquema OpenAPI?
2. ¿Qué ventaja tiene `TestClient` frente a arrancar `uvicorn`?
3. ¿Qué cuatro casos mínimos conviene probar en un CRUD?

<details>
<summary>🔄 Respuestas</summary>

1. De los **decoradores y modelos** de la propia aplicación: se genera solo.
2. Llama a la app **en memoria**, sin abrir puerto ni depender de un servidor arrancado; es más rápido y estable.
3. Camino feliz (200), recurso inexistente (404), creación correcta (201) y datos inválidos (422).
</details>

---

## ✅ Resumen en 3 frases

- FastAPI genera un esquema OpenAPI del que nacen `/docs` (Swagger) y `/redoc`, siempre sincronizados con el código.
- `TestClient` ejecuta la aplicación en memoria y permite escribir pruebas con `pytest` sin levantar el servidor.
- Un cliente `requests` comprueba el comportamiento real, y lo mínimo es probar 200, 201, 404 y 422.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| OpenAPI | Estándar JSON que describe la API |
| Swagger UI | Interfaz de `/docs` para probar peticiones |
| ReDoc | Documentación de lectura en `/redoc` |
| `TestClient` | Cliente de pruebas que llama a la app en memoria |
| `pytest` | Framework de pruebas de Python |
| `tags` | Agrupación de rutas en la documentación |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Anterior:** [06 · Filtros, búsqueda y paginación](/ApuntesPSP/08-fastapi/06-filtros-y-paginacion) · **Siguiente:** [08 · Seguridad y despliegue](/ApuntesPSP/08-fastapi/08-seguridad-y-despliegue)
