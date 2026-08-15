---
title: 03 — Principios REST
description: Recursos, URLs semánticas y sin estado 🏛️
---

<p><small>Recursos, URLs semánticas y sin estado 🏛️</small></p>

> 🗺️ **Estás en:** 🌐 **U06 · APIs REST y HTTP** → 03 · Principios REST

---

## 📬 La idea en una frase

> **REST** (*Representational State Transfer*) es el estándar de las APIs modernas: trata las cosas del sistema como **recursos**, a cada recurso le da una **URL** y lo manipula con los **verbos HTTP** que viste en el [punto 2](/ApuntesPSP/06-apis-rest-y-http/02-metodos-http).

REST no es una tecnología ni una librería: es un conjunto de **convenciones**. Cuando las sigues, cualquiera puede usar tu API sin leer un manual de 100 páginas.

---

## 🧱 Recursos: las cosas, no las acciones

En REST, modelas **sustantivos**, no verbos. Un recurso es "una cosa" del sistema: un usuario, un producto, un pedido. Cada recurso tiene su URL:

```
/productos      → todos los productos
/productos/123  → el producto 123
```

Fíjate en la diferencia con las APIs antiguas basadas en acciones:

| ❌ Acciones (no REST) | ✅ Recursos (REST) |
|---|---|
| `/getUsuario?id=5` | `GET /usuarios/5` |
| `/crearUsuario` | `POST /usuarios` |
| `/borrarUsuario?id=5` | `DELETE /usuarios/5` |

En REST la URL es un **nombre** (qué cosa) y el método HTTP es el **verbo** (qué hacer). Se separan los dos conceptos en vez de mezclarlos en la URL.

---

## 🗄️ Los cuatro pilares de REST

- **Recursos**: cada entidad tiene una URL (`/usuarios`, `/productos/123`).
- **Verbos HTTP**: GET (leer), POST (crear), PUT (actualizar), DELETE (borrar).
- **Sin estado** (stateless): cada petición contiene todo lo necesario.
- **JSON**: el formato de intercambio de datos.

Con esos cuatro pilares, una API REST es predecible: si sabes usar una, sabes usar todas. Ese es el mapa mental que te llevas de esta unidad:

```
GET    /usuarios        → Listar usuarios
GET    /usuarios/5      → Obtener usuario 5
POST   /usuarios        → Crear usuario
PUT    /usuarios/5      → Actualizar usuario 5
DELETE /usuarios/5      → Borrar usuario 5
```

---

## 🕊️ Sin estado (stateless)

Que una API sea **stateless** significa que el servidor **no guarda contexto entre peticiones**: cada petición lleva toda la información necesaria para ser entendida por sí sola.

Piénsalo como un camarero que no recuerda tu cara: cada vez que pides algo, le tienes que decir todo de nuevo. No puedes decir "lo mismo de antes", porque el camarero no guarda memoria de lo anterior.

Consecuencia práctica: el servidor no tiene que recordar quién eres entre llamadas. Si tu petición necesita autenticación, la envías en cada petición (en la cabecera `Authorization`), no "la primera vez y ya está".

---

## 🏷️ ¿Qué significa "RESTful"?

Una API es **RESTful** si cumple de verdad los principios REST: recursos con URLs semánticas, verbos HTTP bien usados, sin estado y JSON como formato.

Dos ejemplos opuestos:

- ✅ **RESTful**: `GET https://api.github.com/users/python` → "dame el recurso del usuario python".
- ❌ **No RESTful**: `GET https://miapi.com/obtenerUsuario?id=5&accion=leer` → meto la acción en la URL y abuso del GET.

Elegir el verbo correcto para cada operación es lo que el [punto 2](/ApuntesPSP/06-apis-rest-y-http/02-metodos-http) llamaba "hacer bien REST". Las APIs de GitHub, GitHub Search o JSONPlaceholder que usarás en esta unidad son RESTful: fíjate en cómo sus URLs son limpias y su método dice la intención.

---

## 🧠 Mini-chequeo

1. ¿Qué es un recurso en REST? Pon dos ejemplos de URLs.
2. ¿Por qué `GET /getUsuario?id=5` no es RESTful?
3. ¿Qué significa que una API sea "sin estado"?

<details>
<summary>🔄 Respuestas</summary>

1. Un recurso es "una cosa" del sistema (usuario, producto, pedido…). Ejemplos: `/usuarios`, `/productos/123`.
2. Porque mezcla la acción (`get`) en la URL en lugar de usar el método HTTP. En REST la URL nombra el recurso y el verbo HTTP dice qué hacer: `GET /usuarios/5`.
3. Que el servidor **no guarda contexto entre peticiones**: cada petición lleva toda la información necesaria para entenderse sola.
</details>

---

## ✅ Resumen en 3 frases

- REST modela **recursos** con URLs semánticas y los manipula con los **verbos HTTP**, sin meter la acción en la URL.
- Sus cuatro pilares son recursos, verbos HTTP, **sin estado** y JSON.
- Una API que cumple esos principios es **RESTful**: predecible y fácil de usar.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| REST | Estándar de APIs: recursos + verbos HTTP + sin estado + JSON |
| Recurso | Una "cosa" del sistema con su URL |
| URL semántica | URL que nombra el recurso, no la acción |
| Stateless | El servidor no guarda contexto entre peticiones |
| RESTful | API que cumple los principios REST |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/06-apis-rest-y-http) · **Anterior:** [02 · Métodos HTTP](/ApuntesPSP/06-apis-rest-y-http/02-metodos-http) · **Siguiente:** [04 · Códigos de estado](/ApuntesPSP/06-apis-rest-y-http/04-codigos-de-estado)