---
title: 02 — Primera aplicación y rutas
description: "Tu primer servidor: decoradores, parámetros y /docs 🌐"
---

<p><small>Tu primer servidor: decoradores, parámetros y /docs 🌐</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 02 · Primera aplicación y rutas

---

## 📬 La idea en una frase

> Una aplicación FastAPI es un objeto `app` con funciones decoradas: cada `@app.get(...)` es una ruta, y lo que devuelve la función se convierte en JSON automáticamente.

Con eso ya tienes un servidor HTTP funcionando. Sin sockets, sin parsear peticiones, sin escribir cabeceras.

---

## 🚀 El «hola mundo» completo

Crea `main.py`:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def inicio():
    return {"mensaje": "¡Hola desde FastAPI!"}
```

Arranca el servidor:

```bash
uvicorn main:app --reload
```

Y llama desde otra terminal:

```bash
curl http://127.0.0.1:8000/
```

```json
{"mensaje":"¡Hola desde FastAPI!"}
```

Tres cosas han pasado sola:

1. `return` de un **dict** se ha serializado a JSON.
2. La cabecera `Content-Type` ya dice `application/json`.
3. El código de estado es **200** por defecto.

> 💡 Si devuelves una **lista**, FastAPI también la serializa. Si devuelves un tipo no serializable (un `datetime` suelto, un objeto propio), dará error: envuelve los datos en tipos básicos o usa modelos.

---

## 🧭 Rutas: el decorador lo es todo

Cada decorador asocia un **método HTTP** y una **ruta** a una función:

```python
@app.get("/saludo")
def saludar():
    return {"mensaje": "hola"}

@app.get("/estado")
def estado():
    return {"servidor": "ok", "version": "1.0"}
```

| Decorador | Método | Uso típico |
|---|---|---|
| `@app.get` | GET | Leer datos, sin efectos secundarios |
| `@app.post` | POST | Crear un recurso |
| `@app.put` | PUT | Sustituir un recurso |
| `@app.patch` | PATCH | Modificar parte de un recurso |
| `@app.delete` | DELETE | Borrar un recurso |

La ruta siempre empieza por `/` y **no** lleva el dominio: `@app.get("/juegos")`, no `@app.get("http://localhost/juegos")`.

---

## 🔤 Parámetros de ruta

Cuando el identificador forma parte de la dirección, se declara entre llaves y como argumento tipado de la función:

```python
@app.get("/juegos/{id_juego}")
def leer_juego(id_juego: int):
    return {"id": id_juego, "titulo": f"Juego {id_juego}"}
```

- `GET /juegos/7` → `{"id": 7, "titulo": "Juego 7"}`
- `GET /juegos/siete` → **422**: `id_juego` no es un entero. La validación es gratis.

> ⚠️ **Orden de las rutas:** declara primero las fijas y después las dinámicas. Si pones `/juegos/{id_juego}` antes de `/juegos/nuevo`, la segunda nunca se alcanzará porque `nuevo` encaja como `{id_juego}`.

---

## ❓ Parámetros de consulta (query)

Los parámetros que van después de `?` no forman parte de la ruta: se declaran como argumentos **con valor por defecto**.

```python
from typing import Optional

@app.get("/juegos")
def listar_juegos(genero: Optional[str] = None, limite: int = 10):
    return {"genero": genero, "limite": limite}
```

- `GET /juegos` → `{"genero": null, "limite": 10}`
- `GET /juegos?genero=rol&limite=5` → `{"genero": "rol", "limite": 5}`

| Tipo de parámetro | Dónde va | Cómo se declara |
|---|---|---|
| **De ruta** | En el camino: `/juegos/7` | Argumento sin valor por defecto, con `{}` en la ruta |
| **De consulta** | Tras la `?`: `?genero=rol` | Argumento **con** valor por defecto |
| **De cuerpo** | En el JSON del `POST` | Modelo Pydantic (punto 3) |

> 💡 Los parámetros de consulta son **opcionales por naturaleza**: si el cliente no los manda, se usa el valor por defecto.

---

## 📖 La documentación aparece sola

Abre en el navegador `http://127.0.0.1:8000/docs`. Ahí está **Swagger UI**: todas tus rutas, sus parámetros, sus tipos y un botón **Try it out** para lanzar peticiones reales.

Y en `http://127.0.0.1:8000/redoc` tienes la misma información en formato de lectura. Las dos nacen del mismo esquema **OpenAPI**, que puedes descargar en `/openapi.json`.

> 🎁 **Truco de clase:** si el profesor pregunta «¿qué endpoints tiene tu API?», la respuesta es abrir `/docs`. No hay que mantener documentación a mano: se genera del código.

---

## 🧩 El objeto `app` y su información

El constructor acepta metadatos que aparecen en la documentación:

```python
app = FastAPI(
    title="API de videojuegos retro",
    description="Catálogo de juegos clásicos por consola.",
    version="1.0.0",
)
```

No cambian el comportamiento, pero un `/docs` con título y versión da otra impresión en una entrega.

---

## 🧠 Mini-chequeo

1. ¿Qué pasa si devuelves un `dict` desde una función de ruta?
2. ¿Cómo distingue FastAPI un parámetro de ruta de uno de consulta?
3. ¿Dónde consultas la documentación interactiva de tu API?

<details>
<summary>🔄 Respuestas</summary>

1. FastAPI lo serializa a **JSON**, pone `Content-Type: application/json` y responde **200**.
2. El de **ruta** aparece entre `{}` en la ruta y no tiene valor por defecto; el de **consulta** es un argumento con valor por defecto (y viaja tras la `?`).
3. En **`/docs`** (Swagger UI) y en **`/redoc`**; el esquema en bruto está en `/openapi.json`.
</details>

---

## ✅ Resumen en 3 frases

- La aplicación es un objeto `FastAPI()` y cada ruta es una función decorada con `@app.get`, `@app.post`, etc.
- Los parámetros de ruta van entre `{}` y sin valor por defecto; los de consulta, con valor por defecto.
- FastAPI valida los tipos automáticamente y publica `/docs` y `/redoc` sin escribir una línea de documentación.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| `app` | Instancia de `FastAPI` que agrupa todas las rutas |
| Decorador | Línea `@app.get(...)` que registra la función como endpoint |
| Path parameter | Parámetro que forma parte de la ruta (`/juegos/{id}`) |
| Query parameter | Parámetro tras la `?` (`?genero=rol`) |
| 422 | Error de validación: el dato no encaja con el tipo declarado |
| Swagger UI | Interfaz interactiva de `/docs` |
| OpenAPI | Esquema JSON que describe la API |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Anterior:** [01 · ¿Qué es FastAPI?](/ApuntesPSP/08-fastapi/01-que-es-fastapi) · **Siguiente:** [03 · Modelos Pydantic](/ApuntesPSP/08-fastapi/03-modelos-pydantic)
