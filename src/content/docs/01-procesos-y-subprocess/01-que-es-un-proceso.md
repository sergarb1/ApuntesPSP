---
title: 01 — Qué es un proceso
description: La burbuja de memoria que vive en tu sistema 🫧
---

<p><small>La burbuja de memoria que vive en tu sistema 🫧</small></p>

> 🗺️ **Estás en:** 🚀 **U01 · Procesos y Subprocess** → 01 · Qué es un proceso

---

## 📬 La idea en una frase

> Un **proceso** es un programa en ejecución con su propio espacio de memoria, recursos (archivos abiertos, sockets) y un identificador único llamado **PID**.

Un programa en el disco duro es un **muerto viviente**: no hace nada. Un proceso es ese mismo programa **vivo**, ocupando memoria, consumiendo CPU y respondiendo al teclado, a la red o al ratón. La diferencia no está en el código: está en que el sistema operativo lo ha cargado en memoria y lo está ejecutando.

```python
import os
print(f"Este proceso se llama PID {os.getpid()}")
```

Cada vez que ejecutas ese programa, el sistema operativo crea un proceso nuevo con su propio PID.

---

## 🫧 La burbuja de memoria

Cada proceso vive en su propia **burbuja de memoria**: un espacio de direcciones aislado del resto del sistema. Dentro de esa burbuja viajan:

```
┌─────────────────────────────────────────┐
│            BURBUJA DE MEMORIA           │
│                                         │
│  ┌────────────┐   ┌──────────────────┐  │
│  │ CÓDIGO     │   │ ESTADO           │  │
│  │ (las       │   │ (los valores de  │  │
│  │  funciones)│   │  las variables)  │  │
│  └────────────┘   └──────────────────┘  │
│  ┌────────────┐   ┌──────────────────┐  │
│  │ CONTADOR   │   │ PID              │  │
│  │ (próxima   │   │ (identificador   │  │
│  │  instrucción)  │  único)          │  │
│  └────────────┘   └──────────────────┘  │
└─────────────────────────────────────────┘
```

- **Código**: las instrucciones del programa.
- **Estado**: los valores actuales de las variables.
- **Contador de programa**: qué instrucción toca ejecutar ahora.
- **PID**: el carnet de identidad del proceso.

> "Si un proceso se cuelga, los demás no se enteran. Cada uno vive en su burbuja de memoria."

---

## 🪪 El PID, el carnet de identidad

Cada proceso tiene un **PID** (*Process IDentifier*): un número único que asigna el sistema operativo en el momento de crearlo. Sirve para referirse a él, para matarlo, para vigilarlo.

```python
import os

print(f"Mi PID es {os.getpid()}")
```

Para ver los procesos de tu sistema con sus PIDs:

- **Windows**: Administrador de tareas → pestaña "Detalles", o `tasklist` en la terminal.
- **Linux / macOS**: `ps aux` o `top`.

---

## 📋 Características de un proceso

| Propiedad | Descripción |
|-----------|-------------|
| **PID** | Identificador único numérico |
| **Memoria propia** | Cada proceso tiene su espacio de direcciones aislado |
| **Recursos** | Archivos, sockets, manejadores |
| **Contexto** | Estado de la CPU, registros, contador de programa |
| **Comunicación** | Necesita mecanismos externos (pipes, sockets, archivos) |

La última fila es la clave: los procesos **no comparten memoria por defecto**. Si quieren intercambiar datos necesitan un mecanismo externo: un archivo, un socket o un pipe. Lo verás en el [punto 6](/ApuntesPSP/01-procesos-y-subprocess/06-comunicacion-con-procesos).

---

## 🍳 La analogía de la cocina

Un proceso es una **receta en marcha** en una cocina. La receta escrita en el libro es el **programa** (código muerto en el disco). Cuando un cocinero la coge, pone los ingredientes sobre su mesa (memoria), empieza a leerla por el paso 1 (contador de programa) y recibe su propio número de pedido (PID).

Cada cocinero con su receta y su mesa: si uno se quema, los demás siguen cocinando sin enterarse. Eso es el **aislamiento** de la burbuja de memoria. En el [punto 3](/ApuntesPSP/01-procesos-y-subprocess/03-paralela-vs-distribuida) verás qué pasa cuando hay varias cocinas (varias CPUs) o varios restaurantes (varias máquinas).

---

## 🧠 Mini-chequeo

1. ¿Qué es el PID y para qué sirve?
2. ¿Qué contiene la burbuja de memoria de un proceso?
3. ¿Por qué dos procesos no pueden compartir una variable directamente?

<details>
<summary>🔄 Respuestas</summary>

1. Es el **identificador único numérico** que el sistema operativo asigna a cada proceso para referirse a él.
2. El **código**, el **estado** de las variables, el **contador de programa** y el **PID**.
3. Porque cada uno vive en su **burbuja de memoria aislada**; para intercambiar datos necesitan mecanismos externos (pipes, sockets, archivos).

</details>

---

## ✅ Resumen en 3 frases

- Un proceso es un programa **en ejecución** con memoria, recursos y un PID propio.
- Su burbuja de memoria contiene código, estado, contador de programa y PID, aislada del resto.
- Los procesos no comparten memoria: se comunican con mecanismos externos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Proceso | Programa en ejecución con memoria y recursos propios |
| PID | Identificador único del proceso |
| Burbuja de memoria | Espacio de direcciones aislado de cada proceso |
| Contador de programa | Qué instrucción toca ejecutar ahora |
| Contexto | Estado de la CPU, registros y contador del proceso |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/01-procesos-y-subprocess) · **Siguiente:** [02 · Estados de un proceso](/ApuntesPSP/01-procesos-y-subprocess/02-estados-de-un-proceso)