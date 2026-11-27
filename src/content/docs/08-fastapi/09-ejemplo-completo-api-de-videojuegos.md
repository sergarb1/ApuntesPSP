---
title: "09 — Ejemplo completo: API de videojuegos"
description: "Servidor, base de datos y cliente: una API de verdad, de principio a fin 🎮"
---

<p><small>Servidor, base de datos y cliente: una API de verdad, de principio a fin 🎮</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 09 · Ejemplo completo: API de videojuegos

---

## 📬 La idea en una frase

> Vamos a montar una **API REST de videojuegos retro** con FastAPI y SQLite: un catálogo de consolas y juegos con lecturas, filtros, altas y borrados, más un cliente que la prueba entera.

Es el proyecto que reúne todo lo de la unidad. Cuando lo termines, tendrás una API que podrías enseñar en una entrega.

---

## 🎯 Qué vas a construir

| Pieza | Fichero | Qué hace |
|---|---|---|
| Base de datos | `poblar.py` | Crea las tablas y siembra 9 consolas y 36 juegos |
| API | `main.py` | Expone los endpoints con FastAPI y `sqlite3` |
| Cliente de pruebas | `cliente.py` | Comprueba 10 casos con `requests` |
| Dependencias | `requirements.txt` | `fastapi[standard]`, `requests`, `python-dotenv` |

Endpoints:

| Método | Ruta | Qué hace | Códigos |
|---|---|---|---|
| GET | `/` | Bienvenida y número de juegos | 200 |
| GET | `/consolas` | Consolas con su número de juegos | 200 |
| GET | `/consolas/{id}` | Una consola y sus juegos | 200, 404 |
| GET | `/juegos?consola=&genero=` | Listado con filtros opcionales | 200 |
| GET | `/juegos/{id}` | Un juego con el nombre de su consola | 200, 404 |
| POST | `/juegos` | Alta de un juego | 201, 422, 404 |
| DELETE | `/juegos/{id}` | Borrado de un juego | 204, 404 |

> 💡 **Sin ORM a propósito:** ves el SQL que se ejecuta. Es más código que con SQLAlchemy, pero no hay magia que ocultar en primero.

---

## 📁 Estructura del proyecto

```text
videojuegos-api/
├── poblar.py
├── main.py
├── cliente.py
├── requirements.txt
└── videojuegos.db      ← se genera; no se sube a git
```

`requirements.txt`:

```text
fastapi[standard]
requests
python-dotenv
```

Prepara el entorno:

```bash
python3 -m venv venv
source venv/bin/activate        # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🧩 PARTE 1 — La base de datos

`poblar.py` crea el esquema y lo rellena. Es **idempotente**: si ya existía la base de datos, la borra y la rehace.

```python
#!/usr/bin/env python3
"""poblar.py — crea la base de datos y la siembra con datos retro."""
import sqlite3
from pathlib import Path

RUTA_DB = Path(__file__).parent / "videojuegos.db"

CONSOLAS = [
    ("Nintendo Entertainment System (NES)", "Nintendo", 1985),
    ("Game Boy", "Nintendo", 1989),
    ("Sega Mega Drive", "Sega", 1988),
    ("Super Nintendo (SNES)", "Nintendo", 1991),
    ("Nintendo 64", "Nintendo", 1996),
    ("PlayStation", "Sony", 1994),
    ("Game Boy Advance", "Nintendo", 2001),
    ("Xbox", "Microsoft", 2001),
    ("PlayStation 2", "Sony", 2000),
]

JUEGOS = [
    ("Super Mario Bros.", 1985, "plataformas", 1),
    ("The Legend of Zelda", 1986, "aventura", 1),
    ("Metroid", 1986, "acción", 1),
    ("Mega Man 2", 1988, "plataformas", 1),
    ("Tetris", 1989, "puzzle", 2),
    ("Super Mario Land", 1989, "plataformas", 2),
    ("Zelda: Link's Awakening", 1993, "aventura", 2),
    ("Pokémon Rojo", 1996, "rol", 2),
    ("Golden Axe", 1989, "acción", 3),
    ("Sonic the Hedgehog", 1991, "plataformas", 3),
    ("Streets of Rage 2", 1992, "beat 'em up", 3),
    ("Phantasy Star IV", 1993, "rol", 3),
    ("Super Mario World", 1990, "plataformas", 4),
    ("The Legend of Zelda: A Link to the Past", 1991, "aventura", 4),
    ("Donkey Kong Country", 1994, "plataformas", 4),
    ("Chrono Trigger", 1995, "rol", 4),
    ("Super Mario 64", 1996, "plataformas", 5),
    ("Mario Kart 64", 1996, "carreras", 5),
    ("GoldenEye 007", 1997, "shooter", 5),
    ("The Legend of Zelda: Ocarina of Time", 1998, "aventura", 5),
    ("Crash Bandicoot", 1996, "plataformas", 6),
    ("Resident Evil", 1996, "terror", 6),
    ("Final Fantasy VII", 1997, "rol", 6),
    ("Metal Gear Solid", 1998, "sigilo", 6),
    ("Advance Wars", 2001, "estrategia", 7),
    ("Metroid Fusion", 2002, "acción", 7),
    ("The Legend of Zelda: The Minish Cap", 2004, "aventura", 7),
    ("Pokémon Esmeralda", 2004, "rol", 7),
    ("Halo: Combat Evolved", 2001, "shooter", 8),
    ("Fable", 2004, "rol", 8),
    ("Star Wars: Knights of the Old Republic", 2003, "rol", 8),
    ("Halo 2", 2004, "shooter", 8),
    ("Final Fantasy X", 2001, "rol", 9),
    ("Kingdom Hearts", 2002, "rol", 9),
    ("Grand Theft Auto: San Andreas", 2004, "acción", 9),
    ("Shadow of the Colossus", 2005, "aventura", 9),
]


