---
title: Boletín UD 9 — Inicial (Resuelto)
description: Soluciones de los 8 ejercicios iniciales de FastAPI
---

# ✅ Boletín UD 9 — Inicial (Resuelto)

> Soluciones de los 8 ejercicios. Copia cada una, ejecútala y comprueba el resultado antes de pasar a la siguiente.

---

## 1. Hola, API

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def inicio():
    return {"mensaje": "funciono"}
```

`uvicorn main:app --reload` y `http://127.0.0.1:8000/` devuelve el JSON.

## 2. Ficha por id

```python
@app.get("/juegos/{id_juego}")
def leer_juego(id_juego: int):
    return {"id": id_juego}
```

`GET /juegos/siete` devuelve **422** porque `siete` no se puede convertir a `int`.

## 3. Parámetro de consulta

```python
@app.get("/saludo")
def saludar(nombre: str = "invitado"):
    return {"hola": nombre}
```

`?nombre=Ana` devuelve `Ana`; sin parámetro, `invitado`.

## 4. Primer modelo

```python
from pydantic import BaseModel

class JuegoNuevo(BaseModel):
    titulo: str
    anio: int

@app.post("/juegos")
def crear_juego(juego: JuegoNuevo):
    return {"id": 1, **juego.model_dump()}
```

## 5. Alta con 201

```python
@app.post("/juegos", status_code=201)
def crear_juego(juego: JuegoNuevo):
    return {"id": 1, **juego.model_dump()}
```

## 6. Recurso que no existe

```python
from fastapi import HTTPException

@app.get("/juegos/{id_juego}")
def leer_juego(id_juego: int):
    if id_juego > 10:
        raise HTTPException(status_code=404, detail="no existe")
    return {"id": id_juego}
```

## 7. Documentación

`/docs` muestra el modelo del cuerpo y el ejemplo. Una petición válida devuelve **200**; con `"anio": "dos mil"` la respuesta es **422** e incluye `loc: ["body", "anio"]`.

## 8. El commit que falta

```python
import sqlite3

conexion = sqlite3.connect("pruebas.db")
conexion.execute("CREATE TABLE IF NOT EXISTS pruebas (id INTEGER PRIMARY KEY, texto TEXT)")
conexion.execute("INSERT INTO pruebas (texto) VALUES (?)", ("hola",))
conexion.commit()      # ← sin esto, la fila no se guarda
conexion.close()
```

Sin `commit()`, al cerrar la conexión la fila desaparece: la comprobación posterior devuelve 0 filas.
