---
title: UD 9 — FastAPI
description: "Construye tu propia API REST con FastAPI, Pydantic y SQLite 🧩"
nav_order: 08
---

<p><small>Construye tu propia API REST con FastAPI, Pydantic y SQLite 🧩</small></p>

---

*En la UD 8 consumiste APIs ajenas: pedías el tiempo a OpenWeatherMap y dejabas que OpenAI pensara por ti. Ahora cambias de lado del mostrador: vas a **construir la API** que otros consumirán.*

Esta unidad te enseña a levantar un servicio web con **FastAPI**, el framework de Python que se ha convertido en el estándar para APIs modernas: rutas con decoradores, validación automática con **Pydantic**, documentación interactiva gratis y persistencia sencilla con **SQLite**. Todo lo que ya sabes de HTTP, JSON y `requests` (UD 7) se convierte aquí en lo que un servidor tiene que devolver para que ese `requests.get()` funcione.

Esta unidad se lee como un **libro de 10 capítulos**: los 8 primeros son teoría en progresión, el 9º monta una API completa de videojuegos con su base de datos, su cliente de pruebas y su documentación, y el 10º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es **FastAPI**, qué es **ASGI** y por qué se arranca con `uvicorn`.
- Crear tu primera aplicación y declarar **rutas** con decoradores (`@app.get`).
- Recibir **parámetros de ruta** y **parámetros de consulta** con sus tipos.
- Definir **modelos Pydantic** que validan los datos de entrada y devuelven el error **422** cuando algo no cuadra.
- Usar los **métodos HTTP** con criterio: `GET`, `POST`, `PUT`, `PATCH` y `DELETE`, con sus códigos de estado.
- Guardar datos en **SQLite** con `sqlite3` (sin ORM): conexión por petición, `commit` y filas como diccionarios.
- Ofrecer **filtros, búsqueda, ordenación y paginación** en un listado.
- Leer la **documentación automática** (`/docs` y `/redoc`) y entender el esquema OpenAPI.
- Probar la API con el **TestClient** de FastAPI y con un cliente `requests`.
- Proteger la API con una **API key** por dependencia y prepararla para **desplegarla**.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · ¿Qué es FastAPI?](/ApuntesPSP/08-fastapi/01-que-es-fastapi) | ASGI, uvicorn y por qué FastAPI y no Flask | Todos |
| [02 · Primera aplicación y rutas](/ApuntesPSP/08-fastapi/02-primera-aplicacion-y-rutas) | `FastAPI()`, decoradores, parámetros y `/docs` | Todos |
| [03 · Modelos Pydantic](/ApuntesPSP/08-fastapi/03-modelos-pydantic) | Validación automática, tipos y el error 422 | Todos |
| [04 · Métodos HTTP y códigos](/ApuntesPSP/08-fastapi/04-metodos-http-y-codigos) | POST, PUT, PATCH, DELETE y `HTTPException` | Todos |
| [05 · Persistencia con SQLite](/ApuntesPSP/08-fastapi/05-persistencia-sqlite) | `sqlite3`, filas como diccionarios, `commit` | Todos |
| [06 · Filtros, búsqueda y paginación](/ApuntesPSP/08-fastapi/06-filtros-y-paginacion) | Query params opcionales, `LIMIT`/`OFFSET` y orden | Todos |
| [07 · Documentación automática y pruebas](/ApuntesPSP/08-fastapi/07-documentacion-y-pruebas) | OpenAPI, Swagger, ReDoc y `TestClient` | Todos |
| [08 · Seguridad y despliegue](/ApuntesPSP/08-fastapi/08-seguridad-y-despliegue) | API key con `Depends`, CORS, workers y `.env` | Todos |
| [09 · Ejemplo completo: API de videojuegos](/ApuntesPSP/08-fastapi/09-ejemplo-completo-api-de-videojuegos) | Servidor + base de datos + cliente, de principio a fin | Todos |
| [10 · Cierre](/ApuntesPSP/08-fastapi/10-cierre) | Sé la petición al servidor, Fireside, Laboratorio… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º junta todo en una API completa y el 10º es el aterrizaje práctico: léelos justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u08-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u08-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u08-avanzado" class="elink">⭐ Avanzado por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u08-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA4a-c)

**RA4: Desarrolla aplicaciones que se comunican por red. Servicios en red.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Implementa servicios REST que devuelven datos en JSON | ✅ Puntos 2-4, 9 + ⚡ Laboratorio (punto 10) |
| b) | Gestiona peticiones HTTP, parámetros y códigos de estado | ✅ Puntos 4-6, 9 + ⚡ Laboratorio (punto 10) |
| c) | Desarrolla servidores que atienden clientes concurrentes | ✅ Punto 8 (ASGI y workers) + el servidor del punto 9 |

> RA4a-b (consumo de APIs REST y comerciales) se practican en las **UD 7 y UD 8**. RA4e-g (asyncio, disponibilidad, comparativa) se cubren en la **UD 11 · Alta disponibilidad**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la UD 8 y dominas `requests`, JSON y los códigos de estado? Perfecto: ese es el trampolín ideal. Repasa la [UD 7 · HTTP y APIs REST](/ApuntesPSP/06-http-y-apis-rest) para tener frescos los métodos y los códigos, y arranca en el [punto 1](/ApuntesPSP/08-fastapi/01-que-es-fastapi), que parte justo de ahí: de la petición que hacías a la respuesta que ahora vas a servir.

¿Ya has montado algo con Flask y solo quieres FastAPI? Ve directo al [punto 2](/ApuntesPSP/08-fastapi/02-primera-aplicacion-y-rutas) y al [punto 3](/ApuntesPSP/08-fastapi/03-modelos-pydantic). Si vienes de cero, no te saltes el punto 1: entender qué es ASGI te ahorrará muchas dudas al arrancar `uvicorn`.

**📍 Primer punto:** [01 · ¿Qué es FastAPI?](/ApuntesPSP/08-fastapi/01-que-es-fastapi)  
**⏭️ Al acabar la unidad, continúa en [UD 10 · Seguridad y cifrado](/ApuntesPSP/09-seguridad-y-cifrado).**
