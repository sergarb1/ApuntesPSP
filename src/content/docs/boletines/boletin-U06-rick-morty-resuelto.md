---
title: Boletín UD 7 — Modifica el ejemplo (Rick y Morty) (Resuelto)
description: Soluciones de los 10 retos sobre el cliente de Rick y Morty
---

# ✅ Boletín UD 7 — Modifica el ejemplo (Rick y Morty) (Resuelto)

> Soluciones de los 10 retos. Cada una indica **dónde tocar** en `rickmorty.py` (punto 09) y el código clave. Ejecuta el programa tras cada cambio para comprobarlo.

---

## 1. Rejilla más grande

En `main()`, paso 4:

```python
montar_rejilla(sesion, personajes[:12], columnas=3, ruta="rejilla-personajes.png")
```

**12 personajes y 3 columnas** → `filas = (12 + 3 - 1) // 3 = 4`. El lienzo crece solo: `montar_rejilla` calcula el tamaño a partir de `columnas` y `filas`.

## 2. Filtro por estado

En `main()`, antes de la paso 1:

```python
estado = input("¿Estado (alive/dead/unknown)? ").strip() or "alive"
personajes = traer_todo(sesion, "/character", params={"status": estado})
```

Los `params` solo viajan en la **primera** petición: `info["next"]` ya devuelve las siguientes URLs con el filtro montado (por eso `traer_todo` pone `params = None` tras el primer bucle).

## 3. Colores por estado

Arriba de todo, con las constantes:

```python
COLORES = {"Alive": "#2f9e44", "Dead": "#e03131", "unknown": "#868e96"}
```

Dentro del bucle de `montar_rejilla`, justo antes de escribir el nombre:

```python
color = COLORES.get(p["status"], "#868e96")
dibujo.rectangle([x, y + celda, x + celda, y + celda + 34], fill=color)
```

El `.get(..., gris)` cubre estados inesperados: **un dict con valor por defecto nunca revienta**.

## 4. Ficha interactiva

En `main()`, paso 5:

```python
id_ficha = input("¿Id del personaje (1-826)? ").strip()
rick = pedir(sesion, f"{BASE}/character/{id_ficha}")
if rick is None:
    print("Ese personaje no existe")
else:
    ficha(sesion, rick, ruta="ficha-personaje.png")
```

`pedir()` devuelve **`None`** ante un 404: sin esa comprobación, `ficha()` recibiría `None` y moriría con `TypeError`. Un fallo de usuario no debe tumbar el programa.

## 5. Búsqueda por nombre

```python
nombre = input("¿Nombre del personaje? ").strip()
datos = pedir(sesion, BASE + "/character", params={"name": nombre})
if datos is None:
    print("No hay ningún personaje con ese nombre")
else:
    p = datos["results"][0]
    print(f"{p['name']} · {p['species']} · {p['status']}")
```

Ojo: con `?name=` la API devuelve un **objeto** (`info` + `results`), no una lista plana: por eso se coge `["results"][0]`.

## 6. Exportar a CSV

```python
import csv

with open("personajes.csv", "w", newline="", encoding="utf-8") as fichero:
    escritor = csv.writer(fichero)
    escritor.writerow(["id", "nombre", "estado", "especie"])   # cabecera
    for p in personajes:
        escritor.writerow([p["id"], p["name"], p["status"], p["species"]])
```

**`newline=""`** es obligatorio en Windows: sin él cada fila sale con un salto de línea extra. JSON para datos anidados, **CSV** para tablas planas como esta.

## 7. Caché de avatares

En `descargar_avatar()`:

```python
carpeta = Path("avatares")
carpeta.mkdir(exist_ok=True)
destino = carpeta / f"{url.rsplit('/', 1)[-1]}.jpg"   # 1.jpg, 2.jpg...

if destino.exists():
    return Image.open(destino).convert("RGB")          # cache hit: sin red

resp = sesion.get(url, timeout=TIMEOUT)
resp.raise_for_status()
imagen = Image.open(BytesIO(resp.content)).convert("RGB")
imagen.save(destino)
return imagen
```

Segunda ejecución: **cero peticiones de imagen** y arranca al instante. `mkdir(exist_ok=True)` no pite si la carpeta ya está.

## 8. Estadísticas extra

Tras la paso 3 de `main()`:

```python
vivos = sum(1 for p in personajes if p["status"] == "Alive")
print(f"vivos: {vivos}/{len(personajes)} = {100 * vivos / len(personajes):.1f}%")

por_especie = Counter(p["species"] for p in personajes)
print("especie menos común:", por_especie.most_common()[-1])
```

`most_common()` ordena de mayor a menor: el **último** elemento es la especie menos frecuente (aquí, `Poopybutthole` con un solo representante… o `unknown`, según el filtro).

## 9. Reintentos en las imágenes

```python
def descargar_avatar(sesion, url, intentos=3):
    for intento in range(intentos):
        resp = sesion.get(url, timeout=TIMEOUT)
        if resp.status_code == 200:
            return Image.open(BytesIO(resp.content)).convert("RGB")
        time.sleep(1)          # espera antes de reintentar
    resp.raise_for_status()    # al agotar: lanza el error de verdad
```

Mismo patrón que `pedir()`: **intentos limitados + espera + fallo explícito**. Un `while True` de reintentos jamás: si la API cae, tu programa se queda colgado para siempre.

## 10. Galería HTML

```python
Path("galeria").mkdir(exist_ok=True)
piezas = []
for p in personajes[:12]:
    img = descargar_avatar(sesion, p["image"])
    img.save(f"galeria/{p['id']}.jpg")
    piezas.append(
        f'<figure><a href="https://rickandmortyapi.com/api/character/{p["id"]}">'
        f'<img src="galeria/{p["id"]}.jpg"></a><figcaption>{p["name"]}</figcaption></figure>'
    )

html = "<!doctype html><meta charset='utf-8'><title>Galería</title>" \
       "<style>body{font-family:sans-serif}figure{display:inline-block;margin:8px;text-align:center}" \
       "img{width:160px;height:160px;object-fit:cover}</style>" + "".join(piezas)
Path("galeria.html").write_text(html, encoding="utf-8")
```

Cada `<figure>` es una celda: **imagen + nombre + enlace** a la ficha del personaje en la API. Ábrelo con `python3 -m http.server` para verlo con los enlaces funcionando.
