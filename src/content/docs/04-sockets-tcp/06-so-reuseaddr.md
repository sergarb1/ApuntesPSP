---
title: 06 — SO_REUSEADDR
description: "Adiós al 'Address already in use' 🔁"
---

<p><small>Adiós al 'Address already in use' 🔁</small></p>

> 🗺️ **Estás en:** 🔌 **U04 · Sockets TCP** → 06 · SO_REUSEADDR

---

## 📬 La idea en una frase

> Si matas un servidor y lo reinicias rápido, el SO puede decir que la dirección **ya está en uso**. Una sola línea —`setsockopt(SO_REUSEADDR, 1)`— evita el error y te ahorra minutos de depuración.

El culpable se llama **TIME_WAIT** (lo viste al hablar del cierre en el [punto 4](/ApuntesPSP/04-sockets-tcp/04-ciclo-de-vida-de-la-conexion)): al cerrar, la conexión no se libera al instante. `SO_REUSEADDR` le dice al SO que puedes reutilizar ese puerto. Ponlo siempre en tus servidores.

---

## 😠 El problema: "Address already in use"

```python
# 1ª ejecución del servidor: todo bien
srv.bind(("127.0.0.1", 5000))     # ✅ OK

# Matas el servidor con Ctrl+C y lo relanzas al instante...
srv.bind(("127.0.0.1", 5000))     # 💥 OSError: [Errno 98] Address already in use
```

¿Por qué? Tras el cierre, la conexión entra en estado **TIME_WAIT** unos segundos: el SO mantiene reservado el par (IP, puerto) para asegurarse de que los últimos mensajes de la despedida (los FIN/ACK del [punto 4](/ApuntesPSP/04-sockets-tcp/04-ciclo-de-vida-de-la-conexion)) no queden huérfanos. Mientras tanto, nadie más puede hacer `bind()` a ese puerto.

---

## 🔧 La solución: `SO_REUSEADDR`

```python
import socket

servidor = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
servidor.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
servidor.bind(("127.0.0.1", 5000))
servidor.listen()
```

Una sola línea lo arregla todo:

| Pieza | Significado |
|-------|-------------|
| `SOL_SOCKET` | "Nivel de opciones" del propio socket |
| `SO_REUSEADDR` | La opción que permite reutilizar la dirección |
| `1` | Activa la opción (0 la desactivaría) |

Con ella, el SO te deja hacer `bind()` al puerto aunque queden conexiones en `TIME_WAIT`. El servidor se puede **matar y reiniciar** sin esperar.

> **Pon esto siempre** en tus servidores. Te ahorrarás minutos de depuración.

---

## 🧠 ¿Por qué existe TIME_WAIT en primer lugar?

No es un capricho: la despedida TCP necesita tiempo para garantizar que los mensajes de cierre no lleguen tarde y revuelvan conexiones nuevas. Es **protección**, no burocracia. El problema es que, para un programador que reinicia su servidor mil veces al día, esa protección se convierte en un estorbo… hasta que aparece `SO_REUSEADDR`.

---

## 🧠 Mini-chequeo

1. ¿Qué error lanza el SO al relanzar un servidor sin `SO_REUSEADDR`?
2. ¿Qué tres piezas componen la llamada `setsockopt()` y qué significan?
3. ¿Por qué existe el estado TIME_WAIT?

<details>
<summary>🔄 Respuestas</summary>

1. **`OSError: [Errno 98] Address already in use`**: el puerto sigue reservado por conexiones en TIME_WAIT.
2. **`SOL_SOCKET`** (nivel del socket), **`SO_REUSEADDR`** (la opción de reutilizar dirección) y **`1`** (activarla).
3. Para que los últimos mensajes de la despedida (FIN/ACK) no queden huérfanos ni revuelvan conexiones nuevas: es una **protección** del protocolo.

</details>

---

## ✅ Resumen en 3 frases

- Tras cerrar un servidor, el SO mantiene el puerto en **TIME_WAIT** y rechaza un nuevo `bind()` con "Address already in use".
- **`setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)`** permite reutilizar la dirección y relanzar el servidor al instante.
- Es la primera línea que todo servidor TCP debería tener.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Address already in use | Error al hacer bind() a un puerto aún reservado |
| TIME_WAIT | Estado del SO que mantiene el puerto reservado unos segundos |
| SOL_SOCKET | Nivel de opciones del socket |
| SO_REUSEADDR | Permite reutilizar la dirección y el puerto |
| setsockopt() | Método para configurar opciones del socket |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/04-sockets-tcp) · **Anterior:** [05 · Errores y gestión](/ApuntesPSP/04-sockets-tcp/05-errores-y-manejo) · **Siguiente:** [07 · Protocolos sobre TCP](/ApuntesPSP/04-sockets-tcp/07-protocolos-sobre-tcp)