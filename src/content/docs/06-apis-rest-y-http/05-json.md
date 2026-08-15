---
title: 05 — JSON
description: "El idioma de las APIs: de texto a diccionario y vuelta 📦"
---

<p><small>El idioma de las APIs: de texto a diccionario y vuelta 📦</small></p>

> 🗺️ **Estás en:** 🌐 **U06 · APIs REST y HTTP** → 05 · JSON

---

## 📬 La idea en una frase

> **JSON** (*JavaScript Object Notation*) es el formato de intercambio de datos más usado en las APIs: un texto estructurado con llaves, corchetes y comillas que Python convierte directamente a **diccionarios** y **listas**.

Es el "idioma" en el que las APIs te devuelven los datos. En el [punto 3](/ApuntesPSP/06-apis-rest-y-http/03-principios-rest) lo viste como uno de los cuatro pilares de REST; aquí le toca el turno de verdad.

---

## 📦 El formato

Un JSON es un texto con pares `"clave": valor`. Los valores pueden ser números, textos, booleanos, listas u otros objetos anidados:

```json
{
  "nombre": "Ana",
  "edad": 25,
  "email": "ana@x.com",
  "activo": true,
  "intereses": ["Python", "redes", "cripto"]
}
```

Fíjate en las reglas: las **claves van entre comillas dobles**, los **textos entre comillas dobles**, los booleanos son `true`/`false` en minúscula y las listas van entre corchetes.

---

## 🐍 De JSON a Python y viceversa

El módulo `json` de la librería estándar hace la conversión en las dos direcciones:

```python
import json

# JSON (texto) → Python
texto = '{"nombre": "Ana", "edad": 25, "activo": true}'
datos = json.loads(texto)            # dict
print(datos["nombre"])               # "Ana"
print(type(datos))                   # <class 'dict'>

# Python → JSON (texto)
python_dict = {"nombre": "Ana", "edad": 25, "activo": True}
texto_json = json.dumps(python_dict, ensure_ascii=False, indent=2)
print(texto_json)
```

La equivalencia es casi automática:

| JSON | Python |
|---|---|
| `{ ... }` | `dict` |
| `[ ... ]` | `list` |
| `"texto"` | `str` |
| `42` | `int` / `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

> 💡 `json.dumps(..., ensure_ascii=False)` conserva las tildes tal cual; `indent=2` lo formatea legible. Y recuerda: `loads` viene de "**load s**tring" y `dumps` de "**dump s**tring".

---

## 🔁 JSON dentro de requests

Con `requests` ni siquiera tocas el texto: `resp.json()` parsea el cuerpo automáticamente y te da el dict/list de Python.

```python
import requests

resp = requests.get("https://api.github.com/users/python")
datos = resp.json()

print(datos["login"])          # "python"
print(datos["public_repos"])   # 42
print(datos["avatar_url"])     # "https://..."
```

Cuando la respuesta es una **lista** de recursos, `resp.json()` devuelve una lista de diccionarios y la recorres normal:

```python
resp = requests.get("https://jsonplaceholder.typicode.com/posts")
posts = resp.json()
print(f"Hay {len(posts)} posts")        # 100
print(posts[0]["title"])                # el título del primer post
```

> ⚠️ `resp.json()` **lanza excepción** si el cuerpo no es JSON (por ejemplo, un HTML de error). Por eso en el [punto 4](/ApuntesPSP/06-apis-rest-y-http/04-codigos-de-estado) primero compruebas `status_code` y luego parseas.

---

## 🧠 Mini-chequeo

1. ¿A qué tipo de Python se convierte `[1, 2, 3]`? ¿Y `{"a": true}`?
2. ¿Qué hace `json.loads` y qué hace `json.dumps`?
3. ¿Qué pasa si llamas a `resp.json()` sobre una respuesta que no es JSON?

<details>
<summary>🔄 Respuestas</summary>

1. `[1, 2, 3]` → **lista**; `{"a": true}` → **dict** (con `True` en Python).
2. `json.loads` convierte **texto JSON → Python**; `json.dumps` convierte **Python → texto JSON**.
3. **Lanza excepción** (`json.JSONDecodeError`). Por eso conviene comprobar el `status_code` antes de parsear.
</details>

---

## ✅ Resumen en 3 frases

- JSON es el formato de intercambio de datos de las APIs: texto estructurado que Python mapea a dicts y listas.
- `json.loads` y `json.dumps` hacen la conversión en las dos direcciones con el módulo `json`.
- Con `requests`, `resp.json()` parsea el cuerpo directamente, pero lanza excepción si no es JSON.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| JSON | Formato de intercambio de datos de las APIs |
| json.loads | De texto JSON a objeto Python |
| json.dumps | De objeto Python a texto JSON |
| resp.json() | Parseo directo del cuerpo de la respuesta |
| ensure_ascii | Opción de `dumps` para conservar tildes |
| JSONDecodeError | Excepción al parsear algo que no es JSON |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/06-apis-rest-y-http) · **Anterior:** [04 · Códigos de estado](/ApuntesPSP/06-apis-rest-y-http/04-codigos-de-estado) · **Siguiente:** [06 · requests: el GET](/ApuntesPSP/06-apis-rest-y-http/06-requests-get)