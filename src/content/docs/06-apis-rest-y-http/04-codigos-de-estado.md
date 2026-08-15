---
title: 04 — Códigos de estado
description: "La señal de humo del servidor: 200, 404, 500… 🚨"
---

<p><small>La señal de humo del servidor: 200, 404, 500… 🚨</small></p>

> 🗺️ **Estás en:** 🌐 **U06 · APIs REST y HTTP** → 04 · Códigos de estado

---

## 📬 La idea en una frase

> Cada respuesta HTTP lleva un **código de estado** que te dice si la petición salió bien o mal: **2xx es éxito, 3xx es redirección, 4xx es un error tuyo y 5xx es un error del servidor**.

Es la señal de humo de la web: en tres dígitos, el servidor te dice qué ha pasado sin necesidad de leer el cuerpo.

---

## 🎨 Las familias de códigos

| Familia | Significado | Ejemplos |
|---|---|---|
| **2xx** | Éxito | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirección | 301 Moved Permanently |
| **4xx** | Error del **cliente** (tuyo) | 400, 401, 403, 404, 429 |
| **5xx** | Error del **servidor** | 500, 503 |

> **Consejo**: los códigos 2xx son éxito, 4xx son error TUYO, 5xx son error DEL SERVIDOR. Cuando veas un 4xx, revisa tu petición; cuando veas un 5xx, la culpa es de la otra parte.

---

## 📋 La tabla completa

| Código | Significado | Situación típica |
|--------|-------------|------------------|
| **200** | OK | GET exitoso |
| **201** | Created | POST exitoso (recurso creado) |
| **204** | No Content | DELETE exitoso |
| **301** | Moved Permanently | La URL cambió |
| **400** | Bad Request | Enviaste datos incorrectos |
| **401** | Unauthorized | Falta autenticación |
| **403** | Forbidden | No tienes permiso |
| **404** | Not Found | El recurso no existe |
| **429** | Too Many Requests | Te pasaste del límite |
| **500** | Internal Server Error | Error del servidor |
| **503** | Service Unavailable | El servicio está caído |

Truco para no confundirte:

- **400 vs 404**: 400 = "tu petición está mal formada", 404 = "lo que pides no existe".
- **401 vs 403**: 401 = "no te has identificado", 403 = "te has identificado pero no tienes permiso".

---

## 🐍 Códigos en Python

En `requests`, el código está en `resp.status_code` (un entero). Lo compruebas antes de procesar los datos:

```python
import requests

resp = requests.get("https://api.github.com/users/python")
if resp.status_code == 200:
    print("✅ Todo bien:", resp.json()["login"])
elif resp.status_code == 404:
    print("❌ Usuario no encontrado")
else:
    print(f"⚠️ Código inesperado: {resp.status_code}")
```

> 💡 `requests` **no lanza excepción** cuando llega un 404 o un 500: te devuelve la respuesta con su `status_code` y `resp.ok` será `False`. Eres tú quien decide cómo tratarlo. Si quieres que una respuesta mala lance excepción, usa `resp.raise_for_status()` (lo verás en el [punto 7](/ApuntesPSP/06-apis-rest-y-http/07-requests-post)).

---

## 🧠 Mini-chequeo

1. ¿Qué familia indica un error del servidor? ¿Y un error tuyo?
2. ¿Qué código devuelve un POST exitoso? ¿Y un DELETE exitoso?
3. Diferencias 401 vs 403 y 400 vs 404.

<details>
<summary>🔄 Respuestas</summary>

1. Error del servidor → **5xx** (500, 503). Error tuyo → **4xx** (400, 401, 403, 404, 429).
2. POST exitoso → **201 Created**. DELETE exitoso → **204 No Content**.
3. **401** = falta autenticación (no te has identificado); **403** = no tienes permiso (identificado, pero prohibido). **400** = petición mal formada; **404** = el recurso no existe.
</details>

---

## ✅ Resumen en 3 frases

- El código de estado es la señal de humo de HTTP: 2xx éxito, 3xx redirección, 4xx error tuyo, 5xx error del servidor.
- En Python lo lees con `resp.status_code` y decides qué hacer con cada código.
- `requests` no lanza excepción ante un 4xx/5xx: comprobar `status_code` (o usar `raise_for_status()`) es tu responsabilidad.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Código de estado | Los 3 dígitos que resumen el resultado de una petición |
| 2xx | Éxito (200 OK, 201 Created, 204 No Content) |
| 4xx | Error del cliente (400, 401, 403, 404, 429) |
| 5xx | Error del servidor (500, 503) |
| status_code | La propiedad de la respuesta que lo contiene (int) |
| raise_for_status() | Método que lanza excepción si el código es 4xx/5xx |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/06-apis-rest-y-http) · **Anterior:** [03 · Principios REST](/ApuntesPSP/06-apis-rest-y-http/03-principios-rest) · **Siguiente:** [05 · JSON](/ApuntesPSP/06-apis-rest-y-http/05-json)