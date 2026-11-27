---
title: "10 — Cierre: consolida lo aprendido"
description: "Sé la petición al servidor, laboratorio real y el ring final de la unidad 🧠"
---

<p><small>Sé la petición al servidor, laboratorio real y el ring final de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 10 · Cierre

---

Has terminado la teoría: ASGI y uvicorn, rutas, Pydantic, métodos HTTP, SQLite, filtros, documentación, pruebas, seguridad y el [ejemplo completo de videojuegos](/ApuntesPSP/08-fastapi/09-ejemplo-completo-api-de-videojuegos). Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 9](/ApuntesPSP/08-fastapi/09-ejemplo-completo-api-de-videojuegos) y antes de abrir los boletines.

---

## ⭐ Sé la petición al servidor

> *Eres un `POST /juegos` que acaba de nacer en un `requests.post()` dentro del portátil de un estudiante. Tu destino es una API FastAPI en `127.0.0.1:8000`. Empieza el viaje.*

**¿Qué pasa?**

1. `requests` te construye: método **POST**, ruta `/juegos`, cabecera `Content-Type: application/json` y un cuerpo con `{"titulo": "Metroid Fusion", ...}`.
2. Abres la conexión TCP contra el puerto 8000, donde escucha `uvicorn`.
3. `uvicorn` te lee, te convierte en un objeto de petición ASGI y te pasa a **FastAPI**.
4. FastAPI mira tu ruta y encuentra la función decorada con `@app.post("/juegos")`.
5. Antes de llamarla, **Pydantic** valida el cuerpo contra `JuegoNuevo`: título no vacío, año entre 1970 y 2030, consola con id ≥ 1. Todo correcto.
6. La función abre una **conexión SQLite**, comprueba que la consola existe, ejecuta el `INSERT` y hace `commit`.
7. `cursor.lastrowid` devuelve el id nuevo. FastAPI serializa el resultado a JSON y responde **201 Created**.
8. El estudiante lee `r.status_code` y ve `201`. Misión cumplida.

**Todo en ~15 ms. Y sin que nadie haya tocado un socket a mano.**

> 💡 **Ahora tú:** ¿y si el año fuera 1000? En el paso 5 Pydantic te rechaza: no se llega ni a la base de datos. La respuesta es **422** con `loc: ["body", "anio"]`. El cliente sabe exactamente qué corregir sin leer el código del servidor.

---

## 🔥 Fireside Chat: Flask vs FastAPI vs Django

> *Tres frameworks de Python se sientan junto a la chimenea a discutir, de una vez, quién es el mejor.*

**Flask:** — Yo empecé la fiesta. Minimalista, libre, hago lo que me pidas con cuatro líneas.

**FastAPI:** — Y yo nací después, leyendo tu manual y el de Django. Rutas con tipos, validación y `/docs` gratis.

**Django:** — Yo no soy un framework: soy una familia entera. ORM, admin, autenticación y plantillas. Trae la casa montada.

**Flask:** — Eso es mucho peso para una API de tres endpoints.

**Django:** — Y tú, Flask, te quedas corto cuando el proyecto crece y hay que validar a mano.

**FastAPI:** — Por eso estoy en medio: ligero como Flask, con validación como Django y documentación que ninguno de los dos da por defecto.

**Flask:** — ¿Y el rendimiento?

**FastAPI:** — ASGI: atiendo muchas peticiones de E/S sin un hilo por cada una.

**Django:** — Vale, en APIs JSON ganas tú. Pero para un panel de gestión completo, con usuarios, permisos y base de datos, sigo siendo yo.

> **Moraleja:** para **APIs JSON** modernas, FastAPI es la opción por defecto; Flask sigue siendo ideal para prototipos pequeños; Django brilla cuando necesitas la aplicación web entera con su panel de administración.

---

## 🕵️ ¿Quién soy?

1. **Soy la capa que convierte un dict en un objeto validado y rechaza el año 1000 con un 422.** ¿Quién soy?
2. **Escucho en un puerto, hablo ASGI y me encargo de que la API esté viva aunque el código duerma.** ¿Quién soy?
3. **No soy un error del servidor: soy la forma correcta de decir «no existe ese juego» con un 404.** ¿Quién soy?
4. **Nazco de tus decoradores y modelos, y de mí salen `/docs` y `/redoc`.** ¿Quién soy?

<details>
<summary>🔄 Respuestas</summary>

1. **Pydantic** (con `BaseModel` y `Field`).
2. **uvicorn**, el servidor ASGI.
3. **`HTTPException`** con `status_code=404`.
4. El esquema **OpenAPI**.
</details>

---

## 🤬 CONRAD VS EL MUNDO: «lo valido a mano»

> *Conrad ha decidido que no necesita Pydantic. «Unos cuantos `if` y listo», dice, mientras escribe la decimoquinta comprobación.*

