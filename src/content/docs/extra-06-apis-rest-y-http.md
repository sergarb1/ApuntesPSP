---
title: "⭐ AVANZADO 6 — APIs REST y HTTP"
nav_order: 6
---

## ⭐ AVANZADO 06 — APIs REST y HTTP


---

### 1. 🎯 Info de usuario de GitHub

Obtén los datos del usuario "python" y muestra: nombre, bio, repos públicos, seguidores, fecha de creación.

**Pista**: La API de GitHub (`https://api.github.com/users/python`) devuelve un JSON con campos como `name`, `bio`, `public_repos`, `followers` y `created_at`. Usa `resp.json()` para acceder a cada campo.

---

### 2. 🔍 Buscador de repositorios

Busca repositorios de Python con más de 1000 estrellas. Muestra nombre y estrellas.

**Pista**: La API de búsqueda de GitHub (`/search/repositories`) acepta `q` como parámetro. Usa `"python stars:>1000"` para filtrar. Ordena por `stars` con `sort=stars` y limita a 5 resultados con `per_page=5`.

---

### 3. 🧩 API con paginación

La API de GitHub página los resultados. Obtén los primeros 20 repos del usuario "python" (2 páginas de 10).

**Pista**: Usa los parámetros `page` y `per_page` en cada petición a `https://api.github.com/users/{usuario}/repos`. Itera sobre las páginas que necesites y acumula los resultados en una lista.

---

### 4. 🎭 POST y respuesta

Crea un post en JSONPlaceholder, luego haz GET para verificarlo.

**Pista**: JSONPlaceholder es una API de pruebas. El POST devuelve el recurso creado con un ID (101). Luego puedes hacer GET a `https://jsonplaceholder.typicode.com/posts/101` para verificar la creación.

---

### 5. ⏱ Tiempo de respuesta

Mide el tiempo de respuesta de 5 APIs distintas. ¿Cuál es más rápida?

**Pista**: Mide el tiempo con `time.time()` antes y después de cada `requests.get()`. Prueba varias APIs gratuitas (GitHub, JSONPlaceholder, httpbin, ReqRes) y compara los tiempos en milisegundos.

---

### 6. 🏗️ Cliente de API con caché

Crea un cliente que cachee respuestas en un diccionario para no repetir peticiones.

**Pista**: Usa un diccionario global donde la clave sea la URL. Guarda el dato y el timestamp. Antes de hacer una petición, comprueba si la URL está en caché y si el tiempo transcurrido desde que se guardó es menor al TTL.
