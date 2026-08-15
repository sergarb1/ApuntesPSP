---
title: Boletín U07 — Inicial
description: Ejercicios básicos de APIs Comerciales
---

# 📝 Boletín U07 — Inicial

> Ejercicios básicos para afianzar los conceptos de API keys, variables de entorno, OpenWeatherMap y errores HTTP de la unidad U07.

---

## 1. Humedad actual

Usa OpenWeatherMap para obtener el clima de tu ciudad. Muestra la humedad (`humidity`) del campo `main`.

## 2. Descripción del clima

Del mismo JSON, muestra la descripción del tiempo (campo `description` dentro de `weather`).

## 3. Temperatura mínima y máxima

Muestra la temperatura mínima (`temp_min`) y máxima (`temp_max`) del pronóstico actual de tu ciudad.

## 4. Temperatura y sensación térmica

Muestra la temperatura actual (`temp`) y la sensación térmica (`feels_like`) de tu ciudad en grados centígrados.

**Pista:** recuerda el parámetro `units=metric` para que la API devuelva grados en lugar de kelvin.

## 5. Error 401

Haz una petición a OpenWeatherMap con una API key falsa (`appid="falsa"`). ¿Qué código de estado devuelve?

## 6. ¿Dónde va la API key?

a) ¿En qué parámetro de la query string espera OpenWeatherMap la clave?
b) ¿En qué cabecera y con qué esquema espera OpenAI la clave?

## 7. Clave desde el `.env`

Crea un archivo `.env` con `OPENWEATHER_API_KEY=test123`. Usa `python-dotenv` para cargarlo y muestra la clave con `os.getenv`.

**Pista:** `load_dotenv()` primero, `os.getenv("OPENWEATHER_API_KEY")` después.

## 8. Protege el repo

a) Escribe la línea del `.gitignore` que evita subir el archivo `.env` a git.
b) ¿Qué devuelve `os.getenv("MI_CLAVE")` si la variable no existe?