```python
@app.post("/juegos")
def crear_juego(datos: dict):
    if "titulo" not in datos:
        return {"error": "falta titulo"}
    if not isinstance(datos["titulo"], str):
        return {"error": "titulo no es texto"}
    if len(datos["titulo"]) == 0:
        return {"error": "titulo vacío"}
    if "anio" not in datos:
        return {"error": "falta anio"}
    if not isinstance(datos["anio"], int):
        return {"error": "anio no es número"}
    if datos["anio"] < 1970:
        return {"error": "anio demasiado antiguo"}
    # ...y así hasta el infinito
```

**El mundo:** — Conrad, acabas de devolver **200 OK** con `{"error": ...}`. El cliente cree que todo fue bien.

**Conrad:** — Bueno, el mensaje se lee.

**El mundo:** — Y no has documentado nada: `/docs` muestra `dict` como cuerpo y ningún 422. Un cliente nuevo no sabe qué mandar.

**Conrad:** — Pero funciona.

**El mundo:** — Hasta que alguien manda `consola_id: "uno"` y la API responde 200 con un error de texto que nadie parsea. Mientras tanto, Pydantic hacía esto en una clase de cuatro líneas y con el error en formato estándar.

> **Moraleja:** validar a mano no es más flexible: es más código, peor documentado y con códigos de estado mentirosos. Los tipos no son burocracia; son la especificación ejecutable de tu API.

---

## ⚡ Laboratorio de tortura: la biblioteca

**Escenario:** monta una API para una biblioteca con dos tablas: `autores` y `libros`. Debe permitir listar autores con su número de libros, ver un autor con sus libros, listar libros filtrando por autor o género, crear un libro validado y borrarlo.

**Requisitos:**

1. `poblar.py` con 5 autores y al menos 15 libros.
2. `GET /autores` con `LEFT JOIN` y conteo.
3. `GET /autores/{id}` con **404** si no existe y la lista de sus libros.
4. `GET /libros?autor=&genero=` con filtros opcionales y `WHERE 1=1`.
5. `POST /libros` con modelo Pydantic (`titulo`, `anio` entre 1900 y 2030, `genero`, `autor_id`), **201** al crear, **422** si no valida y **404** si el autor no existe.
6. `DELETE /libros/{id}` con **204** y **404**.
7. `cliente.py` que compruebe al menos 8 casos, incluidos el 201, el 422 y los dos 404.

**Pistas:**

> **Pista 1:** copia la estructura del [ejemplo de videojuegos](/ApuntesPSP/08-fastapi/09-ejemplo-completo-api-de-videojuegos) y cambia los nombres de las tablas. La fontanería es idéntica.

> **Pista 2:** el 422 sale solo con declarar el modelo; no escribas ni un `if`. Si lo estás comprobando a mano, estás haciendo el trabajo de Pydantic.

> **Pista 3:** para el 404 del autor en el POST, consulta primero `SELECT id FROM autores WHERE id = ?` y lanza `HTTPException(404, ...)` si `fetchone()` devuelve `None`.

> **Pista 4:** recuerda el `commit` después del `INSERT` y del `DELETE`. Sin él, el cliente recibe 201 y los datos no están.

---

## 🏆 Logros de esta unidad

| Logro | Cuándo lo desbloqueas |
|---|---|
| 🥇 **Hola, API** | Levantas `uvicorn` y respondes JSON en `/` |
| 🥈 **Tipos que protegen** | Un `POST` inválido devuelve 422 sin tocar la base de datos |
| 🥉 **Persistente** | Los datos sobreviven a reiniciar el servidor |
| 🏅 **Buscador** | Filtros y paginación funcionando en `/juegos` |
| 🎖️ **Documentado** | `/docs` enseña todos los endpoints con sus modelos |
| 🛡️ **Protegido** | Una ruta exige API key y devuelve 401 sin ella |
| 🚀 **Entregable** | El cliente pasa 10/10 y devuelve 0 al terminar |

---

## 🧠 Atrévete a pensar

1. **¿Por qué el 422 y no el 400 para un JSON inválido?** Porque el cuerpo está bien formado como JSON, pero su **contenido** no es procesable: eso es exactamente «Unprocessable Entity». El 400 se reserva para peticiones mal construidas en general.
2. **¿Qué pasaría si dos clientes hacen `POST /juegos` a la vez sobre SQLite?** SQLite bloquea la escritura mientras dura la transacción; la segunda espera o falla con «database is locked». Con pocos clientes no se nota; con muchos, toca un motor cliente-servidor.
3. **¿Por qué `response_model` puede ser más seguro que devolver un dict?** Porque filtra: cualquier campo que no declares desaparece de la respuesta. Así no se escapan datos internos por descuido.
4. **¿Qué gana una API con ASGI si las consultas a SQLite son síncronas?** Que las peticiones que esperan red o cálculo ligero no bloquean el bucle; las operaciones de base de datos se ejecutan en el pool de hilos de Starlette. El modelo escala mejor cuando la E/S domina.
5. **¿Es `GET /juegos?genero=rol` una buena URL REST?** Sí: el recurso es `/juegos` y el filtro es un parámetro de consulta. Lo que **no** sería REST es `/getJuegosPorGenero`.

