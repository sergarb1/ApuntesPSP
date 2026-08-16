---
title: 07 — Cuándo usar cada protocolo
description: "Criterios de decisión y casos reales: DNS, VoIP, streaming 🧭"
---

<p><small>Criterios de decisión y casos reales: DNS, VoIP, streaming 🧭</small></p>

> 🗺️ **Estás en:** 📡 **U05 · Sockets UDP y Protocolos** → 07 · Cuándo usar cada protocolo

---

## 📬 La idea en una frase

> No existe "el mejor protocolo": existe la pregunta correcta. **¿Prefieres que llegue todo, o prefieres que llegue rápido?** Según la respuesta, TCP o UDP.

Este punto junta todo lo anterior (la tabla del [punto 1](/ApuntesPSP/05-sockets-udp-y-protocolos/01-tcp-vs-udp) y los males del [punto 4](/ApuntesPSP/05-sockets-udp-y-protocolos/04-datagramas-y-perdida)) para darte la regla de decisión que usarás de por vida como programador.

---

## 🧭 El criterio: velocidad o fiabilidad

```
¿Puedo permitirme perder datos?
        │
        ├── NO ─────────────► TCP
        │      (un byte perdido lo rompe todo:
        │       archivos, web, email, transacciones)
        │
        └── SÍ ─────────────► UDP
               (prefiero estar al día antes que completo:
                voz, vídeo, juegos, DNS)
```

Dos preguntas que te ayudan a decidir:

1. **¿Es un dato "completo" o un "flujo en vivo"?** Un archivo debe llegar entero (TCP); una conversación debe llegar fluida (UDP).
2. **¿Qué molesta más: que falte un trozo o que todo vaya lento?** Si el trozo faltante es fatal, TCP; si el retraso es fatal, UDP.

---

## 📡 Casos reales: la tabla que se repite en las entrevistas

| Aplicación | Protocolo | Por qué |
|---|---|---|
| Web (HTTP) | **TCP** | La página debe llegar completa y en orden |
| Email (SMTP, POP3, IMAP) | **TCP** | Un mensaje a medias es inútil |
| Transferencia de archivos (FTP) | **TCP** | Un byte perdido corrompe el archivo |
| **DNS** | **UDP** | La consulta es diminuta; si se pierde, se repite |
| **VoIP / videollamadas** (Zoom, Skype) | **UDP** | La conversación debe ir fluida; un frame perdido se tolera |
| **Streaming** (Twitch, TV online) | **UDP** | Prefieres el directo fluido a un reenvío que lo congele |
| **Juegos online** (Fortnite, Minecraft) | **UDP** | Cientos de paquetes por segundo; la latencia manda |
| NTP (hora) | **UDP** | Manda muchas peticiones y promedia (viste el [punto 6](/ApuntesPSP/05-sockets-udp-y-protocolos/06-ntp-y-servidores-de-tiempo)) |

Fíjate en el patrón: **cuando el dato es valioso y debe quedar intacto, TCP; cuando lo valioso es el momento, UDP**. En el streaming de vídeo, por ejemplo, UDP es la opción clásica porque un frame roto se ve un instante y se olvida, pero un reenvío congelaría la emisión para todos.

---

## 🔀 Y si quieres ambas cosas: QUIC

¿Fiabilidad de TCP con velocidad de UDP? Eso existe: **QUIC**, el protocolo sobre el que corre **HTTP/3**. QUIC se construye sobre UDP (la capa de transporte es UDP) pero añade por su cuenta confirmaciones, control de congestión y cifrado. Es la "vuelta a la tortilla" que verás en el cierre del [punto 9](/ApuntesPSP/05-sockets-udp-y-protocolos/09-cierre): la industria decide cuándo incluso el "no fiable" merece una capa de fiabilidad.

---

## 🧠 Mini-chequeo

1. ¿Qué criterio usarías para elegir entre TCP y UDP en una app nueva?
2. ¿Por qué DNS usa UDP si "perder" la respuesta de un dominio parece grave?
3. Pon dos ejemplos de TCP y dos de UDP distintos de los de la tabla.

<details>
<summary>🔄 Respuestas</summary>

1. Preguntarte si puedes permitirte perder datos: si el dato debe quedar **intacto y completo** → TCP; si prefieres **fluidez y velocidad** tolerando pérdidas → UDP.
2. Porque la consulta DNS es **diminuta** (un par de cientos de bytes) y repetirla cuesta casi nada: si la respuesta se pierde, se manda otra petición. La fiabilidad se consigue re-preguntando, no con un canal caro.
3. Respuestas libres. TCP: descargas de actualizaciones, pago online, banca. UDP: retransmisión en vivo de deportes, chat de voz de un juego, telemetría de sensores.

</details>

---

## ✅ Resumen en 3 frases

- La regla de decisión es una sola pregunta: ¿prefieres que llegue todo (TCP) o que llegue rápido (UDP)?
- Los casos reales son consistentes: web/email/FTP con TCP; DNS/VoIP/streaming/juegos con UDP.
- Si quieres ambas cosas, QUIC (sobre HTTP/3) construye fiabilidad encima de UDP.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Criterio de decisión | ¿Fiabilidad o velocidad? Eso elige el protocolo |
| DNS | Directorio de Internet; usa UDP por su tamaño diminuto |
| VoIP | Voz sobre IP; usa UDP para ir fluida |
| Streaming | Emisión en vivo; prefiere fluidez a completitud |
| QUIC | Fiabilidad tipo TCP construida sobre UDP |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-sockets-udp-y-protocolos) · **Anterior:** [06 · NTP y servidores de tiempo](/ApuntesPSP/05-sockets-udp-y-protocolos/06-ntp-y-servidores-de-tiempo) · **Siguiente:** [08 · Práctica eco UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/08-practica-eco-udp)