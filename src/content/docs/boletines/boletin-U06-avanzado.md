---
title: Boletín U06 — Avanzado
description: Ejercicios avanzados de APIs REST y HTTP
---

# 💪 Boletín U06 — Avanzado

> Ejercicios que requieren aplicar los conceptos de APIs REST, requests y JSON de forma más profunda, con programas completos contra APIs reales.

---

## 1. PUT para actualizar

Haz PUT a `https://jsonplaceholder.typicode.com/posts/1` con `json={"title": "nuevo titulo", "body": "nuevo cuerpo", "userId": 1}`. Muestra el código de estado y el título actualizado.

**Pista:** `requests.put` con `json=` reemplaza el recurso completo. El título actualizado está en `resp.json()["title"]`.

## 2. DELETE un recurso

Haz DELETE a `https://jsonplaceholder.typicode.com/posts/1`. ¿Qué código de estado devuelve un borrado exitoso?

## 3. HEAD request

Usa `requests.head()` para pedir solo las cabeceras de `https://api.github.com`. Muestra los valores de `Content-Type` y `X-RateLimit-Remaining` de las cabeceras.

**Pista:** `requests.head` no devuelve cuerpo, solo cabeceras. Accede a ellas con `resp.headers["Content-Type"]`.

## 4. 🎯 Info de usuario de GitHub

Obtén los datos del usuario "python" y muestra: nombre, bio, repos públicos, seguidores, fecha de creación.

**Pista**: La API de GitHub (`https://api.github.com/users/python`) devuelve un JSON con campos como `name`, `bio`, `public_repos`, `followers` y `created_at`. Usa `resp.json()` para acceder a cada campo.

## 5. 🔍 Buscador de repositorios

Busca repositorios de Python con más de 1000 estrellas. Muestra nombre y estrellas.

**Pista**: La API de búsqueda de GitHub (`/search/repositories`) acepta `q` como parámetro. Usa `"python stars:>1000"` para filtrar. Ordena por `stars` con `sort=stars` y limita a 5 resultados con `per_page=5`.

## 6. 🧩 API con paginación

La API de GitHub página los resultados. Obtén los primeros 20 repos del usuario "python" (2 páginas de 10).

**Pista**: Usa los parámetros `page` y `per_page` en cada petición a `https://api.github.com/users/{usuario}/repos`. Itera sobre las páginas que necesites y acumula los resultados en una lista.

## 7. 🎭 POST y respuesta

Crea un post en JSONPlaceholder, luego haz GET para verificarlo.

**Pista**: JSONPlaceholder es una API de pruebas. El POST devuelve el recurso creado con un ID (101). Luego puedes hacer GET a `https://jsonplaceholder.typicode.com/posts/101` para verificar la creación.

## 8. ⏱ Tiempo de respuesta

Mide el tiempo de respuesta de 5 APIs distintas. ¿Cuál es más rápida?

**Pista**: Mide el tiempo con `time.time()` antes y después de cada `requests.get()`. Prueba varias APIs gratuitas (GitHub, JSONPlaceholder, httpbin, ReqRes) y compara los tiempos en milisegundos.

## 9. 🏗️ Cliente de API con caché

Crea un cliente que cachee respuestas en un diccionario para no repetir peticiones.

**Pista**: Usa un diccionario global donde la clave sea la URL. Guarda el dato y el timestamp. Antes de hacer una petición, comprueba si la URL está en caché y si el tiempo transcurrido desde que se guardó es menor al TTL.