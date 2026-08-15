---
title: Boletín U06 — Inicial
description: Ejercicios básicos de APIs REST y HTTP
---

# 📝 Boletín U06 — Inicial

> Ejercicios básicos para afianzar los conceptos de APIs REST, métodos HTTP, códigos de estado y JSON de la unidad U06.

---

## 1. GET a JSONPlaceholder

Usa `requests.get` para obtener el post con ID 1 de `https://jsonplaceholder.typicode.com/posts/1`. Muestra el `status_code`.

## 2. Título del post

Del ejercicio anterior, muestra el campo `"title"` del post obtenido usando `resp.json()`.

## 3. Contar usuarios

Haz GET a `https://jsonplaceholder.typicode.com/users` y muestra cuántos usuarios hay (la longitud de la lista).

**Pista:** `resp.json()` devuelve una lista de diccionarios; su longitud es el número de usuarios.

## 4. GET a GitHub

Usa `requests.get` para obtener los datos del usuario `python` de `https://api.github.com/users/python`. Muestra el `status_code`.

## 5. Mostrar JSON

Del ejercicio anterior, muestra la respuesta completa con `print(resp.json())`.

## 6. Nombre real

Del mismo usuario, muestra el campo `"name"` (su nombre real) accediendo al diccionario.

## 7. Métodos HTTP

Relaciona cada método HTTP con su operación CRUD y su uso:

| Método | Operación CRUD | Uso |
|---|---|---|
| GET | ___ | ___ |
| POST | ___ | ___ |
| PUT | ___ | ___ |
| PATCH | ___ | ___ |
| DELETE | ___ | ___ |

**Pista:** CRUD = Create, Read, Update, Delete. Recuerda que PUT reemplaza el recurso completo y PATCH solo una parte.

## 8. Códigos de estado

Completa el significado de estos códigos de estado HTTP:

a) 200 → ___
b) 201 → ___
c) 204 → ___
d) 400 → ___
e) 401 → ___
f) 404 → ___
g) 500 → ___

**Pista:** 2xx es éxito, 4xx es error del cliente, 5xx es error del servidor.