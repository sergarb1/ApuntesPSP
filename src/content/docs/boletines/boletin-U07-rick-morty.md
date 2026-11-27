---
title: Boletín UD 8 — Modifica el ejemplo (Rick y Morty)
description: 10 retos para modificar el cliente de Rick y Morty del punto 09
---

# 📝 Boletín UD 8 — Modifica el ejemplo (Rick y Morty)

> Diez retos para **modificar el programa** del [punto 09 · Ejemplo completo: Rick y Morty (API gratuita sin registro)](/ApuntesPSP/07-apis-comerciales/09-ejemplo-completo-rick-y-morty). Copia `rickmorty.py`, aplica cada cambio por separado y comprueba el resultado ejecutándolo. La API es gratuita y no necesita registro: solo `requests` y `Pillow`.

---

## 1. Rejilla más grande

Cambia el programa para que la rejilla tenga **12 personajes en 3 columnas** en lugar de 8 en 4.

**Pista:** son los parámetros de `montar_rejilla(sesion, personajes[:12], columnas=3, ruta=...)`.

## 2. Filtro por estado

Pide el estado por teclado (`alive`, `dead` o `unknown`) y genera la rejilla **solo con esos personajes**.

**Pista:** `traer_todo()` acepta `params=`; en el primer bucle de páginas viajan en `info["next"]`.

## 3. Colores por estado

Que la banda de color del nombre cambie según el estado: **verde** para `Alive`, **rojo** para `Dead` y **gris** para `unknown`.

**Pista:** dibuja un `ImageDraw.rectangle()` antes del texto y usa un `dict` de colores: `COLORES = {"Alive": "#2f9e44", ...}`.

## 4. Ficha interactiva

En vez de la ficha fija de Rick, pide un **id por teclado** y muestra la ficha de ese personaje. Si el id no existe, imprime «ese personaje no existe» sin que el programa se caiga.

**Pista:** `pedir()` devuelve `None` cuando la API responde 404: compruébalo antes de llamar a `ficha()`.

## 5. Búsqueda por nombre

Pide un nombre por teclado y busca con el filtro `?name=` de la API. Muestra el nombre, la especie y el estado del primer resultado; si no hay ninguno, avisa.

**Pista:** `pedir(sesion, BASE + "/character", params={"name": nombre})` → 404 → `None`.

## 6. Exportar a CSV

Guarda un fichero `personajes.csv` con las columnas `id,nombre,estado,especie` de los 826 personajes.

**Pista:** el módulo `csv` de la biblioteca estándar; `csv.writer(f)` con `newline=""` al abrir el fichero.

## 7. Caché de avatares

Antes de descargar una imagen, comprueba si ya existe en la carpeta `avatares/`. Si existe, ábrela de disco; si no, descárgala y guárdala ahí. La segunda ejecución no debe volver a tocar la red para las imágenes.

**Pista:** `Path("avatares").mkdir(exist_ok=True)` + `Path(f"avatares/{p['id']}.jpg").exists()`.

## 8. Estadísticas extra

Añade al programa: el **porcentaje de personajes vivos** y la **especie menos común** de toda la API.

**Pista:** con `Counter`, `most_common()` va de mayor a menor: el último elemento de la lista es el menos común.

## 9. Reintentos en las imágenes

Aplica a `descargar_avatar()` el mismo patrón de reintentos que usa `pedir()`: hasta 3 intentos con espera antes de rendirse.

**Pista:** un bucle `for intento in range(3):` con `time.sleep(1)` y `continue` si `resp.status_code != 200`.

## 10. Galería HTML

Genera un fichero `galeria.html` con una cuadrícula de imágenes: el avatar y el nombre de los 12 primeros personajes, cada uno enlazando a su ficha en la web de la API.

**Pista:** monta el HTML con un `f"""..."""` en Python y copia los PNG a una carpeta `galeria/` para que los enlaces funcionen.
