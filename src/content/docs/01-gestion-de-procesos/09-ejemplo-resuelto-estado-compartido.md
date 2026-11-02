---
title: "09 — Ejemplo resuelto: estado compartido con procesos"
description: Un almacén en memoria que cuatro procesos actualizan a la vez, sin perder una sola escritura 🧾
---

<p><small>Un almacén en memoria que cuatro procesos actualizan a la vez, sin perder una sola escritura 🧾</small></p>

> 🗺️ **Estás en:** 🚀 **UD 2 · Gestión de procesos** → 09 · Ejemplo resuelto: estado compartido con procesos

---

## 📬 La idea en una frase

> Este punto es un ejemplo resuelto y explicado paso a paso: montas un **almacén de datos en memoria** (`manager.dict()`) al que cuatro **procesos** (`multiprocessing.Process`) escriben a la vez, protegido por un **candado de procesos** (`multiprocessing.Lock`), y al terminar guardas el estado a un fichero JSON para que **sobreviva al cierre del programa**.

Es la pieza que une todo lo que has visto en la [unidad](/ApuntesPSP/01-gestion-de-procesos): `Process` para paralelizar, `Manager` para cruzar la burbuja de memoria y `Lock` para que no se pisen. Si tienes claro este ejemplo, tienes la base sobre la que se construye cualquier servidor concurrente con procesos (y lo verás enchufado a un servidor real en la [UD 6](/ApuntesPSP/05-servidores-concurrentes/09-servidor-concurrente-completo-con-procesos)).

---

## 🎯 El problema

Imagina un almacén de pedidos de una tienda:

- Llegan pedidos por cuatro canales a la vez (cuatro procesos trabajadores).
- Cada trabajador **suma** unidades en un diccionario compartido: `{"manzanas": 12, "peras": 5, …}`.
- Al final del turno, el dueño quiere ver el recuento total **y guardarlos** para retomarlos mañana.

Si cada trabajador tuviera su propio diccionario (como pasaba en la trampa del [punto 8](/ApuntesPSP/01-gestion-de-procesos/08-multiprocessing)), cada uno vería solo sus propios pedidos y el total sería una ficción. Hace falta memoria compartida… entre burbujas.

---

## 🧱 Paso 1: la estructura base del programa

El programa tiene tres piezas, y se escribe en este orden:

1. **El trabajador**: la función que lanzará cada proceso hijo. Recibe tres cosas: el almacén compartido, el candado y su lista de pedidos.
2. **El guardado y la carga**: dos utilidades que vuelcan el almacén a JSON y lo recuperan (persistencia).
3. **El main**: crea el `Manager`, el `Lock`, lanza los procesos, espera con `join()` y guarda el resultado.

> 💡 **Convención de este curso:** las utilidades y el trabajador van arriba del todo; el punto de entrada `if __name__ == '__main__':` va el último. Así el script se puede importar desde otro sin que se lanzen procesos por accidente.

---

## 👷 Paso 2: el trabajador

```python
import json
import multiprocessing
import random
import time

def trabajador(almacen, candado, pedidos):
    """Proceso hijo: registra sus pedidos en el almacén compartido."""
    for fruta, unidades in pedidos:
        time.sleep(random.uniform(0.01, 0.05))  # Simula el trabajo real
        # Sección crítica: leer, calcular y escribir DE UNA VEZ
        with candado:
            total = almacen.get(fruta, 0)
            almacen[fruta] = total + unidades
        print(f"  [{multiprocessing.current_process().name}] "
              f"+{unidades} {fruta} (total parcial: {almacen.get(fruta)})")
```

Fíjate en los tres detalles clave:

