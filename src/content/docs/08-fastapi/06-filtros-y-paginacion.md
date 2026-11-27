---
title: 06 — Filtros, búsqueda y paginación
description: "«Dame solo los de rol, del año 90, página 2» 🔎"
---

<p><small>«Dame solo los de rol, del año 90, página 2» 🔎</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 06 · Filtros, búsqueda y paginación

---

## 📬 La idea en una frase

> Los **parámetros de consulta opcionales** se traducen en condiciones SQL: filtros, búsqueda por texto, orden y paginación, todo en la misma ruta `GET /juegos`.

Es lo que separa una API de juguete (devuelve todo) de una API usable (devuelve lo que pides).

---

## 🔎 Filtros opcionales

Cada filtro es un argumento con valor por defecto `None`. Si el cliente no lo manda, la condición no se añade:

```python
from typing import Optional

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

    with closing(obtener_conexion()) as conexion, conexion:
        filas = conexion.execute(consulta, parametros).fetchall()
    return [dict(f) for f in filas]
```

| Detalle | Por qué se hace así |
|---|---|
| `WHERE 1=1` | Permite añadir `AND ...` sin comprobar si ya había un `WHERE` |
| Lista `parametros` | Los valores viajan con `?`, en el mismo orden que las condiciones |
| `is not None` | Para números, porque `0` es un valor válido |
| `if genero` | Para textos, porque `""` no filtra nada útil |

> 💡 Alternativa más elegante: construir la lista de condiciones (`condiciones.append(...)`) y unirlas con `" AND ".join(condiciones)`. Las dos formas son válidas; la de arriba se lee mejor al principio.

---

## 🔤 Búsqueda por texto con `LIKE`

Para buscar «que el título contenga metroid»:

```python
@app.get("/juegos/buscar")
def buscar_juegos(q: str):
    with closing(obtener_conexion()) as conexion, conexion:
        filas = conexion.execute(
            "SELECT * FROM juegos WHERE titulo LIKE ? ORDER BY titulo",
            (f"%{q}%",),
        ).fetchall()
    return [dict(f) for f in filas]
```

- `%` significa «cualquier cosa»: `%metroid%` casa con `Metroid`, `Metroid Fusion` y `Super Metroid`.
- `LIKE` en SQLite **no distingue mayúsculas** en ASCII, así que `metroid` encuentra `Metroid`.

> ⚠️ **Orden de rutas otra vez:** `/juegos/buscar` debe declararse **antes** de `/juegos/{id_juego}`; si no, `buscar` se interpreta como un id y devuelve un 422.

---

## ↕️ Ordenación segura

El cliente puede pedir el orden, pero **nunca** metas su valor directamente en el SQL. Se elige entre una lista blanca:

```python
ORDENES = {
    "titulo": "titulo",
    "anio": "anio",
    "genero": "genero",
}

@app.get("/juegos")
def listar_juegos(orden: str = "anio", descendente: bool = False):
    columna = ORDENES.get(orden, "anio")   # valor no permitido → por defecto
    direccion = "DESC" if descendente else "ASC"
    consulta = f"SELECT * FROM juegos ORDER BY {columna} {direccion}"
    ...
```

| Riesgo | Solución |
|---|---|
| `ORDER BY {orden}` con valor del cliente | Lista blanca (`ORDENES.get`) |
| Inyección por el sentido | Solo dos valores posibles: `ASC` o `DESC` |

> 💡 **Regla de oro:** los **valores** van con `?`; los **nombres de columna** no pueden ir con `?`, por eso se validan contra una lista blanca.

---

## 📄 Paginación con `LIMIT` y `OFFSET`

Devolver 10.000 filas de golpe es una mala idea: pesa, tarda y el cliente no lo necesita. Se pagina:

```python
@app.get("/juegos")
def listar_juegos(pagina: int = 1, tamano: int = 10):
    if pagina < 1 or tamano < 1:
        raise HTTPException(400, detail="pagina y tamano deben ser positivos")
    desplazamiento = (pagina - 1) * tamano
    with closing(obtener_conexion()) as conexion, conexion:
        filas = conexion.execute(
            "SELECT * FROM juegos ORDER BY id LIMIT ? OFFSET ?",
            (tamano, desplazamiento),
        ).fetchall()
        total = conexion.execute("SELECT COUNT(*) FROM juegos").fetchone()[0]
    return {
        "pagina": pagina,
        "tamano": tamano,
        "total": total,
        "resultados": [dict(f) for f in filas],
    }
```

| Petición | `LIMIT` | `OFFSET` | Devuelve |
|---|---|---|---|
| `?pagina=1&tamano=10` | 10 | 0 | Filas 1-10 |
| `?pagina=2&tamano=10` | 10 | 10 | Filas 11-20 |
| `?pagina=3&tamano=5` | 5 | 10 | Filas 11-15 |

> ⚠️ **`OFFSET` grande es lento:** la base de datos recorre y descarta todas las filas anteriores. Para catálogos pequeños no se nota; para millones, se pagina por «último id visto» (`WHERE id > ? LIMIT ?`).

---

## 🧮 Un listado con metadatos

Devolver solo la lista obliga al cliente a adivinar cuántos resultados hay. Un objeto con metadatos es más profesional:

```json
{
  "pagina": 2,
  "tamano": 10,
  "total": 36,
  "resultados": [
    {"id": 11, "titulo": "Sonic the Hedgehog", "anio": 1991}
  ]
}
```

Con esos campos, el cliente puede dibujar un paginador («página 2 de 4») sin pedir nada más.

---

## 🧠 Mini-chequeo

1. ¿Por qué se empieza la consulta con `WHERE 1=1`?
2. ¿Qué diferencia hay entre `LIMIT` y `OFFSET`?
3. ¿Por qué el nombre de la columna de ordenación no puede ir con `?`?

<details>
<summary>🔄 Respuestas</summary>

1. Para poder añadir condiciones con `AND` sin comprobar si ya existe un `WHERE`.
2. **`LIMIT`** dice cuántas filas devolver; **`OFFSET`**, cuántas saltarse antes de empezar.
3. Porque `?` solo sustituye **valores**, no identificadores del SQL. Por eso se valida contra una lista blanca.
</details>

---

## ✅ Resumen en 3 frases

- Los filtros son parámetros de consulta opcionales que añaden condiciones `AND` a la consulta SQL.
- La búsqueda usa `LIKE '%texto%'` y la ordenación se valida contra una lista blanca de columnas.
- La paginación combina `LIMIT` y `OFFSET` y devuelve metadatos (`pagina`, `total`) para que el cliente sepa dónde está.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Query param | Parámetro opcional tras la `?` |
| `WHERE 1=1` | Truco para encadenar condiciones con `AND` |
| `LIKE` | Comparación de texto con comodines `%` |
| `LIMIT` / `OFFSET` | Cuántas filas devolver / cuántas saltarse |
| Lista blanca | Conjunto cerrado de valores permitidos |
| Paginación | Dividir un listado en páginas |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Anterior:** [05 · Persistencia con SQLite](/ApuntesPSP/08-fastapi/05-persistencia-sqlite) · **Siguiente:** [07 · Documentación automática y pruebas](/ApuntesPSP/08-fastapi/07-documentacion-y-pruebas)