def main():
    if RUTA_DB.exists():
        RUTA_DB.unlink()
        print("BD anterior eliminada; se rehace desde cero.")

    conexion = sqlite3.connect(RUTA_DB)
    try:
        conexion.executescript(
            """
            CREATE TABLE consolas (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre     TEXT NOT NULL UNIQUE,
                fabricante TEXT NOT NULL,
                anio       INTEGER NOT NULL
            );

            CREATE TABLE juegos (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo     TEXT NOT NULL,
                anio       INTEGER NOT NULL,
                genero     TEXT NOT NULL,
                consola_id INTEGER NOT NULL,
                FOREIGN KEY (consola_id) REFERENCES consolas (id)
            );
            """
        )
        conexion.executemany(
            "INSERT INTO consolas (nombre, fabricante, anio) VALUES (?, ?, ?)",
            CONSOLAS,
        )
        conexion.executemany(
            "INSERT INTO juegos (titulo, anio, genero, consola_id) VALUES (?, ?, ?, ?)",
            JUEGOS,
        )
        conexion.commit()
        print(f"BD creada: {RUTA_DB.name}")
        print(f"  consolas: {len(CONSOLAS)}")
        print(f"  juegos:   {len(JUEGOS)}")
    finally:
        conexion.close()


if __name__ == "__main__":
    main()
```

Ejecuta y comprueba:

```bash
python3 poblar.py
# BD creada: videojuegos.db
#   consolas: 9
#   juegos:   36
```

> 💡 La lista de juegos usa el **id de la consola** (1-9) en la última posición. Como las consolas se insertan en orden y `AUTOINCREMENT` empieza en 1, los ids coinciden con la posición de la lista.

---

## 🧩 PARTE 2 — La API

### Paso 1 — Modelo y conexión

```python
import sqlite3
from contextlib import closing
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

RUTA_DB = Path(__file__).parent / "videojuegos.db"

app = FastAPI(
    title="API de videojuegos retro",
    description="Catálogo de videojuegos clásicos por consola. Ejemplo de la UD 9.",
    version="1.0.0",
)


class JuegoNuevo(BaseModel):
    """Lo que ENTRA por POST: Pydantic valida antes de tocar la BD."""
    titulo: str = Field(..., min_length=1, examples=["Metroid"])
    anio: int = Field(..., ge=1970, le=2030, examples=[1986])
    genero: str = Field(..., examples=["acción"])
    consola_id: int = Field(..., ge=1, examples=[1])


def obtener_conexion():
    """Conexión nueva por petición, con filas que se leen como dicts."""
    if not RUTA_DB.exists():
        raise HTTPException(
            status_code=500,
            detail="No existe videojuegos.db — ejecuta antes: python3 poblar.py",
        )
    conexion = sqlite3.connect(RUTA_DB)
    conexion.row_factory = sqlite3.Row
    return conexion
```

> ⚠️ **El 500 está justificado aquí:** si falta la base de datos, el servidor no está listo. Es un fallo de despliegue, no del cliente.

### Paso 2 — Bienvenida y consolas

```python
@app.get("/")
def inicio():
    with closing(obtener_conexion()) as conexion, conexion:
        total = conexion.execute("SELECT COUNT(*) FROM juegos").fetchone()[0]
    return {"mensaje": "API de videojuegos retro", "juegos": total}


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


