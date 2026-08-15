---
title: "06 — requests: el GET"
description: "La librería estándar de facto para hablar HTTP 📥"
---

<p><small>La librería estándar de facto para hablar HTTP 📥</small></p>

> 🗺️ **Estás en:** 🌐 **U06 · APIs REST y HTTP** → 06 · requests: el GET

---

## 📬 La idea en una frase

> `requests` es la librería estándar de facto para hacer peticiones HTTP en Python: `requests.get(url)` te devuelve un objeto **respuesta** con el código, las cabeceras y el cuerpo ya parseado.

Todo lo que has visto hasta ahora —métodos, códigos, JSON— se materializa aquí en una llamada de una línea.

---

## 📥 El GET más básico

```python
import requests

# GET básico
resp = requests.get("https://api.github.com")
print(resp.status_code)     # 200
print(resp.headers)         # Cabeceras de respuesta
print(resp.elapsed)         # Tiempo que tardó
```

`requests.get` se encarga de todo lo que en la U04 hacías a mano con sockets: resolver el DNS, abrir la conexión TCP, el handshake TLS en HTTPS, construir la petición HTTP y leer la respuesta.

---

## 📄 La respuesta y sus propiedades

El objeto que devuelve `requests.get` es un objeto **respuesta** con estas propiedades:

| Propiedad | Qué devuelve |
|-----------|--------------|
| `resp.status_code` | Código HTTP (int) |
| `resp.ok` | `True` si 200-399 |
| `resp.text` | Cuerpo como string |
| `resp.json()` | Cuerpo como dict (¡lanza excepción si no es JSON!) |
| `resp.headers` | Dict con cabeceras |
| `resp.elapsed` | Objeto timedelta |

La jerarquía de uso habitual es: primero `status_code` (o `resp.ok`), luego `resp.json()` para los datos. Y si solo quieres ver qué te ha contestado en bruto, `resp.text`.

---

## 🔎 Parámetros de consulta

Muchas APIs filtran o buscan con **query params** en la URL. En vez de montar la URL a mano con `f"..."`, `requests` te da `params=` y construye la query string por ti:

```python
import requests

params = {"q": "python", "page": 1, "per_page": 10}
resp = requests.get("https://api.github.com/search/repositories", params=params)
# URL final: https://api.github.com/search/repositories?q=python&page=1&per_page=10
```

Ventajas de `params=` frente a concatenar a mano: escapa los caracteres especiales (espacios, `&`, `#`) y te ahorra errores de "se me olvidó el `?`".

---

## 🧢 Cabeceras personalizadas

Algunas APIs requieren cabeceras específicas: autenticación, formato esperado o el identificador de tu aplicación. Se envían con `headers=`:

```python
import requests

cabeceras = {
    "Authorization": "Bearer mi-token-secreto",
    "Accept": "application/json",
    "User-Agent": "MiApp/1.0"
}
resp = requests.get("https://api.github.com/user", headers=cabeceras)
```

> ⚠️ **Seguridad**: un token en la cabecera `Authorization` nunca debe ir "en claro" en el código ni subirse a GitHub. En la [U07](/ApuntesPSP/07-apis-comerciales) verás cómo guardarlo en variables de entorno con `python-dotenv`.

---

## 🧠 Mini-chequeo

1. ¿Qué devuelve `requests.get` exactamente?
2. ¿Para qué sirve `params=` y qué construye por ti?
3. ¿Qué propiedad te dice si el código está entre 200 y 399?

<details>
<summary>🔄 Respuestas</summary>

1. Un objeto **respuesta** con `status_code`, `headers`, `text`, `json()`, `ok` y `elapsed`.
2. `params=` construye la **query string** de la URL automáticamente (con el `?` y los `&`) y escapa los caracteres especiales.
3. `resp.ok` → `True` si el código está entre 200 y 399.
</details>

---

## ✅ Resumen en 3 frases

- `requests.get(url)` devuelve un objeto respuesta con código, cabeceras y cuerpo.
- `params=` construye la query string por ti y `headers=` envía cabeceras personalizadas (como el token).
- El orden de uso: comprobar `status_code`/`ok` y luego `resp.json()`.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| requests | La librería de facto para peticiones HTTP en Python |
| Objeto respuesta | Lo que devuelve `requests.get`: código, cabeceras y cuerpo |
| params | Diccionario que se convierte en query string |
| headers | Diccionario con las cabeceras de la petición |
| resp.text | El cuerpo en bruto como string |
| resp.elapsed | Tiempo que tardó la petición (timedelta) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/06-apis-rest-y-http) · **Anterior:** [05 · JSON](/ApuntesPSP/06-apis-rest-y-http/05-json) · **Siguiente:** [07 · requests: POST, PUT y DELETE](/ApuntesPSP/06-apis-rest-y-http/07-requests-post)