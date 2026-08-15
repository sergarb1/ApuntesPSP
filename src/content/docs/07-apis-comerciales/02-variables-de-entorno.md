---
title: 02 — Variables de entorno
description: "Nunca subas tus claves: python-dotenv y el .env 🔒"
---

<p><small>Nunca subas tus claves: python-dotenv y el .env 🔒</small></p>

> 🗺️ **Estás en:** 🧪 **U07 · APIs Comerciales** → 02 · Variables de entorno

---

## 📬 La idea en una frase

> Las claves nunca van en el código: se guardan en un archivo **`.env`** que se carga con **`python-dotenv`**, y en Python se leen con **`os.getenv()`**.

Así el código queda limpio (nadie ve tus secretos al abrir el repo) y las claves viven en un archivo que no se sube a git.

---

## 📁 El archivo `.env`

Un archivo `.env` es un fichero de texto plano en la raíz de tu proyecto donde cada línea define una variable de entorno:

```
OPENWEATHER_API_KEY=abc123...
OPENAI_API_KEY=sk-...
```

**Este archivo NO se sube a git.** Es tuyo, de tu máquina, y cada persona (o cada CI) tiene el suyo. Si alguien abre tu repo en GitHub, debería encontrar el código pero nunca el `.env`.

---

## ⚙️ Cargarlo con `python-dotenv`

Primero se instala la librería:

```bash
pip install python-dotenv
```

Y en el código, al arrancar, se carga el `.env` y se leen las variables:

```python
# pip install python-dotenv
from dotenv import load_dotenv
import os

load_dotenv()  # Carga el archivo .env

API_KEY = os.getenv("OPENWEATHER_API_KEY")
if not API_KEY:
    raise ValueError("❌ Falta OPENWEATHER_API_KEY en .env")
```

Desglose de las tres piezas:

| Línea | Qué hace |
|---|---|
| `load_dotenv()` | Lee el `.env` y mete cada variable en el entorno del proceso |
| `os.getenv("OPENWEATHER_API_KEY")` | Devuelve el valor, o `None` si no existe |
| `if not API_KEY: raise ValueError(...)` | Frena el programa con un mensaje claro si falta la clave |

> 💡 El `raise ValueError` es tu salvavidas: en lugar de llegar a una petición con `None` y fallar con un error críptico del servidor, tu programa muere al instante diciéndote **qué** clave falta.

---

## 🚫 No subir claves al repo

Git nunca va a saber por sí solo que el `.env` es secreto: hay que decírselo con un **`.gitignore`**. Este archivo le dice a git qué ficheros no debe rastrear:

```
# .gitignore
.env
```

Con ese `.gitignore` en tu repo, `git add .` ya no se llevará el `.env` por delante.

> ⚠️ **Aviso para adultos:** si algún día subes una clave por error, borrarla del código NO la borra del historial de git. La única solución es **rotar la clave** (crear una nueva y anular la vieja). Lo verás en el [punto 7](/ApuntesPSP/07-apis-comerciales/07-seguridad-y-buenas-practicas).

---

## 🧠 Mini-chequeo

1. ¿Qué hace `load_dotenv()` exactamente?
2. ¿Qué devuelve `os.getenv("MI_CLAVE")` si la variable no existe?
3. ¿Por qué el `.env` no se sube a git y cómo se lo dices a git?

<details>
<summary>🔄 Respuestas</summary>

1. Lee el archivo `.env` del proyecto y **carga cada variable en el entorno del proceso**, para que `os.getenv` las encuentre.
2. Devuelve **`None`**. Por eso conviene comprobarlo y lanzar un `raise ValueError` con un mensaje claro.
3. Porque contiene **secretos**. Se lo dices a git añadiendo `.env` a un archivo `.gitignore` en la raíz del proyecto.
</details>

---

## ✅ Resumen en 3 frases

- Las claves se guardan en un archivo `.env` de texto plano, fuera del código.
- `load_dotenv()` lo carga y `os.getenv("CLAVE")` devuelve el valor (o `None`).
- Un `.gitignore` con `.env` evita que tus secretos lleguen a GitHub.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| `.env` | Archivo de texto donde viven tus variables secretas |
| `load_dotenv()` | Carga el `.env` al entorno del proceso |
| `os.getenv()` | Lee el valor de una variable de entorno (o `None`) |
| `.gitignore` | Lista de ficheros que git ignora |
| Variable de entorno | Valor externo que el código lee, nunca incrustado |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Anterior:** [01 · API Keys](/ApuntesPSP/07-apis-comerciales/01-api-keys) · **Siguiente:** [03 · OpenWeatherMap](/ApuntesPSP/07-apis-comerciales/03-openweathermap)