@app.get("/consolas/{id_consola}")
def leer_consola(id_consola: int):
    with closing(obtener_conexion()) as conexion, conexion:
        fila = conexion.execute(
            "SELECT * FROM consolas WHERE id = ?", (id_consola,)
        ).fetchone()
        if fila is None:
            raise HTTPException(404, detail=f"No existe la consola {id_consola}")
        juegos = conexion.execute(
            "SELECT id, titulo, anio, genero FROM juegos WHERE consola_id = ? ORDER BY anio",
            (id_consola,),
        ).fetchall()
    return {**dict(fila), "juegos": [dict(j) for j in juegos]}
```

**`LEFT JOIN` + `COUNT`:** `LEFT` conserva las consolas sin juegos, y `COUNT(j.id)` cuenta solo los juegos reales (0 si no hay). Con `INNER JOIN`, una consola vacía desaparecería del listado.

### Paso 3 — Juegos con filtros y detalle

```python
@app.get("/juegos")
def listar_juegos(consola: Optional[int] = None, genero: Optional[str] = None):
    consulta = "SELECT * FROM juegos WHERE 1=1"
    parametros: list = []
    if consola is not None:
        consulta += " AND consola_id = ?"
        parametros.append(consola)
    if genero:
        consulta += " AND genero = ?"
        parametros.append(genero)
    consulta += " ORDER BY anio"
    with closing(obtener_conexion()) as conexion, conexion:
        filas = conexion.execute(consulta, parametros).fetchall()
    return [dict(f) for f in filas]


@app.get("/juegos/{id_juego}")
def leer_juego(id_juego: int):
    with closing(obtener_conexion()) as conexion, conexion:
        fila = conexion.execute(
            """SELECT j.*, c.nombre AS consola
               FROM juegos j JOIN consolas c ON c.id = j.consola_id
               WHERE j.id = ?""",
            (id_juego,),
        ).fetchone()
    if fila is None:
        raise HTTPException(404, detail=f"No existe el juego {id_juego}")
    return dict(fila)
```

### Paso 4 — Alta y borrado

```python
@app.post("/juegos", status_code=201)
def crear_juego(juego: JuegoNuevo):
    # Pydantic ya validó título, año y consola_id: si falla, 422 antes de entrar
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


@app.delete("/juegos/{id_juego}", status_code=204)
def borrar_juego(id_juego: int):
    with closing(obtener_conexion()) as conexion, conexion:
        cursor = conexion.execute("DELETE FROM juegos WHERE id = ?", (id_juego,))
        conexion.commit()
        if cursor.rowcount == 0:
            raise HTTPException(404, detail=f"No existe el juego {id_juego}")
```

**Los tres finales de un POST:**

| Situación | Quién lo detecta | Código |
|---|---|---|
| Datos mal formados | Pydantic | **422** |
| Consola inexistente | Tu comprobación | **404** |
| Todo correcto | `INSERT` + `commit` | **201** con `id` |

---

## 🧩 PARTE 3 — El cliente de pruebas

`cliente.py` recorre los caminos importantes y cuenta los aciertos:

```python
#!/usr/bin/env python3
"""cliente.py — batería de pruebas de la API con requests.
El servidor debe estar arrancado: uvicorn main:app
"""
import requests

BASE = "http://127.0.0.1:8000"


def comprobar(nombre, condicion):
    marca = "✓" if condicion else "✗"
    print(f"  [{marca}] {nombre}")
    return condicion


def main():
    resultados = []

    r = requests.get(BASE, timeout=10)
    print(f"1. GET / → {r.status_code} {r.json()}")
    resultados.append(comprobar("devuelve 200 y el nº de juegos", r.status_code == 200))

    r = requests.get(BASE + "/consolas", timeout=10)
    consolas = r.json()
    print(f"2. GET /consolas → {len(consolas)} consolas")
    resultados.append(comprobar("hay 9 consolas", len(consolas) == 9))

    r = requests.get(BASE + "/consolas/1", timeout=10)
    datos = r.json()
    print(f"3. GET /consolas/1 → {datos['nombre']} con {len(datos['juegos'])} juegos")
    resultados.append(comprobar("incluye la lista de juegos", len(datos["juegos"]) == 4))

    r = requests.get(BASE + "/consolas/999", timeout=10)
    print(f"4. GET /consolas/999 → {r.status_code} {r.json()['detail']}")
    resultados.append(comprobar("devuelve 404 con detalle", r.status_code == 404))

    r = requests.get(BASE + "/juegos", params={"genero": "rol"}, timeout=10)
    rol = r.json()
    print(f"5. GET /juegos?genero=rol → {len(rol)} juegos")
    resultados.append(comprobar("todos son de rol",
                                all(j["genero"] == "rol" for j in rol)))

    r = requests.get(BASE + "/juegos/1", timeout=10)
    print(f"6. GET /juegos/1 → {r.json()}")
    resultados.append(comprobar("trae el campo consola", "consola" in r.json()))

    nuevo = {"titulo": "Metroid Fusion", "anio": 2002,
             "genero": "acción", "consola_id": 7}
    r = requests.post(BASE + "/juegos", json=nuevo, timeout=10)
    print(f"7. POST /juegos → {r.status_code} {r.json()}")
    resultados.append(comprobar("crea y devuelve el id",
                                r.status_code == 201 and "id" in r.json()))

    malo = {"titulo": "", "anio": 1000, "genero": "x", "consola_id": 1}
    r = requests.post(BASE + "/juegos", json=malo, timeout=10)
    print(f"8. POST inválido → {r.status_code}")
    resultados.append(comprobar("devuelve 422 sin tocar la BD", r.status_code == 422))

    r = requests.post(BASE + "/juegos",
                      json={"titulo": "Juego raro", "anio": 1995,
                            "genero": "prueba", "consola_id": 999}, timeout=10)
    print(f"9. POST con FK inexistente → {r.status_code} {r.json()['detail']}")
    resultados.append(comprobar("devuelve 404 por la FK", r.status_code == 404))

    r = requests.get(BASE + "/juegos/9999", timeout=10)
    print(f"10. GET /juegos/9999 → {r.status_code}")
    resultados.append(comprobar("devuelve 404", r.status_code == 404))

    total = sum(resultados)
    print(f"\nResultado: {total}/{len(resultados)} comprobaciones OK")
    if total != len(resultados):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
