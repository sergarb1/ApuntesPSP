---
title: "09 — Head First: consolida lo aprendido"
description: Sé la Clave, laboratorio híbrido con firma y el cierre de la unidad 🧠
---

<p><small>Sé la Clave, laboratorio híbrido con firma y el cierre de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🧬 **U09 · Cifrado Moderno** → 09 · Head First

---

Has terminado la teoría: simétrico vs asimétrico, AES con sus modos, RSA, firmas digitales, cifrado híbrido y RBAC. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/09-cifrado-moderno/08-practica-sistema-seguro) y antes de abrir los boletines.

---

## ⭐ Sé la Clave

> *Primero eres una clave simétrica: la compartes con Ana y con Bob. Luego te conviertes en un par asimétrico: una mitad pública y otra privada.*

**Primera vida: eres la clave AES (simétrica).**

1. Ana te genera con `get_random_bytes(32)`: eres 32 bytes aleatorios.
2. Ana cifra su mensaje contigo: `AES.new(tú, AES.MODE_EAX)` → texto cifrado + tag.
3. Bob necesita descifrar… pero tú no viajas en el paquete. El **problema de la distribución de claves**: ¿cómo llegas a Bob sin que nadie te intercepte?
4. Si un atacante te captura, lo descifra todo. Eres poderosa y rápida, pero frágil en el reparto.

**Segunda vida: eres el par RSA (asimétrico).**

1. Naces como par: `RSA.generate(2048)`. Tu mitad **pública** se puede publicar en todos los sitios; tu mitad **privada** jamás sale de casa.
2. Bob cifra un secreto con tu mitad pública… y solo tu mitad privada puede descifrarlo.
3. Un atacante te ve entero: la pública no le sirve para nada sin la privada. Resolviste el reparto.
4. Pero eres lenta y no puedes con mensajes grandes: para el volumen necesitas a tu colega AES.

> 💡 **Ahora tú:** ¿quién gana la partida? Ninguno: el [punto 6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido) te enseñó que trabajan en equipo. RSA reparte la clave AES, y AES cifra el tráfico. Eso es lo que hace HTTPS.

---

## 🔥 Fireside Chat: AES vs RSA

> *Dos cifrados se sientan junto a la chimenea a decidir, de una vez, quién es el más importante.*

**AES:** — Soy rapidísimo. Cifro un archivo entero en milisegundos. ¿El problema? Ambos necesitamos la misma clave.

**RSA:** — Yo soy lento, pero elegante. Tú me das tu clave pública, yo cifro, y solo tú con tu privada puedes descifrar.

**AES:** — Entonces, ¿para qué sirves si eres tan lento?

**RSA:** — Para **distribuir tu clave**. Yo cifro tu clave AES con mi RSA. Tú la descifras con tu privada. Luego usamos AES para todo.

**AES:** — O sea, ¿trabajamos en equipo?

**RSA:** — Exacto. Eso se llama **cifrado híbrido**. Lo usan HTTPS, WhatsApp, Signal...

> **Moraleja:** AES aporta velocidad y volumen; RSA aporta el reparto de secretos. Juntos mueven Internet.

---

## 🕵️ ¿Quién Soy?

1. Soy el número aleatorio único que viaja junto al cifrado para poder descifrar.
2. Soy el código de autenticación que detecta si el mensaje fue manipulado.
3. Soy el cifrado simétrico estándar, con claves de 16, 24 o 32 bytes.
4. Soy el modo de AES que cifra cada bloque solo y deja ver patrones (¡no me uses!).
5. Soy la clave que se puede repartir por todos los sitios, pero no descifro yo sola.
6. Soy el resultado de cifrar el SHA-256 de un mensaje con la clave privada del firmante.

<details>
<summary>🔄 Respuestas</summary>

1. **El nonce**.
2. **El tag**.
3. **AES**.
4. **ECB** (Electronic Codebook).
5. **La clave pública** (solo descifra la privada de su dueño).
6. **La firma digital**.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "cifré el mensaje pero no puedo descifrarlo"

**CONRAD:** — "Clásico: cifras un mensaje con AES, lo envías, y al descifrar obtienes basura o una excepción. Razones: 1) Usaste una **clave de 7 caracteres** como `b'clave123'`: AES espera exactamente 16, 24 o 32 bytes, y una frase corta no lo es. 2) **No guardaste el nonce**: cada `AES.new` genera uno nuevo, y sin el mismo nonce no hay descifrado posible. 3) Cifraste con una clave y descifraste con otra: *'¿será que la clave cambió sola?'* ¡No, Conrad! La misma clave y el mismo nonce, siempre. 4) **No verificaste el tag**: `decrypt` devuelve basura en silencio; con `decrypt_and_verify` la manipulación salta al instante. 5) Usaste **ECB** para datos estructurados y los patrones se ven a simple vista."

**CONRAD:** — "Y lo mejor: *'es que el modo EAX no me deja descifrar con ECB'*. ¡Pues claro! El modo de cifrado es **parte de la receta**: si cifras con EAX, descifras con EAX y con el mismo nonce. Mezclar modos es mezclar cerraduras de casas distintas."

