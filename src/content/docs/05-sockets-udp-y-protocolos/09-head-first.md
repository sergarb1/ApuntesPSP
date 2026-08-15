---
title: "09 — Head First: consolida lo aprendido"
description: "Sé el Datagrama, laboratorio eco UDP y el cierre de la unidad 🧠"
---

<p><small>Sé el Datagrama, laboratorio eco UDP y el cierre de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 📡 **U05 · Sockets UDP y Protocolos** → 09 · Head First

---

Has terminado la teoría: TCP vs UDP, cliente y servidor UDP, los caprichos de los datagramas, HTTP hablado a pelo y NTP para saber la hora. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/05-sockets-udp-y-protocolos/08-practica-eco-udp) y antes de abrir los boletines.

---

## ⭐ Sé el Datagrama

> *Eres un datagrama UDP. Te acabas de crear con un `sendto()` y vas a emprender tu viaje hacia un servidor eco.*

**¿Qué pasa?**

1. El cliente te empaqueta con la dirección destino: `sendto(datos, ("127.0.0.1", 9001))`. **No hay conexión**: tú eres un mensaje suelto, sin número de secuencia y sin confirmación de vuelta.
2. Atraviesas la red como un avión de papel. **Nadie te reenvía si te pierdes**: esa es tu esencia y tu velocidad.
3. Llegas al servidor y `recvfrom(1024)` te despierta de su espera. El servidor lee tu contenido y tu dirección de origen.
4. El servidor decide devolverte con `sendto(datos, direccion)`: te convierte en **eco** y vuelves por donde viniste.
5. El cliente te recibe con `recvfrom()` y te imprime. Has completado un viaje de ida y vuelta… o no: si el viento (la red) te pierde, nadie se entera.

**Todo sin conexión, sin handshake y sin confirmaciones.**

> 💡 **Ahora tú:** ¿y si el servidor no está escuchando? Tu viaje termina en el vacío: el datagrama se pierde y el `recvfrom()` del cliente se queda esperando (a menos que haya un `settimeout()`). Eso es lo que aprendiste en el [punto 4](/ApuntesPSP/05-sockets-udp-y-protocolos/04-datagramas-y-perdida).

---

## 🔥 Fireside Chat: TCP vs UDP

> *Dos protocolos de transporte se sientan junto a la chimenea a dirimir, de una vez, quién manda.*

**TCP:** — Yo soy el mensajero certificado. Entrego cada carta, en orden, y si se pierde, la reenvío. Pero cuesta más.

**UDP:** — Yo soy el lanzador de aviones de papel. Mando y olvido. Si no llega, pues no llega. Pero lanzo 100 en el tiempo que tú preparas uno.

**TCP:** — Mis casos de uso: web (HTTP), correo (SMTP), transferencia de archivos (FTP). Todo lo que necesite fiabilidad.

**UDP:** — Mis casos de uso: videollamadas (Zoom), streaming (Twitch), juegos online (Fortnite), DNS. Prefiero velocidad antes que fiabilidad.

**TCP:** — Tengo control de congestión, retransmisión, checksums...

**UDP:** — Yo tengo... velocidad. Y puedo añadir fiabilidad en la capa de aplicación si quiero (QUIC, por ejemplo).

**TCP:** — Eres un temerario.

**UDP:** — Y tú un pesado. Por eso nos complementamos.

> **Moraleja:** no son rivales: son dos herramientas para dos momentos. TCP cuando el dato debe quedar intacto; UDP cuando el momento es lo valioso.

---

## 🕵️ ¿Quién Soy?

1. Soy el método del cliente UDP que envía el datagrama con su dirección destino.
2. Soy el método que devuelve datos **y** la dirección de quien los mandó.
3. Soy el protocolo de texto sobre TCP que mueve la web.
4. Soy el grupo de servidores de tiempo que responde en el puerto 123.
5. Soy el protocolo fiable que se construye encima de UDP para HTTP/3.
6. Soy el método que convierte a un servidor UDP en "eco".

<details>
<summary>🔄 Respuestas</summary>

1. **`sendto()`**.
2. **`recvfrom()`**.
3. **HTTP**.
4. **`pool.ntp.org`** (NTP).
5. **QUIC**.
6. **`sendto(datos, direccion)`** — reenviar lo recibido a la dirección de origen.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "perdí paquetes y mi stream se corta"

**CONRAD:** — "Clásico: montas el streaming con UDP, se pierden paquetes, y en la reunión te dicen *'el vídeo se corta'*. Pues claro. Razones: 1) **No hay reenvío**: un datagrama perdido se pierde para siempre. 2) **No hay orden**: los paquetes que llegan pueden venir revueltos, y sin buffer de reordenación, el reproductor se atraganta. 3) **No hay control de congestión**: UDP manda igual de rápido aunque la red se sature, así que la pérdida se dispara. 4) Usaste UDP para algo que necesitaba fiabilidad… o TCP para algo que necesitaba velocidad."

