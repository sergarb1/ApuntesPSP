---
title: 04 — Métodos HTTP y códigos
description: "POST, PUT, PATCH y DELETE con sus códigos de estado 📮"
---

<p><small>POST, PUT, PATCH y DELETE con sus códigos de estado 📮</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 04 · Métodos HTTP y códigos

---

## 📬 La idea en una frase

> En FastAPI cada método HTTP es un decorador y cada código de estado se declara con `status_code` o con `HTTPException`: el cliente sabe siempre qué ha pasado.

En la UD 7 mirabas los códigos desde fuera. Ahora los decides tú.

---

## 📮 Los cinco verbos, con ejemplo

| Método | Decorador | Para qué | Código de éxito |
|---|---|---|---|
| GET | `@app.get` | Leer uno o varios recursos | **200** |
| POST | `@app.post` | Crear un recurso nuevo | **201** |
| PUT | `@app.put` | Sustituir un recurso entero | **200** |
| PATCH | `@app.patch` | Modificar algunos campos | **200** |
| DELETE | `@app.delete` | Borrar un recurso | **204** |

```python
from fastapi import FastAPI, HTTPException, status

app = FastAPI()

JUEGOS = {
    1: {"id": 1, "titulo": "Metroid", "anio": 1986, "genero": "acción"},
    2: {"id": 2, "titulo": "Tetris", "anio": 1989, "genero": "puzzle"},
}

@app.post("/juegos", status_code=status.HTTP_201_CREATED)
def crear_juego(juego: dict):
    nuevo_id = max(JUEGOS) + 1
    JUEGOS[nuevo_id] = {"id": nuevo_id, **juego}
    return JUEGOS[nuevo_id]

@app.put("/juegos/{id_juego}")
def sustituir_juego(id_juego: int, juego: dict):
    if id_juego not in JUEGOS:
        raise HTTPException(status_code=404, detail="Juego no encontrado")
    JUEGOS[id_juego] = {"id": id_juego, **juego}
    return JUEGOS[id_juego]

@app.delete("/juegos/{id_juego}", status_code=status.HTTP_204_NO_CONTENT)
def borrar_juego(id_juego: int):
    if JUEGOS.pop(id_juego, None) is None:
        raise HTTPException(status_code=404, detail="Juego no encontrado")
    # 204: éxito sin cuerpo de respuesta
```

> ⚠️ Los datos en memoria se pierden al reiniciar el servidor. Sirven para entender los verbos; en el punto 5 los cambias por SQLite.

---

## 🚨 `HTTPException`: el error como respuesta

Cuando algo falla por lógica de negocio, no devuelvas un `dict` con `{"error": ...}`: lanza una `HTTPException`.

```python
from fastapi import HTTPException

@app.get("/juegos/{id_juego}")
def leer_juego(id_juego: int):
    if id_juego not in JUEGOS:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el juego {id_juego}",
        )
    return JUEGOS[id_juego]
```

FastAPI la convierte en una respuesta JSON coherente:

```json
{"detail": "No existe el juego 7"}
```

| Ventaja de `HTTPException` | Por qué importa |
|---|---|
| Código correcto | El cliente distingue «no existe» (404) de «me equivoqué» (422) |
| Formato uniforme | Siempre `{"detail": ...}` |
| Documentado | `/docs` muestra los códigos de error posibles |
| No rompe el servidor | Evita un `KeyError` con traza de 500 |

> 💡 Un error **500** significa «el servidor se rompió»: no lo uses para decir «no encontrado». Si tu código revienta con una excepción no controlada, FastAPI devuelve 500 y el cliente no sabe qué pasó.

---

## 🧾 PUT frente a PATCH

| Aspecto | PUT | PATCH |
|---|---|---|
| Alcance | Sustituye el recurso **completo** | Modifica **algunos** campos |
| Campos omitidos | Se pierden o toman valor por defecto | Se conservan |
| Modelo típico | `JuegoCompleto` (todos obligatorios) | `JuegoParcial` (todos opcionales) |
| Idempotente | Sí | Sí |

Para PATCH, el modelo con campos opcionales es la clave:

```python
from typing import Optional

class JuegoParcial(BaseModel):
    titulo: Optional[str] = None
    anio: Optional[int] = None
    genero: Optional[str] = None

@app.patch("/juegos/{id_juego}")
def modificar_juego(id_juego: int, cambios: JuegoParcial):
    if id_juego not in JUEGOS:
        raise HTTPException(404, detail="Juego no encontrado")
    # exclude_unset: solo los campos que el cliente envió de verdad
    datos = cambios.model_dump(exclude_unset=True)
    JUEGOS[id_juego].update(datos)
    return JUEGOS[id_juego]
```

> 💡 `exclude_unset=True` evita sobrescribir con `None` los campos que el cliente no tocó. Sin él, un PATCH para cambiar el título borraría el año.

---

## 🗺️ Del código al mensaje

| Código | Significado | Quién lo lanza en tu API |
|---|---|---|
| **200** | OK | Una lectura o modificación correcta |
| **201** | Created | Un POST que crea un recurso (`status_code=201`) |
| **204** | No Content | Un DELETE correcto, sin cuerpo |
| **400** | Bad Request | Regla de negocio incumplida (`HTTPException`) |
| **404** | Not Found | El id no existe (`HTTPException`) |
| **422** | Unprocessable Entity | El cuerpo no valida contra el modelo |
| **500** | Internal Server Error | Excepción no controlada en tu código |

---

## 🧠 Mini-chequeo

1. ¿Qué código declaras para un POST que crea un recurso?
2. ¿Qué diferencia hay entre PUT y PATCH?
3. ¿Por qué no debe usarse 500 para un recurso inexistente?

<details>
<summary>🔄 Respuestas</summary>

1. **201 Created**, con `status_code=status.HTTP_201_CREATED` en el decorador.
2. **PUT** sustituye el recurso completo; **PATCH** modifica solo los campos enviados.
3. Porque **500** significa que el servidor falló. Un recurso que no existe es un error del cliente mal dirigido: **404**.
</details>

---

## ✅ Resumen en 3 frases

- Cada método HTTP tiene su decorador: `@app.get`, `@app.post`, `@app.put`, `@app.patch` y `@app.delete`.
- El código de éxito se declara con `status_code` (201 al crear, 204 al borrar) y los errores con `HTTPException`.
- PATCH se apoya en campos opcionales y `exclude_unset=True` para no borrar lo que el cliente no envió.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| `status_code` | Código HTTP de éxito que declara el decorador |
| `HTTPException` | Excepción que se convierte en respuesta de error JSON |
| `detail` | Mensaje que viaja en el campo `detail` del error |
| `exclude_unset` | Opción de `model_dump()` que omite campos no enviados |
| Idempotente | Repetir la petición deja el mismo resultado |
| 204 | Éxito sin cuerpo de respuesta |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Anterior:** [03 · Modelos Pydantic](/ApuntesPSP/08-fastapi/03-modelos-pydantic) · **Siguiente:** [05 · Persistencia con SQLite](/ApuntesPSP/08-fastapi/05-persistencia-sqlite)