**CONRAD:** — "Y no me vengas con *'¿será que pycryptodome está roto?'*. La biblioteca lleva años auditada ([punto 1 de la U08](/ApuntesPSP/08-hash-y-cifrado-clasico/01-principios-de-seguridad): no inventes tu cripto). Si no descifras, revisa la clave, el nonce y el modo. A diagnosticar."

---

## ⚡ Laboratorio de Tortura: mensaje cifrado y firmado

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (`pip install pycryptodome`)

**Escenario:** Ana quiere enviar a Bob un mensaje **confidencial** (solo Bob lo lee) y **autenticado** (solo Ana pudo crearlo). Monta el sistema completo del [punto 8](/ApuntesPSP/09-cifrado-moderno/08-practica-sistema-seguro), pero con dos pares RSA distintos: el de Ana (firmante) y el de Bob (destinatario).

**Tareas paso a paso:**

1. Genera `clave_ana = RSA.generate(2048)` y `clave_bob = RSA.generate(2048)`.
2. Ana cifra `b"Mensaje ultrasecreto"` con **AES (EAX)**: `cifrado, tag = cifrador_aes.encrypt_and_digest(mensaje)`, y protege su clave AES con `PKCS1_OAEP.new(clave_bob.publickey()).encrypt(clave_aes)`.
3. Ana **firma** el mensaje con su clave privada: `pkcs1_15.new(clave_ana).sign(SHA256.new(mensaje))`.
4. Bob **descifra** con su privada (`PKCS1_OAEP`) y con AES (mismo nonce).
5. Bob **verifica** la firma con la **pública de Ana** y muestra `✅` o `❌`.
6. Modifica **un byte** del mensaje descifrado y comprueba que, si se volviera a firmar con el original, la verificación del tocado falla.

**Fallo intencionado:** en la verificación de la firma, usa la clave **pública de Bob** en lugar de la de Ana. ¿Qué pasa? La verificación lanza `ValueError`: la firma de Ana **no verifica con la pública de Bob**, aunque el mensaje sea íntegro. El sistema parece roto… pero no lo está: estás verificando con la clave equivocada.

> **Pista 1:** la firma se verifica **siempre con la clave pública del firmante**, no con la del destinatario. Ana firma con su privada → se verifica con su pública. Bob solo cifra/descifra con su par.
>
> **Pista 2:** si no ves el fallo, imprime de quién es cada clave antes de verificar: `print(clave_ana.publickey().export_key().decode()[:50])` frente a la de Bob. Si la pública que usas para verificar no es la de Ana, ese es el bug.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Simétric Master** | Cifrar y descifrar con AES (EAX) mostrando nonce y tag |
| 🏅 **Key Pair Forger** | Generar un par RSA de 2048 bits y cifrar/descifrar con PKCS1_OAEP |
| 🏅 **Hybrid Engineer** | Montar el cifrado híbrido AES + RSA completo |
| 🏅 **Signature Detective** | Firmar y verificar, detectando una firma manipulada |
| 🏅 **RBAC Architect** | Implementar un sistema de roles y permisos con `puede` |

---

## 🧠 Atrévete a Pensar

1. ¿Por qué no se cifra todo el tráfico de Internet directamente con RSA?
2. ¿Qué pasaría si reutilizaras el mismo nonce dos veces con la misma clave AES?
3. ¿Qué diferencia hay entre cifrar un mensaje con RSA y firmarlo con RSA?
4. ¿Por qué la firma se verifica con la clave pública del firmante y no con la del destinatario?
5. ¿Cómo garantiza el cifrado híbrido que un atacante que intercepta el paquete no pueda leer nada?

<details>
<summary>💡 Soluciones</summary>

1. Porque RSA es **lento** (~1 MB/s) y tiene un **límite de tamaño** (~190 bytes con claves de 2048 bits). Cifrar el tráfico con RSA sería inviable; por eso RSA solo reparte la clave AES, y AES cifra el contenido a ~1 GB/s.
2. El nonce es *number used once*: reutilizarlo debilita el cifrado. Dos mensajes cifrados con la misma clave y el mismo nonce pueden revelar patrones al atacante. El nonce debe ser **único por cifrado**.
3. **Cifrar** con RSA protege la confidencialidad: cifras con la pública del destinatario y solo su privada descifra. **Firmar** es lo contrario en cuanto a claves: cifras el **hash** con tu **privada** para que cualquiera pueda verificarlo con tu pública. Una protege el contenido; la otra demuestra autoría.
4. Porque la firma se creó con la **privada del firmante**, y la única clave que "desbloquea" esa firma es su **pública**. Si se verificara con la pública del destinatario, cualquiera podría firmar en nombre de cualquiera.
5. En el paquete viaja `clave_AES_cifrada_RSA + nonce + tag + cifrado`. El atacante ve todo, pero la clave AES está cifrada con la **pública de Bob**: sin la **privada de Bob** no puede extraerla, y sin la clave AES no puede descifrar el mensaje.
</details>

