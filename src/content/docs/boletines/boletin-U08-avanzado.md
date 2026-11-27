---
title: Boletín UD 9 — Avanzado
description: 12 retos de FastAPI con SQLite, seguridad y pruebas
---

# 💪 Boletín UD 9 — Avanzado

> Doce retos para llevar la API más allá del ejemplo: CRUD completo, filtros, paginación, API key, CORS y pruebas automáticas.

---

## 1. CRUD de consolas

Monta `GET /consolas`, `GET /consolas/{id}`, `POST /consolas`, `PUT /consolas/{id}` y `DELETE /consolas/{id}` sobre tu tabla de consolas, con los códigos correctos.

**Pista:** 201 al crear, 200 al modificar, 204 al borrar y 404 en todos los casos de id inexistente.

## 2. Filtros combinados

Amplía `GET /juegos` para aceptar `consola`, `genero` y `desde`/`hasta` (año). Deben poder combinarse en cualquier orden y todos son opcionales.

**Pista:** `WHERE 1=1` y una lista de parámetros en el mismo orden que las condiciones.

## 3. Búsqueda por título

Añade `GET /juegos/buscar?q=...` con `LIKE '%texto%'`. Comprueba que `/juegos/buscar` no se confunde con `/juegos/{id}`.

**Pista:** declara la ruta de búsqueda **antes** de la dinámica.

## 4. Paginación con metadatos

Devuelve `pagina`, `tamano`, `total` y `resultados` en el listado de juegos. Valida que `pagina` y `tamano` sean positivos.

**Pista:** `LIMIT ? OFFSET ?` y un `COUNT(*)` aparte; 400 si los valores no son positivos.

## 5. PUT frente a PATCH

Implementa los dos sobre `/juegos/{id}`: PUT sustituye el recurso completo y PATCH solo los campos enviados.

**Pista:** dos modelos, uno con todos los campos obligatorios y otro con `Optional` y `exclude_unset=True`.

## 6. API key

Protege las rutas de escritura con una cabecera `x-api-key` leída desde una dependencia. Devuelve 401 si no coincide.

**Pista:** `Depends(verificar_clave)` + `Header(...)`; la clave, en `.env`.

## 7. CORS

Permite que una web servida en `http://localhost:4321` llame a tu API desde el navegador.

**Pista:** `CORSMiddleware` con `allow_origins=["http://localhost:4321"]`.

## 8. Pruebas con TestClient

Escribe cuatro tests con `pytest`: listado 200, detalle 404, alta 201 y validación 422. Ejecútalos sin arrancar `uvicorn`.

**Pista:** `TestClient(app)` y `assert respuesta.status_code == ...`.

## 9. Respuesta filtrada

Crea un `response_model` que devuelva solo `id`, `titulo`, `anio` y `consola`, aunque la consulta traiga más columnas.

**Pista:** los campos que no declares en el modelo desaparecen de la respuesta.

## 10. Conteo con LEFT JOIN

En `GET /consolas`, incluye cuántos juegos tiene cada consola, incluso las que tienen cero.

**Pista:** `LEFT JOIN` + `COUNT(j.id) AS juegos` + `GROUP BY c.id`.

## 11. Alta con clave foránea

En `POST /juegos`, si la consola no existe, responde 404 con un mensaje claro. Comprueba que un cuerpo inválido sigue devolviendo 422.

**Pista:** Pydantic valida antes de entrar en la función; la FK se comprueba dentro.

## 12. Cliente 10/10

Escribe un `cliente.py` con `requests` que compruebe 200, 201, 204, 404 y 422, imprima ✓/✗ y termine con código de error si algo falla.

**Pista:** acumula booleanos en una lista y haz `raise SystemExit(1)` si no están todos.
