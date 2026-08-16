---
title: 04 — Datagramas y pérdida
description: "Paquetes perdidos, duplicados y sin orden: la vida real de UDP 💨"
---

<p><small>Paquetes perdidos, duplicados y sin orden: la vida real de UDP 💨</small></p>

> 🗺️ **Estás en:** 📡 **U05 · Sockets UDP y Protocolos** → 04 · Datagramas y pérdida

---

## 📬 La idea en una frase

> En UDP, cada `sendto()` es un **datagrama independiente**: puede llegar desordenado, duplicado o **no llegar**. No hay confirmación de recepción, así que si un paquete se pierde, se pierde para siempre.

Este es el punto donde aterrizas las consecuencias del "No" de la tabla del [punto 1](/ApuntesPSP/05-sockets-udp-y-protocolos/01-tcp-vs-udp). El cliente UDP es trivial de escribir (lo viste en el [punto 2](/ApuntesPSP/05-sockets-udp-y-protocolos/02-cliente-udp)); lo que no es trivial es lo que pasa en el camino.

---

## 💨 El datagrama: cada envío es un mundo aparte

> En UDP, cada `sendto()` es un datagrama independiente. Pueden llegar **desordenados, duplicados o no llegar**.

Imagina que mandas 5 mensajes seguidos desde un cliente UDP:

```python
import socket, time

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cliente:
    for i in range(1, 6):
        cliente.sendto(f"Mensaje #{i}".encode(), ("127.0.0.1", 5001))
        time.sleep(0.2)
```

El servidor podría recibirlos en **cualquier orden** (o no recibir alguno). La red no promete nada: cada datagrama viaja por su cuenta, como aviones de papel lanzados desde el mismo balcón pero que el viento puede separar.

---

## 🧯 Los tres males de UDP

### 1. Pérdida de paquetes 💀

No hay confirmación de recepción. Si un paquete se pierde, **se pierde para siempre**: UDP no reenvía nada. En una videollamada es un frame que se salta; en una transferencia de archivos sería un trozo irrecuperable.

### 2. Orden no garantizado 🔀

Los datagramas pueden llegar en distinto orden al que se enviaron. Sin números de secuencia, el receptor no tiene forma de reordenarlos. Por eso los protocolos que necesitan orden (web, email) usan TCP.

### 3. Duplicados 🪞

En condiciones raras (retransmisión en capas inferiores, rutas paralelas), el mismo datagrama puede llegar **dos veces**. UDP no lo detecta: dos mensajes idénticos son simplemente dos mensajes.

```
Envío:     1 ──► 2 ──► 3 ──► 4 ──► 5
                           │ (se pierde el 3)
Recepción: 1 ──► 2 ──► 4 ──► 5        ← el 3 jamás llega

Otro caso: 1 ──► 2 ──► 2 ──► 3        ← el 2 duplicado
```

---

## 🤔 ¿Por qué alguien elegiría esto?

Porque esos tres males son el **precio de la velocidad**: sin handshake, sin confirmaciones ni reenvíos, cada paquete cuesta el mínimo. Y hay aplicaciones donde perder un paquete molesta menos que esperar por él:

- Una videollamada: mejor un frame saltado que la conversación congelada esperando un reenvío.
- Un juego online: mejor 60 paquetes por segundo aunque se pierdan algunos que un "lag" por confirmar cada movimiento.
- DNS: una respuesta que no llega se repite; la siguiente valdrá igual.

La regla de decisión completa, con sus casos reales, la tienes en el [punto 7](/ApuntesPSP/05-sockets-udp-y-protocolos/07-cuando-usar-cada-protocolo). Y cuando necesites fiabilidad **y** velocidad, la red ya inventó la solución intermedia: **QUIC**, un protocolo con las garantías de TCP pero corriendo sobre UDP (lo verás en el [punto 9](/ApuntesPSP/05-sockets-udp-y-protocolos/09-cierre)).

---

## 🧠 Mini-chequeo

1. ¿Qué tres cosas pueden pasarle a un datagrama en la red?
2. ¿Qué pasa si un paquete UDP se pierde? ¿Se reenvía?
3. ¿Por qué una videollamada prefiere UDP aunque pierda paquetes?

<details>
<summary>🔄 Respuestas</summary>

1. **Perderse** (sin confirmación, no se reenvía), **llegar desordenado** (no hay números de secuencia) y **duplicarse** (UDP no lo detecta).
2. **Se pierde para siempre**: UDP no tiene confirmación de recepción ni reenvío. Si no llega, nadie se entera.
3. Porque perder un frame puntual es mejor que **esperar** a que se reenvíe el anterior: la conversación se vería congelada. Prefiere estar al día antes que completo.

</details>

---

## ✅ Resumen en 3 frases

- Cada `sendto()` de UDP es un datagrama independiente que puede perderse, duplicarse o llegar desordenado.
- No hay confirmación de recepción: un paquete perdido se pierde para siempre, nadie lo reenvía.
- Esos males son el precio de la velocidad, y aplicaciones como VoIP o juegos lo aceptan a cambio de latencia mínima.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Datagrama | Paquete independiente de UDP |
| Pérdida | Un datagrama que no llega y no se reenvía |
| Orden no garantizado | Los datagramas pueden llegar en distinto orden |
| Duplicado | El mismo datagrama llegando dos veces |
| Sin confirmación | UDP no avisa de la recepción (a diferencia de TCP) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-sockets-udp-y-protocolos) · **Anterior:** [03 · Servidor UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/03-servidor-udp) · **Siguiente:** [05 · HTTP desde cero](/ApuntesPSP/05-sockets-udp-y-protocolos/05-http-desde-cero)