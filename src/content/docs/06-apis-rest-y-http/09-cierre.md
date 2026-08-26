---
title: "09 — Cierre: consolida lo aprendido"
description: Sé la petición HTTP, laboratorio real y el ring final de la unidad 🧠
---

<p><small>Sé la petición HTTP, laboratorio real y el ring final de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🌐 **U06 · APIs REST y HTTP** → 09 · Cierre

---

Has terminado la teoría: API, URL, métodos HTTP, principios REST, códigos de estado, JSON, `requests` con GET y con POST/PUT/DELETE, y el mini cliente completo. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real contra una API pública con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/06-apis-rest-y-http/08-practica-api) y antes de abrir los boletines.

---

## ⭐ Sé la petición HTTP

> *Eres una petición HTTP. Acabas de nacer en un `requests.get()` dentro del portátil de un estudiante y tu destino es `api.github.com`. Empieza el viaje.*

**¿Qué pasa?**

1. `requests` te construye: fija el scheme `https`, el host `api.github.com` y el path `/users/python`. Eres un mensaje `GET /users/python HTTP/1.1` con cabeceras (`Host`, `User-Agent`, `Accept`).
2. Abres la conexión: primero el **DNS lookup** (`api.github.com` → una IP), luego el **three-way handshake TCP** y el **handshake TLS** que te cifra para el viaje.
3. Atraviesas Internet hasta el servidor y te entrega el proceso servidor que te espera en el puerto 443.
4. El servidor interpreta tu método (GET), localiza el recurso y contesta: **200 OK** con el cuerpo `application/json`.
5. De vuelta en Python, `requests` parsea el cuerpo JSON y te convierte en un **dict** (`datos["login"]` → `"python"`).
6. El estudiante imprime tu mensaje. Misión cumplida.

**Todo en ~150 ms. Sin saber qué hay en cada router del camino.**

> 💡 **Ahora tú:** ¿y si en lugar de un GET el estudiante usara un POST para crear un post en JSONPlaceholder? Tu cuerpo ya no está vacío: viajas con `{"title": "foo", "body": "bar", "userId": 1}` dentro, y el servidor te responde **201 Created** con el recurso creado y su ID nuevo. Eso es lo que aprendiste en el [punto 7](/ApuntesPSP/06-apis-rest-y-http/07-requests-post).

---

## 🔥 Fireside Chat: GET vs POST vs PUT vs DELETE

> *Cuatro verbos HTTP se sientan junto a la chimenea a decidir, de una vez, quién es el más importante.*

**GET:** — Yo soy el más usado. Solo pido información, no cambio nada. Soy seguro, idempotente y cacheable.

**POST:** — Pues yo soy el que crea cosas. Sin mí no habría nuevos recursos. Eso sí, no soy idempotente: si llamas dos veces, creo dos veces.

**PUT:** — Idempotente, como GET, pero yo actualizo. Mando el recurso completo y reemplazo lo que haya.

**DELETE:** — Y yo elimino. También idempotente: da igual cuántas veces lo llames, el recurso ya no está.

**GET:** — Oye, ¿y PATCH? Siempre se nos olvida...

**POST:** — Ese es el primo moderno que actualiza solo un campo. Pero mejor no liarnos, que ya somos suficientes.

> **Moraleja**: cada verbo HTTP tiene un propósito: GET (leer), POST (crear), PUT (reemplazar), DELETE (borrar). Elegir el correcto es hacer bien REST.

---

## 🕵️ ¿Quién soy?

1. Soy el formato de intercambio de datos que casi todas las APIs usan hoy: llaves, corchetes y comillas.
2. No soy idempotente: si me llamas dos veces, creo dos recursos.
3. Soy el código de estado que aparece cuando el recurso que buscas no existe.
4. Pongo una capa de abstracción: no necesitas saber cómo está implementado el sistema por dentro.
5. Soy la propiedad de la respuesta que devuelve `True` si el código está entre 200 y 399.
6. Soy la librería de facto para hacer peticiones HTTP en Python, y construyo la query string con `params=`.

<details>
<summary>🔄 Respuestas</summary>

1. **JSON**.
2. **POST**.
3. **404** (Not Found).
4. **Una API**.
5. **`resp.ok`**.
6. **requests**.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "404 que nadie entiende"

**CONRAD:** — "Clásico: haces GET a `https://api.github.com/users/python` y te llega 404. Razones: 1) **Escribiste mal la URL**: `/user` en lugar de `/users`, o te comiste un carácter. 2) **El recurso no existe**: el usuario cambió de nombre o fue borrado. 3) **Confundiste el recurso con la acción**: pediste `/search/repositories` sin `?q=`. 4) No distinguiste el **404** (no existe) del **401** (no autenticado) ni del **403** (sin permiso)."

