---
title: "📝 INTERMEDIO POR RESOLVER 6 — APIs REST y HTTP"
nav_order: 6
---

### 4. PUT para actualizar
Haz PUT a `https://jsonplaceholder.typicode.com/posts/1` con `json={"title": "nuevo titulo", "body": "nuevo cuerpo", "userId": 1}`. Muestra el código de estado y el título actualizado.

### 5. DELETE un recurso
Haz DELETE a `https://jsonplaceholder.typicode.com/posts/1`. ¿Qué código de estado devuelve un borrado exitoso?

### 6. HEAD request
Usa `requests.head()` para pedir solo las cabeceras de `https://api.github.com`. Muestra los valores de `Content-Type` y `X-RateLimit-Remaining` de las cabeceras.
