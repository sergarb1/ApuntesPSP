---
title: 05 — Persistencia con SQLite
description: "Tus datos sobreviven al reinicio: sqlite3 sin ORM 🗄️"
---

<p><small>Tus datos sobreviven al reinicio: sqlite3 sin ORM 🗄️</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 05 · Persistencia con SQLite

---

## 📬 La idea en una frase

> **SQLite** es una base de datos en un solo fichero y viene incluida en Python: abres una conexión por petición, ejecutas SQL y haces `commit` para que el cambio no se pierda.

Sin servidor de base de datos, sin instalación y sin ORM. Para una API de clase es más que suficiente.

---

## 🗄️ ¿Por qué SQLite?

Hasta ahora los datos vivían en un diccionario de Python y desaparecían al reiniciar el servidor. SQLite los guarda en un fichero `videojuegos.db`.

| Ventaja | Detalle |
|---|---|
| **Cero instalación** | El módulo `sqlite3` viene con Python |
| **Un solo fichero** | Copias el `.db` y te llevas toda la base de datos |
| **SQL de verdad** | Aprendes lo mismo que usarás en MySQL o PostgreSQL |
| **Sin ORM** | Ves el SQL que se ejecuta, sin magia escondida |

> ⚠️ **Límite honesto:** SQLite va genial para desarrollo y para pocos usuarios. Con escrituras concurrentes intensas necesitas PostgreSQL o similar. Para esta unidad, sobra.

---

## 🧱 Crear las tablas

Un script aparte crea el esquema y siembra los datos. Así la API no tiene que crearlos en cada arranque:

```python
import sqlite3
from pathlib import Path

RUTA_DB = Path(__file__).parent / "videojuegos.db"

conexion = sqlite3.connect(RUTA_DB)
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
conexion.commit()
conexion.close()
```

| Clave | Para qué |
|---|---|
| `PRIMARY KEY AUTOINCREMENT` | El `id` se genera solo y nunca se repite |
| `NOT NULL` | La base de datos rechaza nulos aunque el código se equivoque |
| `UNIQUE` | No puede haber dos consolas con el mismo nombre |
| `FOREIGN KEY` | Un juego no puede apuntar a una consola inventada |

> 💡 **Ruta segura:** `Path(__file__).parent / "videojuegos.db"` funciona aunque arranques `uvicorn` desde otra carpeta. Es la misma idea que usas en el resto de la asignatura.

---

## 🔌 Una conexión por petición

Las conexiones de SQLite **no se comparten entre hilos**. Como uvicorn atiende peticiones en paralelo, lo más seguro es abrir y cerrar una por petición:

```python
import sqlite3
from contextlib import closing

def obtener_conexion():
    conexion = sqlite3.connect(RUTA_DB)
    conexion.row_factory = sqlite3.Row   # fila["titulo"] en lugar de fila[0]
    return conexion

@app.get("/juegos")
def listar_juegos():
    with closing(obtener_conexion()) as conexion, conexion:
        filas = conexion.execute("SELECT * FROM juegos").fetchall()
    return [dict(f) for f in filas]
```

Hay dos `with` encadenados y cada uno hace algo distinto:

| `with` | Qué gestiona |
|---|---|
| `closing(conexion)` | Cierra la conexión al salir del bloque |
| `conexion` | Hace `commit` si todo va bien y `rollback` si hay excepción |

> ⚠️ **Sin `commit` no hay guardado.** Un `INSERT` que no llega a `commit` se pierde al cerrar la conexión. Es el error número uno con `sqlite3`.

---

## 🧾 Leer: `fetchone`, `fetchall` y `row_factory`

```python
fila = conexion.execute(
    "SELECT * FROM consolas WHERE id = ?", (id_consola,)
).fetchone()

if fila is None:
    raise HTTPException(404, detail=f"No existe la consola {id_consola}")

return dict(fila)
```