**CONRAD:** — "Y lo mejor: *'¿será que GitHub está caído?'*. ¡Pues no! Si el servidor estuviera caído verías **500** o **503**, no 404. El 404 es tuyo: la red está bien, lo que pediste está mal. A revisar la URL y el método."

**CONRAD:** — "Y no me vengas con *'¿será que el JSON está mal?'* si antes ni comprobaste el `status_code`. Primero `status_code`, luego `json()`. Si parseas un 404, `resp.json()` te lanza una excepción y el mensaje de error te lleva por el camino de la amargura. A diagnosticar."

---

## ⚡ Laboratorio de tortura: mini cliente contra una API pública

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (`requests`, pip install si hace falta) y conexión a Internet

**Escenario:** construye un mini cliente que consulte dos APIs públicas de verdad: **GitHub API** y **JSONPlaceholder**. Usa todo lo de la unidad: GET con params, POST, PUT, DELETE y gestión de errores.

**Tareas paso a paso:**

1. **GET básico**: obtén `https://api.github.com/users/python` y muestra `login`, `name`, `public_repos` y `followers`.
2. **Búsqueda con params**: busca repositorios de Python con más de 1000 estrellas con `params={"q": "python stars:>1000", "sort": "stars", "per_page": 5}` y muestra nombre y estrellas de los 5 primeros.
3. **POST**: crea un post en `https://jsonplaceholder.typicode.com/posts` con `json={"title": "Hola API", "body": "Probando", "userId": 1}` y muestra el ID devuelto.
4. **PUT**: actualiza el post 1 con `requests.put` y comprueba que el título cambió.
5. **DELETE**: borra el post 1 y muestra el código de estado.
6. **Errores**: pide un usuario inexistente (`/users/usuarioquenoexiste123`) y muestra un mensaje "no encontrado" sin que el programa reviente.

**Fallo intencionado:** en el paso 3, en lugar de `requests.post`, usa **`requests.get`** con `json=`. ¿Qué pasa? La API no te deja crear nada con GET: te responde un 404 (o "Not Found") y, como tu código llama a `resp.json()` sin comprobar `status_code`, intenta parsear un cuerpo que no es JSON y **revienta**.

> **Pista 1:** los métodos no son intercambiables. Crear es siempre **POST** (lo viste en el [punto 2](/ApuntesPSP/06-apis-rest-y-http/02-metodos-http)). Si usas GET para escribir, la API te lo devuelve con un 4xx.
>
> **Pista 2:** si el fallo no se ve a simple vista, añade `print(resp.status_code, resp.text)` justo antes del `resp.json()`. Verás el código y el cuerpo de error en texto plano: esa es la prueba de que el problema está en el método elegido.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **HTTP Rider** | Explicar de memoria la anatomía de una petición y una respuesta HTTP |
| 🏅 **Verb Master** | Elegir correctamente GET, POST, PUT, PATCH o DELETE para cada operación CRUD |
| 🏅 **Status Whisperer** | Interpretar 200, 201, 400, 401, 404 y 500 sin mirar la tabla |
| 🏅 **JSON Parsel** | Parsear una respuesta JSON a dict de Python y extraer campos con seguridad |
| 🏅 **API Client** | Construir un mini cliente de API con GET, POST y gestión de errores |

---

## 🧠 Atrévete a pensar

1. ¿Por qué POST no es idempotente y PUT sí?
2. ¿Qué diferencia hay entre 401 y 403?
3. ¿Por qué REST prefiere recursos en las URLs (`/usuarios/5`) en lugar de acciones (`getUsuario?id=5`)?
4. ¿Qué significa "sin estado" y qué consecuencias tiene para el servidor?
5. ¿Cuándo usarías `resp.text` en lugar de `resp.json()`?

<details>
<summary>💡 Soluciones</summary>

1. Cada **POST** crea un recurso **nuevo**: dos llamadas = dos recursos. **PUT** reemplaza el recurso completo, así que el estado final tras repetirlo es el mismo (idempotente).
2. **401 Unauthorized**: no te has autenticado (falta el token). **403 Forbidden**: te has autenticado, pero no tienes permiso para esa acción.
3. Porque la URL **nombra la cosa** y el método HTTP **dice qué hacer**. Así la API es predecible (RESTful) y el verbo se reutiliza para todos los recursos.
4. Que el servidor **no guarda contexto entre peticiones**: cada petición lleva toda la información necesaria (por ejemplo, la autenticación en cada una). Consecuencia: el servidor escala fácil, no le pesa "recordar" a nadie.
5. Cuando quieras ver el cuerpo en **bruto**, sin parsear: inspeccionar un error, comprobar que devuelve HTML, o depurar. `resp.json()` solo tiene sentido si el cuerpo es JSON.
</details>

