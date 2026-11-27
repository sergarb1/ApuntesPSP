---
title: Boletín UD 9 — Inicial
description: 8 ejercicios para arrancar con FastAPI y sus rutas
---

# 📝 Boletín UD 9 — Inicial

> Ejercicios básicos para afianzar la primera aplicación, las rutas, los modelos Pydantic y los códigos de estado de la unidad UD 9.

---

## 1. Hola, API

Crea `main.py` con una aplicación FastAPI y una ruta `GET /` que devuelva `{"mensaje": "funciono"}`. Arranca el servidor y comprueba la respuesta en el navegador.

**Pista:** `uvicorn main:app --reload` y visita `http://127.0.0.1:8000/`.

## 2. Ficha por id

Añade `GET /juegos/{id_juego}` que devuelva `{"id": id_juego}`. Comprueba qué ocurre al pedir `/juegos/siete`.

**Pista:** declara `id_juego: int`; verás un 422.

## 3. Parámetro de consulta

Crea `GET /saludo?nombre=Ana` que devuelva `{"hola": "Ana"}`. Si no se manda el parámetro, usa `"invitado"`.

**Pista:** `nombre: str = "invitado"` ya lo hace opcional.

## 4. Primer modelo

Define `JuegoNuevo` con `titulo: str` y `anio: int`, y úsalo en un `POST /juegos` que devuelva el mismo objeto con `id: 1`.

**Pista:** el modelo va como argumento de la función; FastAPI lo lee del cuerpo.

## 5. Alta con 201

Modifica la ruta anterior para que devuelva **201** en lugar de 200.

**Pista:** `@app.post("/juegos", status_code=201)`.

## 6. Recurso que no existe

Añade a `GET /juegos/{id_juego}` una comprobación: si el id es mayor que 10, responde **404** con el mensaje «no existe».

**Pista:** `raise HTTPException(status_code=404, detail="no existe")`.

## 7. Documentación

Abre `/docs` y localiza el botón **Try it out** del `POST /juegos`. Lanza una petición válida y otra con `anio` como texto.

**Pista:** la segunda debe devolver 422 con el detalle del campo `anio`.

## 8. El commit que falta

Crea una tabla `pruebas (id INTEGER PRIMARY KEY, texto TEXT)` con `sqlite3`, inserta una fila y **olvida** el `commit`. Cierra y vuelve a abrir la base de datos: ¿está la fila? Corrige el script.

**Pista:** sin `commit`, el `INSERT` se descarta al cerrar la conexión.