**CONRAD:** — "Y lo mejor: *'pero el cliente hacía recvfrom y nunca llegaba nada'*. ¡Pues claro! Si el datagrama se perdió, `recvfrom()` se queda bloqueado **para siempre**. Un `settimeout(5)` y verás la excepción aparecer. UDP no avisa: tú eres quien pone los tiempos."

**CONRAD:** — "Y no me vengas con *'¿será que la red va lenta?'*. Si pierdes paquetes, el problema no es la velocidad: es que **elegiste mal el protocolo** o no pusiste tiempo de espera. HTTP para lo que debe ser fiable, UDP para lo que debe ser fluido, y `settimeout()` para no quedarte colgado. A diagnosticar."

---

## ⚡ Laboratorio de Tortura: eco UDP en dos terminales

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (`socket`, sin instalar nada) + dos terminales

**Escenario:** construye un servidor eco UDP y un cliente que le mande mensajes, exactamente como en el [punto 8](/ApuntesPSP/05-sockets-udp-y-protocolos/08-practica-eco-udp).

**Tareas paso a paso:**

1. **Escribe el servidor eco** (`servidor_eco.py`): `bind()` en `127.0.0.1:9001` y un bucle infinito que haga `recvfrom()` y responda con `sendto(datos, direccion)`. Debe imprimir cada mensaje recibido con su dirección.
2. **Escribe el cliente** (`cliente_eco.py`): pide un mensaje con `input()`, lo envía con `sendto()` y muestra la respuesta de `recvfrom()`.
3. **Arranca el servidor** en una terminal y **el cliente** en otra. Envía tres mensajes seguidos y comprueba que el eco funciona y que el servidor ve la dirección de cada uno.
4. **Añade el contador**: haz que el servidor responda `"Eco #1: ..."`, `"Eco #2: ..."` llevando la cuenta de los mensajes recibidos.
5. **Añade `settimeout(5)`** al cliente y comprueba qué pasa si cierras el servidor antes de enviar.

**Fallo intencionado:** en el servidor, en lugar de responder con la `direccion` que devuelve `recvfrom()`, responde a una dirección inventada: `servidor.sendto(datos, ("127.0.0.1", 9999))`. ¿Qué pasa? El cliente se queda **bloqueado para siempre** en su `recvfrom()`: el eco fue a otro puerto, donde nadie escucha. La respuesta existe, pero no llega a su destinatario. Solo el `settimeout(5)` te sacará del atolladero.

> **Pista 1:** en UDP, la dirección del remitente **no se guarda en ningún sitio**: llega en cada `recvfrom()`. Para responder bien, usa la misma tupla que te entrega `recvfrom()`, como en el [punto 8](/ApuntesPSP/05-sockets-udp-y-protocolos/08-practica-eco-udp).
>
> **Pista 2:** si el cliente se queda colgado, ese es el síntoma del fallo: el `recvfrom()` del cliente espera un datagrama que fue a otro puerto. Añade `cliente.settimeout(5)` y verás la excepción `socket.timeout` aparecer a los 5 segundos, confirmando que la respuesta nunca llegó.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Avión de Papel** | Crear y enviar el primer datagrama UDP con `sendto()` |
| 🏅 **Eco Master** | Montar un servidor + cliente eco UDP en dos terminales |
| 🏅 **Fiable o Veloz** | Explicar cuándo usar TCP y cuándo UDP con casos reales |
| 🏅 **Navegador a pelo** | Hablar HTTP a mano con un socket TCP y leer la respuesta |
| 🏅 **Relojero** | Obtener la hora oficial de Internet con un cliente NTP |

---

## 🧠 Atrévete a Pensar

1. ¿Por qué UDP puede "perder datos" y TCP no, y por qué eso es aceptable en VoIP?
2. ¿Qué pasaría si HTTP/1.1 se enviara por UDP en lugar de TCP?
3. ¿Cómo sabe un servidor UDP a quién responder si no hay conexión?
4. ¿Qué ventaja tiene QUIC (HTTP/3) al construirse sobre UDP en lugar de usar TCP?
5. ¿Por qué NTP usa UDP aunque la hora exacta parezca "importante"?

<details>
<summary>💡 Soluciones</summary>

1. TCP **confirma y reenvía** cada segmento; UDP no. En VoIP, un frame perdido se salta y la conversación sigue; esperar a un reenvío la congelaría. Por eso se tolera la pérdida a cambio de fluidez.
2. La web se rompería: sin garantía de entrega ni orden, las páginas llegarían incompletas y revueltas. El HTML debe reconstruirse byte a byte, así que necesita las garantías de TCP.
3. Con la **dirección que entrega `recvfrom()`** (la tupla IP/puerto del cliente): cada datagrama llega con su origen pegado, y `sendto()` usa esa misma tupla para responder.
4. QUIC evita el coste de conexión de TCP (arranque más rápido), usa cifrado por defecto y maneja por sí mismo la pérdida y el orden: **fiabilidad sin el peso de TCP**, corriendo sobre la capa ligera de UDP.
5. Porque **no depende de un solo paquete**: NTP manda muchas peticiones y calcula la hora estadísticamente. Si una se pierde, la siguiente vale igual: la fiabilidad sale del conjunto.
</details>