---

## 🧩 Crucigrama de bits

```
Horizontal:
1. Verbo HTTP para leer datos (3 letras)
4. Código de estado cuando el recurso no existe (3 letras)
5. Formato de intercambio de datos de las APIs (4 letras)
8. Verbo HTTP para borrar un recurso (6 letras)

Vertical:
2. Código de estado de error del servidor (3 letras)
3. Verbo HTTP para crear recursos (4 letras)
6. Cabecera que indica el formato que acepta la petición (6 letras)
7. La librería de facto para peticiones HTTP en Python (8 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. GET, 4. 404, 5. JSON, 8. DELETE
**Vertical:** 2. 500, 3. POST, 6. ACCEPT, 7. REQUESTS

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué es una API REST? Explícala como si fuera un camarero."**
2. **"¿Qué diferencia hay entre GET y POST? ¿Y entre PUT y PATCH?"**
3. **"Explica los códigos de estado: ¿qué significan 200, 201, 400, 401, 404 y 500?"**
4. **"Escribe en Python una petición GET con parámetros a una API y procesa la respuesta JSON."**
5. **"¿Cómo gestionarías los errores de una petición HTTP en tu código?"**

> 💡 **Cómo encararlas:** la 1 y la 4 son las "preguntas reina". Para la 1, recorre los pilares del [punto 3](/ApuntesPSP/06-apis-rest-y-http/03-principios-rest): recursos con URL, verbos HTTP, sin estado y JSON — con la analogía del camarero del [punto 1](/ApuntesPSP/06-apis-rest-y-http/01-web-y-http). Para la 4, escribe el esqueleto del [punto 6](/ApuntesPSP/06-apis-rest-y-http/06-requests-get): `params=`, `status_code`, `resp.json()`. Si sabes contarlo fluido, ya eres medio desarrollador de APIs.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Necesito siempre una API key?**

No, hay APIs públicas sin key (como la de GitHub para datos públicos). Pero la mayoría requiere autenticación. Y cuando la necesites, la mandas en la cabecera `Authorization` (nunca en la URL ni en el código): lo verás en la [U07](/ApuntesPSP/07-apis-comerciales).

> ❓ **¿Puedo modificar datos con GET?**

Técnicamente sí, pero **no debes**. GET es para leer. POST/PUT para modificar. Si usas GET para modificar, violas REST: el método deja de decir la verdad sobre lo que haces.

> ❓ **¿Qué es CORS y me afecta en Python?**

CORS es una restricción del navegador. En Python no te afecta (no hay navegador). Es cosa de JavaScript.

> ❓ **¿Qué significa que una API sea "sin estado" (stateless)?**

Que cada petición contiene toda la información necesaria. El servidor no guarda contexto entre peticiones. Como un camarero que no recuerda tu cara: cada vez le tienes que decir todo.

> ❓ **¿JSON o XML?**

Hoy en día, JSON gana por goleada. XML solo se usa en entornos legacy (bancos, SOAP).

---

## 🎬 Poscréditos

> *Tu petición GET parte de tu portátil, cruza Internet y vuelve con un JSON bajo el brazo.*
>
> *El camarero te trajo exactamente lo que pediste: status 200 y los datos listos para usar.*
>
> *Y ahora que sabes hablar con la web, toca llamar a las APIs de verdad: las comerciales.*

**PRÓXIMAMENTE EN U07:** *APIs comerciales. OpenWeatherMap, OpenAI y las API keys que nunca, jamás, se suben a GitHub.*

---

## ✅ Criterios de evaluación cubiertos (RA4a-b)

**RA4: Desarrolla aplicaciones que se comunican por red. Servicios en red.**

| CE | Criterio | Cubierto |
|---|---|---|
| a) | Utiliza APIs REST para obtener datos externos | ✅ Puntos 3, 6-8 + ⚡ Laboratorio de tortura |
| b) | Gestiona peticiones HTTP y procesa respuestas JSON | ✅ Puntos 1-5 y 7 + ⚡ Laboratorio de tortura |

> RA4c (servidores concurrentes) y RA4d (ThreadPool) se cubren en la **U10 · Servidores Concurrentes**. RA4e-g (asyncio, disponibilidad, comparativa) se cubren en la **U11 · asyncio y disponibilidad**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/06-apis-rest-y-http) · **Anterior:** [08 · Práctica API](/ApuntesPSP/06-apis-rest-y-http/08-practica-api) · **Siguiente:** **[U07 · APIs Comerciales](/ApuntesPSP/07-apis-comerciales)**