- **`?`** es el marcador de parámetro: nunca concatenes el valor en el SQL (`f"... WHERE id = {id}"`), porque abres la puerta a la **inyección SQL**.
- **`fetchone()`** devuelve una fila o `None`; **`fetchall()`**, una lista.
- Con **`row_factory = sqlite3.Row`**, la fila se comporta como un diccionario: `fila["nombre"]`. Sin él, sería `fila[1]` y el código se vuelve ilegible.
- **`dict(fila)`** la convierte en un diccionario normal, listo para que FastAPI lo serialice a JSON.

---

## ✍️ Escribir: `INSERT`, `lastrowid` y `commit`

```python
@app.post("/juegos", status_code=201)
def crear_juego(juego: JuegoNuevo):
    with closing(obtener_conexion()) as conexion, conexion:
        cursor = conexion.execute(
            "INSERT INTO juegos (titulo, anio, genero, consola_id) VALUES (?, ?, ?, ?)",
            (juego.titulo, juego.anio, juego.genero, juego.consola_id),
        )
        conexion.commit()
        nuevo_id = cursor.lastrowid
    return {**juego.model_dump(), "id": nuevo_id}
```

| Paso | Qué aporta |
|---|---|
| `execute(...)` | Devuelve un **cursor** con el resultado de la operación |
| `conexion.commit()` | Confirma el cambio en disco |
| `cursor.lastrowid` | El `id` que SQLite acaba de asignar |
| `**juego.model_dump()` | Desempaqueta el modelo Pydantic en el diccionario de respuesta |

---

## 🔗 Integridad referencial: el 404 que evita basura

La clave foránea evita guardar un juego de una consola que no existe. Pero SQLite **no comprueba la FK por defecto**: o la activas o lo compruebas a mano. Lo más claro para clase es comprobarlo antes:

```python
consola = conexion.execute(
    "SELECT id FROM consolas WHERE id = ?", (juego.consola_id,)
).fetchone()
if consola is None:
    raise HTTPException(404, detail=f"No existe la consola {juego.consola_id}")
```

Así el cliente recibe un **404** con un mensaje útil, en lugar de un error 500 de la base de datos.

> 💡 **Regla:** los errores del cliente (id inexistente, datos inválidos) se responden con 4xx; los fallos del servidor (base de datos caída), con 5xx.

---

## 🧠 Mini-chequeo

1. ¿Qué pasa si haces un `INSERT` y no llamas a `commit()`?
2. ¿Para qué sirve `row_factory = sqlite3.Row`?
3. ¿Por qué se usa `?` en lugar de meter el valor en el SQL con una f-string?

<details>
<summary>🔄 Respuestas</summary>

1. El cambio **no se guarda**: al cerrar la conexión se descarta.
2. Para que cada fila se pueda leer por **nombre de columna** (`fila["titulo"]`) en lugar de por posición (`fila[1]`).
3. Porque concatenar abre la puerta a la **inyección SQL**; el marcador `?` envía el valor como dato, no como código.
</details>

---

## ✅ Resumen en 3 frases

- SQLite guarda la base de datos en un fichero y viene incluida en Python, así que no hay nada que instalar.
- La API abre una conexión por petición, usa `?` para los parámetros, `fetchone`/`fetchall` para leer y `commit` para escribir.
- `row_factory = sqlite3.Row` permite leer las filas por nombre de columna y `dict(fila)` las deja listas para el JSON.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| SQLite | Base de datos relacional en un solo fichero |
| `commit` | Confirma los cambios en disco |
| `rollback` | Deshace los cambios no confirmados |
| `row_factory` | Configura cómo se devuelven las filas |
| `lastrowid` | Identificador generado por el último `INSERT` |
| Clave foránea | Campo que referencia el `id` de otra tabla |
| Inyección SQL | Ataque que mete código SQL dentro de un dato |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Anterior:** [04 · Métodos HTTP y códigos](/ApuntesPSP/08-fastapi/04-metodos-http-y-codigos) · **Siguiente:** [06 · Filtros, búsqueda y paginación](/ApuntesPSP/08-fastapi/06-filtros-y-paginacion)
