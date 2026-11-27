---
title: "09 — Ejemplo completo: Rick y Morty (API gratuita sin registro)"
description: "API gratuita sin registro: cliente completo, errores y sus imágenes con Pillow 🛸"
---

<p><small>API gratuita sin registro: cliente completo, errores y sus imágenes con Pillow 🛸</small></p>

> 🗺️ **Estás en:** 🧪 **UD 8 · APIs comerciales** → 09 · Ejemplo completo: Rick y Morty (API gratuita sin registro)

---

## 📬 La idea en una frase

> Aquí construyes **de verdad un cliente completo**: baja los 826 personajes de una API pública sin clave, gestiona sus errores, y luego **muestra sus imágenes en pantalla con Pillow**.

Las APIs comerciales de los puntos 3 y 4 te pidieron clave, `.env` y cuota. Esta no: [rickandmortyapi.com](https://rickandmortyapi.com) es **gratuita y no necesita API key**… pero tus buenas prácticas siguen valiendo igual: `timeout`, `raise_for_status()`, paginación, 404, 429 y un poco de cortesía.

---

## 🎯 Qué vas a construir

Un programa (`rickmorty.py`) que hace dos cosas:

1. **Parte 1 — Hablar con la API:** baja todos los personajes por páginas, los guarda en JSON, cuenta estados y especies y monta el reparto de un episodio.
2. **Parte 2 — Verlo con Pillow:** descarga los avatares, compone una **rejilla** y una **ficha** de personaje, las muestra en pantalla y las guarda como PNG.

> 📦 **Requisitos:** `pip install requests Pillow` — y nada más. Sin API key, sin `.env`, sin coste.

Las dos imágenes de este capítulo las genera el propio programa:

![Rejilla con los avatares de los ocho primeros personajes de la API de Rick y Morty, cada uno con su nombre debajo](/ApuntesPSP/ejemplos/rick-morty/rejilla-personajes.png)

![Ficha de Rick Sanchez generada con Pillow: avatar, nombre, especie, estado, origen y última aparición](/ApuntesPSP/ejemplos/rick-morty/ficha-personaje.png)

---

## 🔎 Paso 0: míralo a mano primero

Abre en el navegador **<https://rickandmortyapi.com/api>** y mira la respuesta:

```json
{
  "info": { "count": 826, "pages": 42,
            "next": "https://rickandmortyapi.com/api/character?page=2",
            "prev": null },
  "results": [ { "id": 1, "name": "Rick Sanchez", ... }, ... ]
}
```

Tres cosas que conviene mirar antes de escribir código:

- **`info` + `results`:** la paginación no va por cabeceras, va dentro del cuerpo. `info.next` es la URL de la página siguiente (`None` cuando no queda nada).
- **Los tres recursos principales:** `/character` (826 personajes en 42 páginas), `/episode` (51 episodios) y `/location` (126 localizaciones).
- **Qué pasa si no hay nada:** prueba `<https://rickandmortyapi.com/api/character?name=zzz>`. Responde **404** con `{"error": "There is nothing here"}`. Ojo: aquí el 404 **no es un fallo del programa**, es la API diciendo «ese filtro no da resultados». Saber distinguirlo es la clave del paso 2.

> 💡 **API comercial vs. API libre:** el trato cambia (clave, cuota, facturación), el patrón no: GET → JSON → comprueba el código → convierte los datos. Todo lo de los puntos 1 a 6 te vale aquí sin tocar una línea.

---

## 🧩 PARTE 1 — El cliente completo

### Paso 1 — Una función que pide con cabeza

Cualquier llamada empieza igual: `timeout` para que no se quede colgado y `raise_for_status()` para que un fallo no pase desapercibido. La novedad es el **404 que queremos**:

```python
import time
import requests

BASE = "https://rickandmortyapi.com/api"
TIMEOUT = 10
REINTENTOS = 5


def pedir(sesion, url, params=None):
    """GET con timeout. 404 = 'no hay nada aquí' → None; 429 → espera y reintenta."""
    for intento in range(REINTENTOS):
        resp = sesion.get(url, params=params, timeout=TIMEOUT)
        if resp.status_code == 404:
            return None                      # la API dice "no hay resultados"
        if resp.status_code != 429:
            resp.raise_for_status()          # 401, 500... → excepción de verdad
            return resp.json()
        espera = min(2 ** intento, 30)       # 429 → backoff del punto 05
        print(f"  429 → espero {espera} s")
        time.sleep(espera)
    raise RuntimeError("La API sigue devolviendo 429 Too Many Requests")
```

- **404 → `None`:** es el «no hay nada aquí» de la API; quien llama decide qué hacer.
- **429 → espera y reintenta:** aunque no pide clave, esta API también se protege si vas demasiado rápido. El backoff exponencial ya lo viste en el [punto 05](/ApuntesPSP/07-apis-comerciales/05-rate-limiting).
- **El resto → `raise_for_status()`:** un 500 o un 401 inesperado debe romper el programa con un mensaje claro, no devolver medio JSON.
### Paso 2 — Traer una página

```python
def traer_pagina(sesion, url, params=None):
    """Devuelve (info, results). Sin resultados → ({}, [])."""
    datos = pedir(sesion, url, params)
    if datos is None:
        return {}, []
    return datos.get("info", {}), datos.get("results", [])
```

Así el 404 de `?name=zzz` se convierte en una lista vacía y tu programa sigue adelante, sin `try/except` por todas partes.

### Paso 3 — Paginar hasta el final

`info["next"]` te da la siguiente URL en bandeja; mientras haya, seguimos. Y **esperamos un poco entre páginas**: 42 peticiones seguidas en un segundo es exactamente lo que provoca un 429.

```python
def traer_todo(sesion, recurso, params=None, pausa=1.0):
    url = BASE + recurso
    todos = []
    while url:
        info, resultados = traer_pagina(sesion, url, params=params)
        todos.extend(resultados)
        url = info.get("next")      # None en la última página → fin del bucle
        params = None               # los filtros solo van en la primera petición
        if url:
            time.sleep(pausa)       # cortesía: no martillear al servidor
    return todos
```

En el `main` guardamos el resultado en disco, que es oro para no volver a bajarlo:

```python
personajes = traer_todo(sesion, "/character")
Path("personajes.json").write_text(
    json.dumps(personajes, ensure_ascii=False, indent=2), encoding="utf-8")
```

### Paso 4 — Filtros con `params=`

La API acepta `name`, `status`, `species` y `gender`. Nada nuevo: `requests` te monta la URL.

```python
vivos = pedir(sesion, BASE + "/character", params={"status": "alive"})
# 404 si no hay ninguno → pedir() devuelve None → tratamos como lista vacía
```

> ⚠️ **Error típico de novato:** pegar la query a mano en la URL (`.../character?status=alive`) y luego añadir un segundo `params=`. `requests` **no fusiona** las dos cosas: si la URL ya lleva `?`, lo que pases en `params` se pierde.

### Paso 5 — De JSON a datos

Con la lista ya en memoria, los datos se procesan en local (sin más peticiones):

```python
from collections import Counter

estados  = Counter(p["status"] for p in personajes)
especies = Counter(p["species"] for p in personajes)
generos  = Counter(p["gender"] for p in personajes)

print("estados:", dict(estados))
print("especies top8:", especies.most_common(8))
print("géneros:", dict(generos))
```

Salida real con los 826 personajes:

```
estados: {'Alive': 439, 'unknown': 100, 'Dead': 287}
especies top8: [('Human', 366), ('Alien', 205), ('Humanoid', 68),
                ('Animal', 55), ('Robot', 51), ('Mythological Creature', 46),
                ('unknown', 13), ('Poopybutthole', 8)]
géneros: {'Male': 610, 'Female': 148, 'unknown': 49, 'Genderless': 19}
```

### Paso 6 — Un caso de verdad: el reparto de un episodio

Los recursos se enlazan entre sí: el episodio trae las URLs de sus personajes, y la API acepta **varias IDs en una sola petición** (lote):

```python
episodio = pedir(sesion, f"{BASE}/episode/1")
# episodio["characters"] = [".../character/1", ".../character/2", ...]

lote = ",".join(u.rsplit("/", 1)[-1] for u in episodio["characters"])
reparto = pedir(sesion, f"{BASE}/character/{lote}")   # → lista con 19 personajes
print(f"{episodio['name']} → {len(reparto)} personajes")
# Pilot → 19 personajes
```

Ese «de una URL salen URLs de otras» es exactamente cómo navegan los clientes REST de verdad: **sigues los enlaces, no inventas rutas**.

---

## 🖼️ PARTE 2 — Verlo con Pillow

[Pillow](https://python-pillow.org/) es la librería de imágenes de Python (la versión moderna de PIL). Solo necesitas dos ideas: **abrir** una imagen desde bytes y **componer** un lienzo.

### Paso 7 — Descargar un avatar

Los avatares son JPEGs de 300×300 que cuelgan de `personaje["image"]`. No hace falta guardarlos en disco: se abren directamente desde la memoria.

```python
from io import BytesIO
from PIL import Image

def descargar_avatar(sesion, url):
    resp = sesion.get(url, timeout=TIMEOUT)
    resp.raise_for_status()
    return Image.open(BytesIO(resp.content)).convert("RGB")
```

`BytesIO` convierte los bytes de la respuesta en algo con cara de fichero, para que `Image.open` lo entienda sin escribir nada en el disco.

### Paso 8 — Montar la rejilla

Un lienzo blanco, una foto por celda y el nombre debajo:

```python
from PIL import ImageDraw, ImageFont

def montar_rejilla(sesion, personajes, columnas=4, celda=300, ruta=None):
    filas = (len(personajes) + columnas - 1) // columnas
    lienzo = Image.new("RGB", (columnas * celda, filas * (celda + 34)), "#f8f9fa")
    dibujo = ImageDraw.Draw(lienzo)
    texto = fuente(15)
    for i, p in enumerate(personajes):
        foto = descargar_avatar(sesion, p["image"]).resize((celda, celda))
        x, y = (i % columnas) * celda, (i // columnas) * (celda + 34)
        lienzo.paste(foto, (x, y))
        dibujo.text((x + 6, y + celda + 8), p["name"], fill="#212529", font=texto)
    if ruta:
        lienzo.save(ruta)          # → rejilla-personajes.png
    return lienzo
```

Y una utilidad que encontrarás en cualquier programa con texto en español: **buscar una fuente con tildes**, porque la fuente por defecto de Pillow no las trae.

```python
def fuente(tam=16):
    for ruta in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                 "C:/Windows/Fonts/segoeui.ttf",
                 "/System/Library/Fonts/Supplemental/Arial.ttf"):
        try:
            return ImageFont.truetype(ruta, tam)
        except OSError:
            continue
    return ImageFont.load_default()
```

Resultado (los ocho primeros personajes):

![Rejilla con los avatares de los ocho primeros personajes de la API de Rick y Morty, cada uno con su nombre debajo](/ApuntesPSP/ejemplos/rick-morty/rejilla-personajes.png)

### Paso 9 — Mostrarla en pantalla

`lienzo.show()` abre la imagen con el visor del sistema (Fotos en Windows, Preview en Mac, eog en Linux…). Guardar y mostrar son cosas distintas: `save()` escribe el PNG, `show()` lo enseña.

```python
montar_rejilla(sesion, personajes[:8]).show()                          # solo enseñar
montar_rejilla(sesion, personajes[:8], ruta="rejilla-personajes.png")  # guardar el PNG
```

### Paso 10 — La ficha de un personaje

Componer es pegar: lienzo, marco de color, foto y cuatro líneas de texto.

```python
def ficha(sesion, personaje, ruta=None):
    foto = descargar_avatar(sesion, personaje["image"])     # 300x300
    lienzo = Image.new("RGB", (360, 470), "#ffffff")
    dibujo = ImageDraw.Draw(lienzo)
    lienzo.paste(Image.new("RGB", (360, 8), "#306998"), (0, 0))   # cabecera
    lienzo.paste(foto, (30, 30))
    dibujo.text((30, 348), personaje["name"], fill="#212529", font=fuente(22))
    dibujo.text((30, 386), f"{personaje['species']} · {personaje['status']}",
                fill="#495057", font=fuente(16))
    dibujo.text((30, 416), f"Origen: {personaje['origin']['name']}",
                fill="#868e96", font=fuente(14))
    dibujo.text((30, 442), f"Última aparición: {personaje['location']['name']}",
                fill="#868e96", font=fuente(14))
    if ruta:
        lienzo.save(ruta)                                 # → ficha-personaje.png
    return lienzo
```

![Ficha de Rick Sanchez generada con Pillow: avatar, nombre, especie, estado, origen y última aparición](/ApuntesPSP/ejemplos/rick-morty/ficha-personaje.png)

### Paso 11 — El programa completo

Todo junto, listo para guardarlo como `rickmorty.py` y ejecutar con `python3 rickmorty.py`:

```python
#!/usr/bin/env python3
"""rickmorty.py — cliente completo de la API de Rick y Morty (sin API key)."""
import json
import time
from collections import Counter
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image, ImageDraw, ImageFont

BASE = "https://rickandmortyapi.com/api"
TIMEOUT = 10
REINTENTOS = 5


def pedir(sesion, url, params=None):
    """GET con timeout. 404 = 'no hay nada aquí' → None; 429 → espera y reintenta."""
    for intento in range(REINTENTOS):
        resp = sesion.get(url, params=params, timeout=TIMEOUT)
        if resp.status_code == 404:
            return None
        if resp.status_code != 429:
            resp.raise_for_status()
            return resp.json()
        espera = min(2 ** intento, 30)
        print(f"  429 → espero {espera} s")
        time.sleep(espera)
    raise RuntimeError("La API sigue devolviendo 429 Too Many Requests")


def traer_pagina(sesion, url, params=None):
    """Devuelve (info, results). Sin resultados → ({}, [])."""
    datos = pedir(sesion, url, params)
    if datos is None:
        return {}, []
    return datos.get("info", {}), datos.get("results", [])


def traer_todo(sesion, recurso, params=None, pausa=1.0):
    """Pagina con info['next'] hasta quedarse sin páginas."""
    url = BASE + recurso
    todos = []
    while url:
        info, resultados = traer_pagina(sesion, url, params=params)
        todos.extend(resultados)
        url = info.get("next")
        params = None
        if url:
            time.sleep(pausa)
    return todos


def fuente(tam=16):
    """Fuente con tildes: DejaVu (Linux), Segoe (Windows) o Arial (Mac)."""
    for ruta in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                 "C:/Windows/Fonts/segoeui.ttf",
                 "/System/Library/Fonts/Supplemental/Arial.ttf"):
        try:
            return ImageFont.truetype(ruta, tam)
        except OSError:
            continue
    return ImageFont.load_default()


def descargar_avatar(sesion, url):
    resp = sesion.get(url, timeout=TIMEOUT)
    resp.raise_for_status()
    return Image.open(BytesIO(resp.content)).convert("RGB")


def montar_rejilla(sesion, personajes, columnas=4, celda=300, ruta=None):
    filas = (len(personajes) + columnas - 1) // columnas
    lienzo = Image.new("RGB", (columnas * celda, filas * (celda + 34)), "#f8f9fa")
    dibujo = ImageDraw.Draw(lienzo)
    texto = fuente(15)
    for i, p in enumerate(personajes):
        foto = descargar_avatar(sesion, p["image"]).resize((celda, celda))
        x, y = (i % columnas) * celda, (i // columnas) * (celda + 34)
        lienzo.paste(foto, (x, y))
        dibujo.text((x + 6, y + celda + 8), p["name"], fill="#212529", font=texto)
    if ruta:
        lienzo.save(ruta)
    return lienzo


def ficha(sesion, personaje, ruta=None):
    foto = descargar_avatar(sesion, personaje["image"])
    lienzo = Image.new("RGB", (360, 470), "#ffffff")
    dibujo = ImageDraw.Draw(lienzo)
    lienzo.paste(Image.new("RGB", (360, 8), "#306998"), (0, 0))
    lienzo.paste(foto, (30, 30))
    dibujo.text((30, 348), personaje["name"], fill="#212529", font=fuente(22))
    dibujo.text((30, 386), f"{personaje['species']} · {personaje['status']}",
                fill="#495057", font=fuente(16))
    dibujo.text((30, 416), f"Origen: {personaje['origin']['name']}",
                fill="#868e96", font=fuente(14))
    dibujo.text((30, 442), f"Última aparición: {personaje['location']['name']}",
                fill="#868e96", font=fuente(14))
    if ruta:
        lienzo.save(ruta)
    return lienzo


def main():
    sesion = requests.Session()
    sesion.headers.update({"User-Agent": "ApuntesPSP-ejemplo/1.0"})

    personajes = traer_todo(sesion, "/character")
    print(f"personajes descargados: {len(personajes)}")
    Path("personajes.json").write_text(
        json.dumps(personajes, ensure_ascii=False, indent=2), encoding="utf-8")

    print("estados:", dict(Counter(p["status"] for p in personajes)))
    print("especies top8:", Counter(p["species"] for p in personajes).most_common(8))
    print("géneros:", dict(Counter(p["gender"] for p in personajes)))

    montar_rejilla(sesion, personajes[:8], ruta="rejilla-personajes.png")
    print("PNG guardado: rejilla-personajes.png")

    rick = pedir(sesion, f"{BASE}/character/1")
    ficha(sesion, rick, ruta="ficha-personaje.png")
    print("PNG guardado: ficha-personaje.png")

    episodio = pedir(sesion, f"{BASE}/episode/1")
    lote = ",".join(u.rsplit("/", 1)[-1] for u in episodio["characters"])
    reparto = pedir(sesion, f"{BASE}/character/{lote}")
    print(f"episodio: {episodio['name']} → {len(reparto)} personajes")


if __name__ == "__main__":
    main()
```

Traza de salida (con suerte solo verás una línea de 429 al principio):

```
$ python3 rickmorty.py
  429 → espero 1 s
personajes descargados: 826
estados: {'Alive': 439, 'unknown': 100, 'Dead': 287}
especies top8: [('Human', 366), ('Alien', 205), ('Humanoid', 68), ...]
géneros: {'Male': 610, 'Female': 148, 'unknown': 49, 'Genderless': 19}
PNG guardado: rejilla-personajes.png
PNG guardado: ficha-personaje.png
episodio: Pilot → 19 personajes
```

> 🧠 **Lo que has hecho aquí, en corto:** paginación con `info.next`, un 404 que no es un error, un 429 con backoff, filtros con `params=`, enlaces entre recursos, JSON a datos con `Counter` y un montaje de imágenes con Pillow. Es, literalmente, el mismo esqueleto que cualquier cliente REST profesional.

---

## 🧠 Mini-chequeo

1. ¿Por qué `pedir()` devuelve `None` cuando la API responde 404, en lugar de lanzar una excepción?
2. ¿Qué papel juega `info["next"]` en `traer_todo()` y por qué se pone `params = None` dentro del bucle?
3. ¿Para qué sirve `BytesIO` en `descargar_avatar()`?

<details>
<summary>🔄 Respuestas</summary>

1. Porque en esta API el 404 significa «ese filtro no da resultados» (p. ej. `?name=zzz`), no un fallo del programa. `None` lo convierte en una lista vacía y el flujo sigue sin `try/except`.
2. Es la URL de la página siguiente; cuando es `None`, el bucle termina. `params = None` evita reenviar los filtros en las páginas siguientes, porque `info["next"]` ya los trae montados en la URL.
3. Convierte los bytes de la respuesta en un objeto fichero en memoria, para que `Image.open()` abra la foto **sin escribirla antes en disco**.
</details>

---

## ✅ Resumen en 3 frases

- Un cliente REST completo se monta con cuatro piezas: `pedir()` con timeout y `raise_for_status()`, paginación por `info["next"]`, filtros con `params=` y errores tratados según su significado (404 vacío, 429 con espera).
- Los datos se procesan en local con `Counter` y se guardan en JSON para no volver a martillear a la API.
- Pillow permite **ver** el resultado: `Image.open(BytesIO(...))`, un lienzo con `paste()` y `text()`, y `save()`/`show()` para guardar o enseñar.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| API sin clave | API pública gratuita: no hay `.env` ni cuota |
| Paginar | Recorrer páginas con `info["next"]` hasta el final |
| Lote | Varias IDs en una petición (`/character/1,2,3`) |
| Avatar | Miniatura JPEG de 300×300 de un personaje |
| Pillow | Librería de imágenes de Python (versión moderna de PIL) |
| `BytesIO` | Fichero en memoria a partir de bytes |
| `Counter` | Conta apariciones de cada valor en una lista |
| Rejilla | Composición de varias imágenes en un lienzo |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Anterior:** [08 · Práctica: APIs comerciales](/ApuntesPSP/07-apis-comerciales/08-practica-apis-comerciales) · **Siguiente:** [10 · Cierre](/ApuntesPSP/07-apis-comerciales/10-cierre)
