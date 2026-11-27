---
title: Boletín UD 9 — Avanzado (Resuelto)
description: Soluciones de los 12 retos avanzados de FastAPI
---

# 💪 Boletín UD 9 — Avanzado (Resuelto)

> Soluciones de los 12 retos. Cada una indica la pieza clave; adáptala a los nombres de tu proyecto.

---

## 1. CRUD de consolas

```python
class ConsolaNueva(BaseModel):
    nombre: str = Field(..., min_length=1)
    fabricante: str
    anio: int = Field(..., ge=1970, le=2030)

@app.post("/consolas", status_code=201)
def crear_consola(consola: ConsolaNueva):
    with closing(obtener_conexion()) as conexion, conexion:
        cursor = conexion.execute(
            "INSERT INTO consolas (nombre, fabricante, anio) VALUES (?, ?, ?)",
            (consola.nombre, consola.fabricante, consola.anio),
        )
        conexion.commit()
        nuevo_id = cursor.lastrowid
    return {"id": nuevo_id, **consola.model_dump()}

@app.delete("/consolas/{id_consola}", status_code=204)
def borrar_consola(id_consola: int):
    with closing(obtener_conexion()) as conexion, conexion:
        cursor = conexion.execute("DELETE FROM consolas WHERE id = ?", (id_consola,))
        conexion.commit()
        if cursor.rowcount == 0:
            raise HTTPException(404, detail=f"No existe la consola {id_consola}")
```

⚠️ Si la consola tiene juegos, el `DELETE` deja filas huérfanas (SQLite no comprueba la FK por defecto). Comprueba antes o borra en cascada.

## 2. Filtros combinados

```python
@app.get("/juegos")
def listar_juegos(consola: Optional[int] = None, genero: Optional[str] = None,
                  desde: Optional[int] = None, hasta: Optional[int] = None):
    consulta = "SELECT * FROM juegos WHERE 1=1"
    parametros: list = []
    if consola is not None:
        consulta += " AND consola_id = ?"
        parametros.append(consola)
    if genero:
        consulta += " AND genero = ?"
        parametros.append(genero)
    if desde is not None:
        consulta += " AND anio >= ?"
        parametros.append(desde)
    if hasta is not None:
        consulta += " AND anio <= ?"
        parametros.append(hasta)
    consulta += " ORDER BY anio"
    with closing(obtener_conexion()) as conexion, conexion:
        filas = conexion.execute(consulta, parametros).fetchall()
    return [dict(f) for f in filas]
```

## 3. Búsqueda por título

```python
@app.get("/juegos/buscar")          # antes que /juegos/{id_juego}
def buscar_juegos(q: str):
    with closing(obtener_conexion()) as conexion, conexion:
        filas = conexion.execute(
            "SELECT * FROM juegos WHERE titulo LIKE ? ORDER BY titulo",
            (f"%{q}%",),
        ).fetchall()
    return [dict(f) for f in filas]
```

## 4. Paginación con metadatos

```python
@app.get("/juegos")
def listar_juegos(pagina: int = 1, tamano: int = 10):
    if pagina < 1 or tamano < 1:
        raise HTTPException(400, detail="pagina y tamano deben ser positivos")
    with closing(obtener_conexion()) as conexion, conexion:
        filas = conexion.execute(
            "SELECT * FROM juegos ORDER BY id LIMIT ? OFFSET ?",
            (tamano, (pagina - 1) * tamano),
        ).fetchall()
        total = conexion.execute("SELECT COUNT(*) FROM juegos").fetchone()[0]
    return {"pagina": pagina, "tamano": tamano, "total": total,
            "resultados": [dict(f) for f in filas]}
```

## 5. PUT frente a PATCH

```python
class JuegoCompleto(BaseModel):
    titulo: str
    anio: int
    genero: str
    consola_id: int

class JuegoParcial(BaseModel):
    titulo: Optional[str] = None
    anio: Optional[int] = None
    genero: Optional[str] = None
    consola_id: Optional[int] = None

@app.patch("/juegos/{id_juego}")
def modificar_juego(id_juego: int, cambios: JuegoParcial):
    datos = cambios.model_dump(exclude_unset=True)
    if not datos:
        raise HTTPException(400, detail="No hay campos que modificar")
    columnas = ", ".join(f"{c} = ?" for c in datos)
    with closing(obtener_conexion()) as conexion, conexion:
        cursor = conexion.execute(
            f"UPDATE juegos SET {columnas} WHERE id = ?",
            (*datos.values(), id_juego),
        )
        conexion.commit()
        if cursor.rowcount == 0:
            raise HTTPException(404, detail=f"No existe el juego {id_juego}")
    return {"id": id_juego, **datos}
```