- **`with candado:`** protege la lectura (`almacen.get`) y la escritura (`almacen[fruta] = …`) **juntas**. Si leyeras fuera del candado, dos procesos leerían el mismo valor previo y el último machacaría al primero: condición de carrera.
- **`multiprocessing.current_process().name`** te dice qué proceso habla ("Process-1", "Process-2"…). Es la forma de trazar la salida, igual que nombrabas los hilos con `.name` en otros ejemplos.
- El trabajador **no sabe** que hay otros procesos. Solo sabe que su almacén responde a `get` y a `asignación`.

---

## 💾 Paso 3: persistencia (guardar y cargar el almacén)

El almacén del `Manager` vive en memoria: si apagas el programa, desaparece. Para que el estado sobreviva, lo volvamos a un fichero JSON al terminar y lo recargamos al arrancar:

```python
def guardar_almacen(almacen, fichero="almacen.json"):
    # dict(almacen) convierte el proxy en un dict normal de Python,
    # que sí se puede serializar con json.dump
    with open(fichero, "w", encoding="utf-8") as f:
        json.dump(dict(almacen), f, ensure_ascii=False, indent=2)
    print(f"💾 Almacén guardado en {fichero}")

def cargar_almacen(fichero="almacen.json"):
    try:
        with open(fichero, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
```

> ⚠️ **Trampa clásica:** `json.dump(almacen)` falla directamente porque un `proxy` de `Manager` **no es un dict**. Necesitas convertirlo primero con `dict(almacen)`, que hace una "foto" del estado actual y devuelve un dict normal y corriente.

---

## 🚀 Paso 4: el main que lo pone todo en marcha

```python
if __name__ == '__main__':
    # 1) Recuperamos el turno anterior (si existe)
    cargado = cargar_almacen()
    print(f"📥 Estado previo: {cargado}")

    # 2) Crear el gestor de memoria compartida y el candado
    with multiprocessing.Manager() as manager:
        almacen = manager.dict(cargado)  # Arranca desde el estado cargado
        candado = multiprocessing.Lock()

        # 3) Repartir el trabajo entre 4 procesos
        reparto = [
            [("manzanas", 3), ("uvas", 2)],
            [("peras", 5)],
            [("manzanas", 1), ("naranjas", 4)],
            [("uvas", 1), ("peras", 2), ("naranjas", 2)],
        ]

        procesos = []
        for i, pedidos in enumerate(reparto, start=1):
            p = multiprocessing.Process(
                target=trabajador,
                args=(almacen, candado, pedidos),
                name=f"trabajador-{i}",
            )
            procesos.append(p)
            p.start()

        # 4) Esperar a que TODOS terminen (imprescindible antes de leer)
        for p in procesos:
            p.join()

        # 5) Ver el resultado final y guardarlo
        print(f"\n🏁 Total del turno: {dict(almacen)}")
        guardar_almacen(almacen)
```

---

## 🔍 Traza paso a paso

```
1. cargar_almacen("almacen.json")
   → No existe el fichero → devuelve {} → "Estado previo: {}"

2. multiprocessing.Manager() → proceso servidor del Manager en marcha
   manager.dict({}) → proxy listo
   multiprocessing.Lock() → candado libre

3. Cuatro Process(target=trabajador, args=(almacen, candado, pedidos))
   start() × 4 → el SO clona la memoria 4 veces (4 burbujas)
   → CADA burbuja ve una COPIA de "almacen"... pero al ser un proxy,
     cada get/set se convierte en un mensaje al proceso del Manager

4. Los trabajadores hacen lectura → suma → escritura DENTRO de "with candado:"
   → Solo UN proceso a la vez en la sección crítica
   → El Manager aplica cada escritura sobre SU copia maestra

5. join() × 4 → el padre espera a que los 4 hijos finalicen
   → El Manager sigue vivo (está dentro del "with") → el proxy responde

6. dict(almacen) → foto del estado → json.dump → almacen.json en disco
   → Salida del bloque "with" → el proceso del Manager termina
```

**Salida típica:**