```

> 💡 **`raise SystemExit(1)`** al final hace que el script devuelva código de error si algo falla. Así puedes encadenarlo en una entrega automática: si el cliente falla, el proceso falla.

---

## ▶️ Ejecutar y comprobar

Tres terminales o dos y una pausa:

```bash
# 1. Poblar la base de datos
python3 poblar.py

# 2. Arrancar el servidor
uvicorn main:app --reload

# 3. En otra terminal: lanzar el cliente
python3 cliente.py
```

Salida esperada:

```text
Resultado: 10/10 comprobaciones OK
```

Y mientras el servidor sigue arrancado, abre `http://127.0.0.1:8000/docs`:

- Prueba `GET /juegos` con `Try it out`.
- Prueba `POST /juegos` con el ejemplo que trae Swagger y mira el **201**.
- Prueba a mandar un año 1000 y observa el **422** con el detalle por campo.

> ⚠️ **Si el cliente falla todo:** comprueba que el servidor está arrancado y que has ejecutado `poblar.py`. El error típico es `Connection refused` (servidor apagado) o un 500 diciendo que falta `videojuegos.db`.

---

## 🚀 Ideas para ampliar

| Ampliación | Qué repasas |
|---|---|
| Paginación en `/juegos` | `LIMIT`/`OFFSET` del punto 6 |
| `PUT /juegos/{id}` | Sustitución completa del punto 4 |
| `GET /juegos/buscar?q=` | `LIKE` y orden de rutas |
| API key con `Depends` | Seguridad del punto 8 |
| `pytest` con `TestClient` | Pruebas del punto 7 |

---

## 🧠 Mini-chequeo

1. ¿Por qué el listado de consolas usa `LEFT JOIN` y no `INNER JOIN`?
2. ¿Qué tres códigos puede devolver `POST /juegos` y por qué?
3. ¿Qué pasa si olvidas `conexion.commit()` en el alta?

<details>
<summary>🔄 Respuestas</summary>

1. Para que las consolas **sin juegos** también aparezcan, con un conteo de 0.
2. **201** si todo va bien, **422** si el cuerpo no valida con Pydantic y **404** si la consola indicada no existe.
3. El `INSERT` se descarta al cerrar la conexión: la respuesta diría 201 pero el juego no estaría guardado.
</details>

---

## ✅ Resumen en 3 frases

- El proyecto separa la creación de datos (`poblar.py`), la API (`main.py`) y las pruebas (`cliente.py`), con SQLite como almacenamiento.
- La API expone lecturas con filtros, detalle con 404, alta validada con 201/422/404 y borrado con 204.
- El cliente comprueba diez casos reales y devuelve error si alguno falla, lo que convierte la entrega en algo verificable.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| `poblar.py` | Script que crea y siembra la base de datos |
| `LEFT JOIN` | Une tablas conservando las filas sin correspondencia |
| `rowcount` | Filas afectadas por un `UPDATE`/`DELETE` |
| `SystemExit(1)` | Termina el script con código de error |
| Idempotente | Ejecutarlo varias veces deja el mismo resultado |
| `examples` | Ejemplo que Pydantic muestra en `/docs` |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Anterior:** [08 · Seguridad y despliegue](/ApuntesPSP/08-fastapi/08-seguridad-y-despliegue) · **Siguiente:** [10 · Cierre](/ApuntesPSP/08-fastapi/10-cierre)