---

## 🧩 Crucigrama de bits

> Adivina el término de la unidad.

1. Framework ASGI para construir APIs en Python. (7)
2. Servidor que ejecuta la aplicación. (7)
3. Biblioteca que valida los datos con tipos. (8)
4. Código que devuelve FastAPI cuando el modelo no valida. (3)
5. Método HTTP que crea un recurso. (4)
6. Base de datos en un solo fichero incluida en Python. (6)
7. Decorador que protege una ruta ejecutando una función antes. (7)
8. Fichero donde se describe la API en JSON. (7)

<details>
<summary>🔄 Soluciones</summary>

1. **FastAPI**
2. **uvicorn**
3. **Pydantic**
4. **422**
5. **POST**
6. **SQLite**
7. **Depends**
8. **openapi.json**
</details>

---

## 💬 Entrevista de trabajo

> **Entrevistador:** — Tienes que montar una API para un catálogo. ¿Por dónde empiezas?

**Tú:** — Por el contrato: qué recursos hay, qué rutas y qué códigos. Después defino los modelos Pydantic y, por último, la persistencia.

> **Entrevistador:** — ¿Por qué FastAPI y no Flask?

**Tú:** — Porque la validación y la documentación vienen dadas. En Flask tendría que escribir y mantener ambas a mano.

> **Entrevistador:** — ¿Cómo evitas que un cliente guarde un juego sin consola?

**Tú:** — Compruebo la clave foránea antes del `INSERT` y devuelvo 404 con detalle. La validación de tipos de Pydantic cubre el resto.

> **Entrevistador:** — ¿Y si mañana la API tiene 10.000 usuarios?

**Tú:** — Sacaría SQLite y pasaría a PostgreSQL, y repartiría con varios workers detrás de un proxy. La estructura de la API no cambiaría.

> **Entrevistador:** — ¿Cómo sé que tu API funciona?

**Tú:** — Abre `/docs` y lanza `cliente.py`: diez comprobaciones que cubren 200, 201, 404 y 422.

---

## 🤷 No hay preguntas tontas

**¿Puedo usar `def` en vez de `async def`?** Sí. FastAPI ejecuta las funciones síncronas en un pool de hilos. Usa `async def` cuando llames a bibliotecas asíncronas; para SQLite con `sqlite3`, `def` es lo natural.

**¿Por qué mi POST devuelve 422 si el JSON parece correcto?** Revisa el `loc` de la respuesta: casi siempre es un campo que falta, un tipo equivocado o un rango (`ge`, `le`) incumplido.

**¿Dónde está la base de datos si la borro sin querer?** En el fichero `videojuegos.db`. Si no la subes a git y tienes `poblar.py`, la regeneras en un segundo.

**¿Tengo que escribir los tests con `pytest` obligatoriamente?** No, pero es lo estándar. Un cliente `requests` que comprueba códigos ya es una prueba útil.

**¿`/docs` funciona en producción?** Sí, y suele ser deseable. Si no quieres exponerla, se desactiva con `docs_url=None` en `FastAPI()`.

**¿Por qué no veo los cambios al guardar?** Porque arrancaste sin `--reload`. En desarrollo, añádelo.

---

## 🎬 Poscréditos

**PRÓXIMAMENTE EN UD 10:** *Seguridad y cifrado. Has construido la puerta; ahora toca ponerle cerradura: hash, AES, RSA y firmas digitales para que los datos viajen y se guarden sin que nadie los lea por el camino.*

> *El viaje ha recorrido nueve hitos: 🐍 Python, 🚀 Procesos, 🔀 Hilos, 🔒 Sincronización, 🔌 Sockets, 🏗️ Servidores, 🌐 API REST, 🧪 APIs comerciales y 🧩 FastAPI.*

---

## ✅ Criterios de evaluación cubiertos (RA4a-c)

**RA4: Desarrolla aplicaciones que se comunican por red. Servicios en red.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Implementa servicios REST que devuelven datos en JSON | ✅ Puntos 2-4 y 9 + ⚡ Laboratorio |
| b) | Gestiona peticiones HTTP, parámetros y códigos de estado | ✅ Puntos 4-6 y 9 + ⚡ Laboratorio |
| c) | Desarrolla servidores que atienden clientes concurrentes | ✅ Punto 8 (ASGI y workers) + el servidor del punto 9 |

> RA4e-g (asyncio, disponibilidad, comparativa) se cubren en la **UD 11 · Alta disponibilidad**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Anterior:** [09 · Ejemplo completo: API de videojuegos](/ApuntesPSP/08-fastapi/09-ejemplo-completo-api-de-videojuegos) · **Siguiente:** **[UD 10 · Seguridad y cifrado](/ApuntesPSP/09-seguridad-y-cifrado)**