```
📥 Estado previo: {}
  [trabajador-1] +3 manzanas (total parcial: 3)
  [trabajador-3] +1 manzanas (total parcial: 4)
  [trabajador-2] +5 peras (total parcial: 5)
  [trabajador-4] +1 uvas (total parcial: 3)
  ...
🏁 Total del turno: {'manzanas': 4, 'uvas': 3, 'peras': 7, 'naranjas': 6}
💾 Almacén guardado en almacen.json
```

El orden en el que aparecen los mensajes **varía en cada ejecución** (el planificador reparte la CPU a su aire), pero el total final **siempre es el mismo**: esa es la garantía que da el candado.

---

## 🧨 Paso 5: quita el candado y mira la catástrofe

Comenta las dos líneas del `with candado:` (deja la indentación, solo quita el contexto) y vuelve a ejecutar. Verás totales distintos en cada corrida (por ejemplo, `manzanas: 2` en vez de 4), porque dos procesos leen el mismo valor previo y el segundo machaca el incremento del primero. Ejecuta tres o cuatro veces: **nunca** sabrás qué escritura se pierde.

Es la misma condición de carrera que viste con hilos, con el mismo nombre y el mismo arreglo, solo que aquí el choque ocurre entre burbujas de memoria en lugar de entre hilos.

---

## 🧠 Mini-chequeo

1. ¿Por qué el trabajador recibe `almacen` y `candado` por argumentos en vez de usar variables globales?
2. ¿Qué pasa si haces `json.dump(almacen)` sin convertirlo antes con `dict(...)`?
3. ¿Por qué el `join()` de todos los procesos va antes de leer el almacén final?
4. Si ejecutas el programa dos días seguidos, ¿por qué el segundo día arranca con datos del primero?

<details>
<summary>🔄 Respuestas</summary>

1. Porque los procesos no comparten memoria: una variable global se clona en cada burbuja y el hijo modificaría su propia copia. Los objetos que creas dentro del `with multiprocessing.Manager()` son **proxies**: se los pasas como argumentos y cada acceso viaja por mensaje hasta el proceso del Manager.
2. Falla con un `TypeError`: el proxy del Manager no es un dict de verdad, no soporta serialización directa. Hay que hacer la foto con `dict(almacen)` antes.
3. Porque hasta que todos los hijos terminan, puede quedar alguna escritura en vuelo. Leer el almacén antes del último `join()` es otra condición de carrera, esta vez del proceso padre.
4. Porque al arrancar llama a `cargar_almacen()`, lee `almacen.json` y usa ese estado como punto de partida del `manager.dict(cargado)`.

</details>

---

## ✅ Resumen en 3 frases

- `manager.dict()` es la memoria compartida entre procesos: se lo pasas a cada hijo como argumento y todos hablan con el mismo almacén a través del proceso servidor del Manager.
- `multiprocessing.Lock` protege la sección crítica (leer-modificar-escribir) y garantiza que ningún incremento se pierda aunque los procesos corran a la vez.
- La persistencia se resuelve convirtiendo el proxy a dict normal (`dict(almacen)`) y volcándolo a JSON; al arrancar, el mismo JSON alimenta al `manager.dict()` como estado inicial.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| `manager.dict()` | Diccionario proxy compartido entre procesos (memoria compartida) |
| Sección crítica | Trozo de código que solo puede ejecutar un proceso a la vez |
| `with candado:` | Bloque protegido: acquire automático al entrar, release al salir |
| `dict(proxy)` | "Foto" del proxy como dict normal, usable con `json.dump` |
| Persistencia | Que los datos sobreviven al cierre del programa (fichero JSON aquí) |
| `current_process().name` | Nombre del proceso en ejecución, para trazar la salida |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-gestion-de-procesos) · **Anterior:** [08 · Procesos nativos con multiprocessing](/ApuntesPSP/01-gestion-de-procesos/08-multiprocessing) · **Siguiente:** [10 · Procesos en la práctica](/ApuntesPSP/01-gestion-de-procesos/10-procesos-en-la-practica)