---

## 🧩 Crucigrama de Bits

```
Horizontal:
1. Cifrado simétrico estándar (3 letras)
4. Cifrado asimétrico más famoso (3 letras)
6. Código de autenticación del cifrado (3 letras)
8. Valor aleatorio único que viaja con el cifrado (5 letras)

Vertical:
2. Modo de AES inseguro que muestra patrones (3 letras)
3. Clave que se reparte libremente (7 letras)
5. Vector de inicialización del modo CBC (2 letras)
7. Mezcla de AES y RSA (7 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. AES, 4. RSA, 6. TAG, 8. NONCE
**Vertical:** 2. ECB, 3. PUBLICA, 5. IV, 7. HIBRIDO

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué diferencia hay entre cifrado simétrico y asimétrico? ¿Cuándo usarías cada uno?"**
2. **"¿Cómo cifrarías un mensaje largo para que solo lo lea un destinatario concreto?"**
3. **"¿Qué es una firma digital y qué garantiza?"**
4. **"Explica cómo funciona HTTPS por dentro."**
5. **"¿Qué es RBAC y cómo lo implementarías en un sistema?"**

> 💡 **Cómo encararlas:** la 1 y la 4 son las "preguntas reina". Para la 1, recorre la comparativa del [punto 1](/ApuntesPSP/09-cifrado-moderno/01-cifrado-simetrico-vs-asimetrico): una clave vs par, velocidad vs reparto, y el complemento híbrido. Para la 4, cuenta la escena del [punto 6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido): el navegador genera una clave AES, la cifra con la pública del servidor (su certificado), el servidor la descifra con su privada, y el tráfico se cifra con AES. Si sabes contarlo fluido, ya eres medio desarrollador seguro.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Qué clave uso para cada operación?**

- Cifrar para alguien: usa su clave **pública**
- Descifrar: usa tu clave **privada**
- Firmar: usa tu clave **privada**
- Verificar firma: usa la clave **pública** del firmante

> ❓ **¿Qué es más seguro, AES-256 o RSA-2048?**

Ambos son seguros hoy en día. No compiten: son herramientas diferentes para problemas diferentes. AES protege el volumen; RSA reparte secretos. Elegir uno sobre el otro no tiene sentido: el sistema seguro los usa juntos.

> ❓ **¿Qué pasa si pierdo mi clave privada?**

Pierdes acceso a todo lo cifrado con tu clave pública. Por eso se hacen **copias de seguridad** (y se guardan bien). Perder la privada es perder la llave de la caja fuerte: el cifrado hace su trabajo demasiado bien.

> ❓ **¿Puedo tener la misma clave RSA siempre?**

Sí, las claves no caducan. Pero por seguridad se recomienda rotarlas cada cierto tiempo (como cambiar la contraseña). Es el principio de **rotación de claves** de la U08.

> ❓ **¿Cuánto tarda RSA en generar claves?**

Generar RSA 2048 bits lleva ~1-2 segundos. AES genera clave instantáneamente. Esa diferencia también explica por qué RSA se usa una vez (repartir) y AES todo el rato (cifrar).

---

## 🎬 Post-Créditos

> *Un mensaje cifrado viaja por la red. Solo el destinatario puede leerlo.*

*RSA repartió la clave. AES cifró el contenido. La firma garantizó quién lo escribió.*

*Nadie pudo espiar. Nadie pudo fingir. Nadie pudo modificar.*

**PRÓXIMAMENTE EN U10:** *servidores concurrentes: un servidor que atiende a muchos clientes a la vez sin bloquearse. ThreadPool, hilos y benchmark.*

---

## ✅ Criterios de evaluación cubiertos (RA5)

**RA5: Implementa mecanismos de seguridad que garanticen la integridad y la confidencialidad de los datos.**

| CE | Criterio | Cubierto |
|---|---|---|
| a) | Principios básicos de seguridad | ✅ Simétrico vs asimétrico (punto 1) + RBAC (punto 7) |
| b) | Tipos de cifrado (simétrico, asimétrico) | ✅ Puntos 1, 2 y 4 |
| c) | Implementa funciones hash (MD5, SHA) | ✅ Cubierto en la U08; se usa en las firmas (punto 5) |
| d) | AES | ✅ Puntos 2-3 + ⚡ Laboratorio |
| e) | RSA | ✅ Puntos 4-5 + ⚡ Laboratorio |
| f) | Firmas digitales | ✅ Punto 5 + ⚡ Laboratorio |
| g) | Cifrado híbrido | ✅ Punto 6 + ⚡ Laboratorio |
| h) | Conoce sistemas de roles y RBAC | ✅ Punto 7 |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-cifrado-moderno) · **Anterior:** [08 · Práctica sistema seguro](/ApuntesPSP/09-cifrado-moderno/08-practica-sistema-seguro) · **Siguiente:** **[U10 · Servidores Concurrentes](/ApuntesPSP/10-servidores-concurrentes)**