---

## 🧩 Crucigrama de Bits

```
Horizontal:
1. Método del cliente UDP para enviar un datagrama (6 letras)
4. Protocolo fiable sobre UDP que usa HTTP/3 (4 letras)
6. Método que devuelve datos y la dirección del remitente (8 letras)
8. Método del servidor UDP para reservar un puerto (4 letras)

Vertical:
2. Verbo HTTP para pedir un recurso (3 letras)
3. Unidad de datos independiente de UDP (9 letras)
5. Código de estado HTTP para "todo bien" (3 dígitos)
7. Puerto de los servidores NTP (3 dígitos)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. SENDTO, 4. QUIC, 6. RECVFROM, 8. BIND
**Vertical:** 2. GET, 3. DATAGRAMA, 5. DOSCIENTOS (200), 7. CIENTOVEINTITRES (123)

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué diferencia hay entre TCP y UDP? ¿Cuándo usarías cada uno?"**
2. **"Escribe un servidor UDP que reciba un mensaje y responda 'Recibido'."**
3. **"¿Cómo funciona HTTP a nivel de socket? Descríbeme una petición y su respuesta."**
4. **"¿Cómo obtendrías la hora exacta de Internet en Python sin librerías externas?"**
5. **"¿Qué es QUIC y por qué se monta sobre UDP?"**

> 💡 **Cómo encararlas:** la 1 y la 2 son las "preguntas reina". Para la 1, repite la moraleja del [punto 7](/ApuntesPSP/05-sockets-udp-y-protocolos/07-cuando-usar-cada-protocolo): fiabilidad contra velocidad, con los casos reales (web/email → TCP; streaming/juegos/DNS → UDP). Para la 2, escribe el servidor del [punto 3](/ApuntesPSP/05-sockets-udp-y-protocolos/03-servidor-udp) sin pensarlo: `bind()` + `recvfrom()` + `sendto()`. Si sabes contarlo fluido, ya eres medio desarrollador de redes.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Cuándo usar UDP en vez de TCP?**

Cuando la velocidad importa más que la fiabilidad: streaming, juegos, VoIP, DNS. Perder un frame de vídeo es mejor que esperar a que se reenvíe.

> ❓ **¿UDP puede perder datos?**

Sí. No hay confirmación de recepción. Si pierdes un paquete, se pierde para siempre.

> ❓ **¿HTTP siempre usa TCP?**

Sí, HTTP/1.1 y HTTP/2 usan TCP. **HTTP/3** usa QUIC, que va sobre UDP (¡la vuelta a la tortilla!).

> ❓ **¿NTP usa UDP? ¿No es importante que llegue la hora exacta?**

Sí, NTP usa UDP. Pero manda muchas peticiones y calcula estadísticamente la hora correcta. Si un paquete se pierde, no pasa nada: el próximo valdrá.

---

## 🎬 Post-Créditos

> *Un datagrama UDP sale del cliente. Sin conexión, sin confirmación, sin miedo.*

*El servidor eco lo recibe, lee su dirección y se lo devuelve igual que llegó.*

*En la otra terminal, un socket TCP estrecha la mano y la web entera llega, completa y en orden.*

*Y en algún lugar del mundo, un reloj sin átomos pregunta la hora exacta en el puerto 123.*

**PRÓXIMAMENTE EN U06:** *APIs REST. Hasta ahora hablabas HTTP a mano, petición a petición. Ahora toca automatizarlo: la librería `requests`, los verbos GET y POST, y el JSON viajando por la red.*

---

## ✅ Criterios de evaluación cubiertos (RA3)

**RA3 — Sockets: comunicaciones en red con TCP/UDP y protocolos de aplicación (HTTP, NTP).**

| CE | Criterio | Cubierto |
|---|---|---|
| a) | Modelo de capas de red (TCP/IP) | ✅ Punto 1 |
| b) | Identifica tipos de sockets (TCP/UDP) | ✅ Puntos 1-4 |
| e) | Implementa servidores y clientes UDP | ✅ Puntos 2, 3 y 8 + ⚡ Laboratorio de Tortura |
| h) | Implementa protocolos de aplicación (HTTP, NTP) | ✅ Puntos 5 y 6 + Cliente HTTP manual |

> RA3c (servidor TCP), RA3d (cliente TCP), RA3f (errores) y RA3g (opciones) se cubren en la **U04 · Sockets TCP**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/05-sockets-udp-y-protocolos) · **Anterior:** [08 · Práctica eco UDP](/ApuntesPSP/05-sockets-udp-y-protocolos/08-practica-eco-udp) · **Siguiente:** **[U06 · APIs REST y HTTP](/ApuntesPSP/06-apis-rest-y-http)**