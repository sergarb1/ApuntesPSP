---
title: 07 — Seguridad y buenas prácticas
description: Protege tus claves como si fueran la llave de tu casa 🔐
---

<p><small>Protege tus claves como si fueran la llave de tu casa 🔐</small></p>

> 🗺️ **Estás en:** 🧪 **U07 · APIs Comerciales** → 07 · Seguridad y buenas prácticas

---

## 📬 La idea en una frase

> Una **API key filtrada es una factura en tu nombre**: nunca se sube a GitHub, se **rota** si se filtra y se guarda siempre en el `.env`.

Cualquiera con tu clave puede usarla (y gastar tu cuota, o peor, tu dinero). La seguridad aquí es una decisión de cada `git commit`.

---

## 🚫 Lo que nunca debes hacer

Esto funciona, pero es una bomba de relojería:

```python
# ❌ MAL: la clave incrustada en el código
import requests

API_KEY = "sk-1234567890abc"  # 🚨 ¡Alguien la verá!

resp = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={"q": "Sevilla", "appid": API_KEY, "units": "metric"}
)
```

En cuanto hagas `git push`, esa cadena viaja a GitHub y queda ahí **para siempre** (aunque luego la borres). El servidor de OpenWeatherMap cobrará en tu cuenta cada uso que haga quien la encuentre.

La versión correcta:

```python
# ✅ BIEN: la clave vive en el .env, el código no sabe nada
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

resp = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={"q": "Sevilla", "appid": API_KEY, "units": "metric"}
)
```

---

## 🗂️ El `.gitignore` y el commit

El `.gitignore` es tu primera línea de defensa:

```
# .gitignore
.env
```

> 🔍 **Comprueba antes de commitear:** `git status` debe mostrar tu `.env` como ignorado. Si aparece en la lista, para: no hagas `git add .` sin mirar.

Y si algún día te preguntas "¿puedo guardar la API key en el código para pruebas?" — la respuesta honesta:

> Solo si el código **nunca** va a GitHub. Mejor acostúmbrate a `.env` desde el principio: es un hábito, no una técnica.

---

## 🔁 Rotación de claves

Si una clave se filtra (la subiste a GitHub, la enviaste por correo, la viste en un log), la solución **no es borrar** —ya es tarde— sino **rotar**:

1. Entra en el panel del proveedor (OpenWeatherMap, OpenAI…).
2. **Revoca** la clave filtrada (la anulas al momento).
3. **Genera una nueva** clave y actualiza tu `.env`.

La metáfora del [punto 1](/ApuntesPSP/07-apis-comerciales/01-api-keys): si pierdes el llavero del edificio, no vales con "olvidé dónde lo dejé". Cambias la cerradura.

---

## 🛡️ Checklist de buenas prácticas

| ☐ | Práctica | Por qué |
|---|---|---|
| ☐ | Claves en el `.env` | El código queda limpio y sin secretos |
| ☐ | `.gitignore` con `.env` | Git no se lleva tus claves al repo |
| ☐ | Revisar `git status` antes de commitear | Cazas errores antes de que sean públicos |
| ☐ | Rotar la clave si se filtra | Anulas el daño al momento |
| ☐ | Clave en la cabecera, no en la URL | La URL queda en logs e historial |
| ☐ | No usar la misma clave en varios proyectos | Un fallo no compromete todo |

---

## 🧠 Mini-chequeo

1. ¿Por qué borrar una clave del código no basta si ya subió a GitHub?
2. ¿Qué es rotar una clave y cuándo se hace?
3. Escribe el `.gitignore` mínimo de este módulo.

<details>
<summary>🔄 Respuestas</summary>

1. Porque la clave **ya está en el historial de git**: aunque la borres del fichero, el commit la conserva. Hay que **revocarla** y generar otra.
2. **Revocar la clave filtrada y generar una nueva**, actualizando el `.env`. Se hace cuando sospechas que alguien pudo verla.
3. `.env` (una sola línea). Con ella, git ignora el archivo de secretos.
</details>

---

## ✅ Resumen en 3 frases

- Una clave en el código es una clave en GitHub: el `.env` + `.gitignore` la mantienen fuera del repo.
- Si una clave se filtra, la única solución real es **rotarla** (revocar y crear otra).
- La seguridad no es una función, es un hábito de cada commit: revisar `git status` antes de subir.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Filtrar una clave | Que una clave salga a un sitio público (GitHub, logs) |
| Rotar | Revocar la clave comprometida y generar una nueva |
| `.gitignore` | Archivo que excluye ficheros de git |
| Secretos | Credenciales que nunca deben hacerse públicas |
| Panel del proveedor | Web donde generas y revocas tus claves |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Anterior:** [06 · Errores HTTP](/ApuntesPSP/07-apis-comerciales/06-errores-http) · **Siguiente:** [08 · Práctica: APIs comerciales](/ApuntesPSP/07-apis-comerciales/08-practica-apis-comerciales)