Los nombres de columna salen del **modelo**, no del cliente: siguen siendo seguros.

## 6. API key

```python
import os
from fastapi import Depends, Header
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY")

def verificar_clave(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(401, detail="API key inválida")

@app.post("/juegos", status_code=201, dependencies=[Depends(verificar_clave)])
def crear_juego(juego: JuegoNuevo):
    ...
```

## 7. CORS

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 8. Pruebas con TestClient

```python
from fastapi.testclient import TestClient
from main import app

cliente = TestClient(app)

def test_listado():
    assert cliente.get("/juegos").status_code == 200

def test_detalle_inexistente():
    assert cliente.get("/juegos/9999").status_code == 404

def test_alta():
    r = cliente.post("/juegos", json={"titulo": "Tetris", "anio": 1989,
                                      "genero": "puzzle", "consola_id": 2})
    assert r.status_code == 201

def test_validacion():
    r = cliente.post("/juegos", json={"titulo": "", "anio": 1000,
                                      "genero": "x", "consola_id": 1})
    assert r.status_code == 422
```

Se ejecutan con `pytest -q`, sin servidor arrancado.

## 9. Respuesta filtrada

```python
class JuegoResumen(BaseModel):
    id: int
    titulo: str
    anio: int
    consola: str

@app.get("/juegos/{id_juego}", response_model=JuegoResumen)
def leer_juego(id_juego: int):
    ...
```

Cualquier columna extra de la consulta (`genero`, `consola_id`…) desaparece de la respuesta.

## 10. Conteo con LEFT JOIN

```python
@app.get("/consolas")
def listar_consolas():
    with closing(obtener_conexion()) as conexion, conexion:
        filas = conexion.execute(
            """SELECT c.id, c.nombre, c.fabricante, c.anio,
                      COUNT(j.id) AS juegos
               FROM consolas c
               LEFT JOIN juegos j ON j.consola_id = c.id
               GROUP BY c.id
               ORDER BY c.anio"""
        ).fetchall()
    return [dict(f) for f in filas]
```

## 11. Alta con clave foránea

```python
@app.post("/juegos", status_code=201)
def crear_juego(juego: JuegoNuevo):
    with closing(obtener_conexion()) as conexion, conexion:
        consola = conexion.execute(
            "SELECT id FROM consolas WHERE id = ?", (juego.consola_id,)
        ).fetchone()
        if consola is None:
            raise HTTPException(404, detail=f"No existe la consola {juego.consola_id}")
        cursor = conexion.execute(
            "INSERT INTO juegos (titulo, anio, genero, consola_id) VALUES (?, ?, ?, ?)",
            (juego.titulo, juego.anio, juego.genero, juego.consola_id),
        )
        conexion.commit()
        nuevo_id = cursor.lastrowid
    return {**juego.model_dump(), "id": nuevo_id}
```

Un cuerpo con `"anio": 1000` sigue devolviendo **422** antes de ejecutar nada de esto.

## 12. Cliente 10/10

```python
import requests

BASE = "http://127.0.0.1:8000"
resultados = []

def comprobar(nombre, condicion):
    print(f"  [{'✓' if condicion else '✗'}] {nombre}")
    resultados.append(condicion)

comprobar("listado 200", requests.get(f"{BASE}/juegos", timeout=10).status_code == 200)
comprobar("detalle 404", requests.get(f"{BASE}/juegos/9999", timeout=10).status_code == 404)
comprobar("alta 201", requests.post(
    f"{BASE}/juegos",
    json={"titulo": "Tetris", "anio": 1989, "genero": "puzzle", "consola_id": 2},
    timeout=10,
).status_code == 201)
comprobar("validación 422", requests.post(
    f"{BASE}/juegos",
    json={"titulo": "", "anio": 1000, "genero": "x", "consola_id": 1},
    timeout=10,
).status_code == 422)

print(f"\nResultado: {sum(resultados)}/{len(resultados)}")
if not all(resultados):
    raise SystemExit(1)
```
