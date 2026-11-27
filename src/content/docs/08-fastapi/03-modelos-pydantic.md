---
title: 03 — Modelos Pydantic
description: "Datos que se validan solos: BaseModel, Field y el 422 🛡️"
---

<p><small>Datos que se validan solos: BaseModel, Field y el 422 🛡️</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 03 · Modelos Pydantic

---

## 📬 La idea en una frase

> Un **modelo Pydantic** declara con tipos qué forma tiene un dato; FastAPI lo usa para validar el cuerpo de la petición y rechazar con un **422** cualquier cosa que no encaje.

Es la diferencia más grande frente a Flask: aquí no validas a mano campo por campo, lo declara el tipo.

---

## 🧱 El problema que resuelve

Imagina que llega este `POST /juegos`:

```json
{"titulo": "", "anio": 1200, "genero": 42, "consola_id": "uno"}
```

Sin validación, tu código acabaría guardando basura en la base de datos. Validar a mano sería:

```python
if not isinstance(datos.get("titulo"), str) or not datos["titulo"]:
    return error_400()
if not isinstance(datos.get("anio"), int) or datos["anio"] < 1970:
    return error_400()
# ...y así con cada campo
```

Con Pydantic, esas veinte líneas se reducen a una clase:

```python
from pydantic import BaseModel, Field

class JuegoNuevo(BaseModel):
    titulo: str = Field(..., min_length=1)
    anio: int = Field(..., ge=1970, le=2030)
    genero: str
    consola_id: int = Field(..., ge=1)
```

---

## 📦 `BaseModel` y `Field`

| Pieza | Qué hace |
|---|---|
| `BaseModel` | Clase base: convierte un dict en objeto validado |
| `Field(...)` | Metadatos del campo: obligatorio, longitud, rango, ejemplo |
| `...` | Significa **obligatorio** (si falta, error) |
| `min_length` / `max_length` | Longitud mínima y máxima de un texto |
| `ge` / `le` | Mayor o igual / menor o igual (`ge=1970`) |
| `examples` | Ejemplo que aparece en `/docs` |

> 💡 `Field(...)` sustituye a la comprobación manual. `ge=1970` es «mayor o igual que 1970», así que un año 1200 se rechaza sin escribir un solo `if`.

---

## 🎯 Usar el modelo en una ruta

El modelo se declara como argumento de la función y FastAPI entiende que viene en el **cuerpo** (body) de la petición:

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class JuegoNuevo(BaseModel):
    titulo: str = Field(..., min_length=1)
    anio: int = Field(..., ge=1970, le=2030)
    genero: str
    consola_id: int = Field(..., ge=1)

@app.post("/juegos")
def crear_juego(juego: JuegoNuevo):
    # Aquí 'juego' ya está validado: es un objeto, no un dict
    print(juego.titulo, juego.anio)
    return {"id": 1, **juego.model_dump()}
```

- `juego.titulo` funciona con **atributos**, no con corchetes.
- `juego.model_dump()` lo devuelve a **dict** (útil para guardar o responder).
- Si el cliente manda un campo de más, Pydantic lo **ignora** por defecto.

---

## ❌ El error 422 en detalle

Con el modelo anterior, este envío falla:

```bash
curl -X POST http://127.0.0.1:8000/juegos \
  -H "Content-Type: application/json" \
  -d '{"titulo": "", "anio": 1200, "genero": "rol", "consola_id": 1}'
```

Respuesta (**422 Unprocessable Entity**):

```json
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": ["body", "titulo"],
      "msg": "String should have at least 1 character",
      "input": ""
    },
    {
      "type": "greater_than_equal",
      "loc": ["body", "anio"],
      "msg": "Input should be greater than or equal to 1970",
      "input": 1200
    }
  ]
}
```

Fíjate en lo importante: el error dice **qué campo** (`loc`), **qué regla** (`type`) y **qué valor** llegó (`input`). El cliente puede corregirlo sin adivinar.

| Código | Cuándo lo devuelve FastAPI |
|---|---|
| **422** | El JSON no encaja con el modelo (falta un campo, tipo erróneo, fuera de rango) |
| **400** | Lo lanzas tú con `HTTPException` cuando la lógica de negocio falla |
| **404** | Lo lanzas tú cuando el recurso no existe |

> ⚠️ **Confusión habitual:** un JSON mal formado (comillas sin cerrar) devuelve **422** también, pero con `loc: ["body"]` y un mensaje de parseo. Es el mismo código para «no pude leerlo» y «lo leí pero no me vale».

---

## 📤 Modelos de respuesta

También puedes declarar la forma de lo que **sale**, con `response_model`:

```python
class JuegoLeido(BaseModel):
    id: int
    titulo: str
    anio: int
    genero: str
    consola: str

@app.get("/juegos/{id_juego}", response_model=JuegoLeido)
def leer_juego(id_juego: int):
    return {
        "id": id_juego,
        "titulo": "Metroid",
        "anio": 1986,
        "genero": "acción",
        "consola": "NES",
        "campo_interno": "esto no sale",
    }
```

`campo_interno` **desaparece** de la respuesta: el modelo filtra lo que no declara. Es una forma elegante de no filtrar datos internos por accidente.

---

## 🧬 Modelos anidados y listas

Un modelo puede contener otro modelo o una lista:

```python
class ConsolaLeida(BaseModel):
    id: int
    nombre: str
    anio: int
    juegos: list[JuegoLeido]

@app.get("/consolas/{id_consola}", response_model=ConsolaLeida)
def leer_consola(id_consola: int):
    ...
```

Al declarar `list[JuegoLeido]`, FastAPI valida **cada elemento** de la lista. Si uno no encaja, la respuesta falla en desarrollo y te avisa antes de publicar.

> 💡 En Python 3.9+ puedes escribir `list[JuegoLeido]`; en versiones antiguas se usaba `List[JuegoLeido]` con `from typing import List`.

---

## 🧠 Mini-chequeo

1. ¿Qué significa `Field(..., ge=1970)`?
2. ¿Qué código devuelve FastAPI si falta un campo obligatorio del modelo?
3. ¿Para qué sirve `response_model`?

<details>
<summary>🔄 Respuestas</summary>

1. Que el campo es **obligatorio** (`...`) y su valor debe ser **mayor o igual que 1970** (`ge`).
2. **422 Unprocessable Entity**, con el detalle de qué campo y qué regla falló.
3. Para declarar la **forma de la respuesta**: valida los datos de salida y elimina los campos que no estén en el modelo.
</details>

---

## ✅ Resumen en 3 frases

- Un modelo Pydantic es una clase con tipos y reglas (`Field`) que valida los datos de entrada sin escribir comprobaciones a mano.
- Si el cuerpo no encaja, FastAPI responde 422 con la ruta del campo, la regla incumplida y el valor recibido.
- `response_model` hace lo mismo con la salida: valida y filtra los campos antes de enviarlos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| `BaseModel` | Clase base de Pydantic para definir modelos de datos |
| `Field` | Reglas del campo: obligatorio, rango, longitud, ejemplo |
| `model_dump()` | Convierte el modelo validado en un `dict` |
| 422 | Error de validación con detalle por campo |
| `response_model` | Modelo que valida y filtra la respuesta |
| `loc` | Ruta del campo que falla dentro del cuerpo (`["body", "anio"]`) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Anterior:** [02 · Primera aplicación y rutas](/ApuntesPSP/08-fastapi/02-primera-aplicacion-y-rutas) · **Siguiente:** [04 · Métodos HTTP y códigos](/ApuntesPSP/08-fastapi/04-metodos-http-y-codigos)
