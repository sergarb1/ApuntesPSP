---
title: "09 — Cierre: consolida lo aprendido"
description: "Sé el cifrado, laboratorio híbrido con firma y el ring final de la unidad 🧠"
---

<p><small>Sé el cifrado, laboratorio híbrido con firma y el ring final de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🔐 **UD 10 · Seguridad y cifrado** → 09 · Cierre

---

Has terminado la teoría: principios de seguridad, hash y huellas digitales, contraseñas con sal, cifrado César, AES, RSA, firmas digitales, cifrado híbrido y RBAC. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real con fallos intencionados y las preguntas que te harán en una entrevista.

---

## ⭐ Sé el cifrado

> *Primero eres una clave simétrica: la compartes con Ana y con Bob. Luego te conviertes en un par asimétrico: una mitad pública y otra privada.*

**Primera vida: eres la clave AES (simétrica).**

1. Ana te genera con `AESGCM.generate_key(bit_length=256)`: eres 32 bytes aleatorios.
2. Ana cifra su mensaje contigo: `AESGCM(tú).encrypt(nonce, msg, None)` → texto cifrado.
3. Bob necesita descifrar… pero tú no viajas en el paquete. El **problema de la distribución de claves**.

**Segunda vida: eres el par RSA (asimétrico).**

1. Naces como par: `rsa.generate_private_key(...)`. Tu mitad **pública** se puede publicar; tu mitad **privada** jamás sale de casa.
2. Bob cifra un secreto con tu mitad pública… y solo tu mitad privada puede descifrarlo.
3. Pero eres lento y no puedes con mensajes grandes: para el volumen necesitas a tu colega AES.

> 💡 **Ahora tú:** ¿quién gana la partida? Ninguno: trabajan en equipo. RSA reparte la clave AES, y AES cifra el tráfico. Eso es lo que hace HTTPS.

---

## 🔥 Fireside Chat: Hash vs Cifrado

> *Dos mecanismos de seguridad se sientan junto a la chimenea a resolver, de una vez, quién hace qué.*

**Hash:** — Yo soy la huella digital. Transformo cualquier texto en una cadena fija. No se puede deshacer. Unidireccional. Para siempre.

**Cifrado:** — Vaya, qué drástico. Yo puedo cifrar y descifrar. Tengo clave.

**Hash:** — ¡Esa es precisamente mi gracia! Para contraseñas no quieres que se pueda deshacer.

**Cifrado:** — Pero para enviar un mensaje secreto, el hash no sirve. Ahí entro yo.

**Hash:** — Y para verificar integridad, nadie me gana.

**Cifrado:** — Al final, cada uno a lo suyo. Tú para integridad y contraseñas; yo para confidencialidad.

> **Moraleja**: el hash verifica integridad; el cifrado protege confidencialidad. Ambos son necesarios.

---

## 🔥 Fireside Chat: AES vs RSA

> *Dos cifrados se sientan junto a la chimenea a decidir quién es el más importante.*

**AES:** — Soy rapidísimo. Cifro un archivo entero en milisegundos. ¿El problema? Ambos necesitamos la misma clave.

**RSA:** — Yo soy lento, pero elegante. Tú me das tu clave pública, yo cifro, y solo tú con tu privada puedes descifrar.

**AES:** — Entonces, ¿para qué sirves si eres tan lento?

**RSA:** — Para **distribuir tu clave**. Yo cifro tu clave AES con mi RSA. Tú la descifras con tu privada. Luego usamos AES para todo.

**AES:** — O sea, ¿trabajamos en equipo?

**RSA:** — Exacto. Eso se llama **cifrado híbrido**.

> **Moraleja:** AES aporta velocidad y volumen; RSA aporta el reparto de secretos. Juntos mueven Internet.

---

## 🕵️ ¿Quién soy?

1. Me genero con `os.urandom(16)` y soy distinto para cada usuario.
2. Soy un diccionario precomputado de hashes de contraseñas comunes.
3. Tuve colisiones demostradas en 2004: ya nadie me usa para seguridad.
4. Un solo bit distinto en la entrada y me convierto en un hash completamente diferente.
5. Soy el estándar de 256 bits que nunca debes romper con MD5 o SHA-1.
6. Soy el cifrado que desplaza cada letra y que se rompe en 25 intentos.
7. Soy el número aleatorio único que viaja junto al cifrado para poder descifrar.
8. Soy el código de autenticación que detecta si el mensaje fue manipulado.
9. Soy el cifrado simétrico estándar, con claves de 16, 24 o 32 bytes.
10. Soy el modo de AES que cifra cada bloque solo y deja ver patrones (¡no me uses!).
11. Soy la clave que se puede repartir por todos los sitios, pero no descifro yo sola.
12. Soy el resultado de cifrar el SHA-256 de un mensaje con la clave privada del firmante.

<details>
<summary>🔄 Respuestas</summary>

1. **La sal** (salt).
2. **La tabla rainbow**.
3. **MD5**.
4. **El efecto avalancha**.
5. **SHA-256**.
6. **El cifrado César**.
7. **El nonce**.
8. **El tag**.
9. **AES**.
10. **ECB** (Electronic Codebook).
11. **La clave pública**.
12. **La firma digital**.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "guardé las contraseñas con MD5 y sin sal"

**CONRAD:** — "Clásico: la base de datos cae en manos de un atacante y, en cuestión de horas, ha sacado la mitad de las contraseñas. Razones: 1) Usé **MD5**, que tiene colisiones demostradas desde 2004. 2) **Sin sal**: dos usuarios con la misma contraseña comparten hash y las tablas rainbow funcionan al instante. 3) **Guardé la contraseña en claro** en el log 'por si acaso'. 4) Comparé contraseñas en texto plano en el código. 5) **Cifré** la contraseña en vez de hashaarla… y el atacante robó también la clave de cifrado."

**CONRAD:** — "Y no me vengas con *'¿será que los hashes se ven parecidos?'*. Los hashes no se parecen jamás: el efecto avalancha garantiza que un bit distinto cambia todo."

---

## 🤬 CONRAD VS EL MUNDO: "cifré el mensaje pero no puedo descifrarlo"

**CONRAD:** — "Clásico: cifras un mensaje con AES, lo envías, y al descifrar obtienes basura. Razones: 1) Usaste una **clave de 7 caracteres** como `b'clave123'`: AES espera exactamente 16, 24 o 32 bytes. 2) **No guardaste el nonce**: cada operación genera uno nuevo, y sin el mismo nonce no hay descifrado posible. 3) Cifraste con una clave y descifraste con otra. 4) **No verificaste el tag**: `decrypt` devuelve basura en silencio. 5) Usaste **ECB** para datos estructurados y los patrones se ven a simple vista."

**CONRAD:** — "Y no me vengas con *'¿será que cryptography está roto?'*. La biblioteca lleva años auditada. Si no descifras, revisa la clave, el nonce y el modo."

---

## ⚡ Laboratorio de tortura: registro + login + cifrado híbrido

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (`pip install cryptography`)

**Parte 1 — Registro y login con sal (15 min):**

1. Define `registrar(usuario, contraseña)`: genera la sal con `os.urandom(16)`, calcula `hashlib.sha256(salt + contraseña.encode()).hexdigest()`, guarda `salt.hex() + hash`.
2. Define `login(usuario, contraseña)`: recupera la sal del string, recalcula el hash del intento y compara.
3. Registra a dos usuarios con la **misma** contraseña y comprueba que sus hashes son distintos.

**Parte 2 — Sistema seguro (30 min):**

4. Genera claves RSA para Ana (firmante) y Bob (destinatario).
5. Ana cifra un mensaje con AESGCM, protege la clave AES con RSA pública de Bob.
6. Ana firma el mensaje con su clave privada.
7. Bob descifra y verifica la firma.
8. Modifica **un byte** del mensaje descifrado y comprueba que la verificación del original falla.

**Fallo intencionado (Parte 1):** en el login, genera una sal nueva con `os.urandom(16)` en lugar de recuperar la del string. Todos los logins fallan.

**Fallo intencionado (Parte 2):** en la verificación, usa la clave pública de Bob en lugar de la de Ana. La verificación lanza `ValueError`.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Huella Digital** | Calcular MD5, SHA-1, SHA-256 y SHA-512 con `hashlib` |
| 🏅 **Vault Guardian** | Implementar registro y login con hash + sal |
| 🏅 **Rainbow Breaker** | Explicar cómo la sal neutraliza las tablas rainbow |
| 🏅 **César Cracker** | Cifrar, descifrar y romper por fuerza bruta el César |
| 🏅 **Simétric Master** | Cifrar y descifrar con AESGCM |
| 🏅 **Key Pair Forger** | Generar un par RSA y cifrar/descifrar con OAEP |
| 🏅 **Hybrid Engineer** | Montar el cifrado híbrido AES + RSA |
| 🏅 **Signature Detective** | Firmar y verificar, detectando una firma manipulada |
| 🏅 **RBAC Architect** | Implementar un sistema de roles y permisos |

---

## 🧠 Atrévete a pensar

1. ¿Por qué no se puede "descifrar" un hash, y qué alternativas reales le quedan al atacante?
2. ¿Qué pasaría si dos usuarios con la misma contraseña tuvieran el mismo hash?
3. ¿Por qué no se cifra todo el tráfico de Internet directamente con RSA?
4. ¿Qué pasaría si reutilizaras el mismo nonce dos veces con la misma clave AES?
5. ¿Cómo garantiza el cifrado híbrido que un atacante que intercepta el paquete no pueda leer nada?

<details>
<summary>💡 Soluciones</summary>

1. El hash es **unidireccional**: no existe operación inversa. Al atacante le queda **adivinar**: fuerza bruta o tablas rainbow. La sal y la longitud del hash hacen ambas inviables.
2. Sería una pista para el atacante de que comparten contraseña. La **sal** hace que hashes iguales no existan.
3. Porque RSA es **lento** (~1 MB/s) y tiene un **límite de tamaño** (~190 bytes). RSA solo reparte la clave AES, y AES cifra el contenido.
4. El nonce es *number used once*: reutilizarlo debilita el cifrado. Dos mensajes cifrados con la misma clave y el mismo nonce pueden revelar patrones.
5. En el paquete viaja `clave_AES_cifrada_RSA + nonce + cifrado`. Sin la **privada de Bob** no puede extraer la clave AES, y sin ella no puede descifrar el mensaje.
</details>

---

## 🧩 Crucigrama de bits

```
Horizontal:
1. Hash que tiene colisiones demostradas desde 2004 (3 letras)
4. Valor aleatorio que se mezcla con la contraseña antes de hashear (3 letras)
6. Cifrado simétrico estándar con claves de 16/24/32 bytes (3 letras)
8. Cifrado asimétrico más famoso (3 letras)
9. Código de autenticación del cifrado (3 letras)
10. Valor aleatorio único que viaja con el cifrado (5 letras)

Vertical:
2. Algoritmo seguro de 256 bits de la familia SHA-2 (5 letras)
3. Diccionario precomputado de hashes de contraseñas comunes (6 letras)
5. Propiedad del hash: un bit de cambio altera todo (9 letras)
7. Mezcla de AES y RSA (7 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. MD5, 4. SAL, 6. AES, 8. RSA, 9. TAG, 10. NONCE
**Vertical:** 2. SHA256, 3. RAINBOW, 5. AVALANCHA, 7. HIBRIDO

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Cómo guardarías las contraseñas de tus usuarios en una base de datos?"**
2. **"¿Qué diferencia hay entre hash y cifrado? ¿Cuándo usarías cada uno?"**
3. **"¿Cómo cifrarías un mensaje largo para que solo lo lea un destinatario concreto?"**
4. **"¿Qué es una firma digital y qué garantiza?"**
5. **"Explica cómo funciona HTTPS por dentro."**
6. **"¿Qué es RBAC y cómo lo implementarías en un sistema?"**

> 💡 **Cómo encararlas:** para la 1, recorre hash + sal (SHA-256, nunca la original). Para la 2, hash → integridad, cifrado → confidencialidad. Para la 3-5, cifrado híbrido: RSA reparte la clave AES, AES cifra el tráfico. Para la 6, roles con permisos mínimos.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Se puede descifrar un hash?**

No, el hash no se descifra (es unidireccional). Pero se puede **adivinar** usando tablas rainbow o fuerza bruta. Por eso se usa **sal**.

> ❓ **¿Qué clave uso para cada operación?**

- Cifrar para alguien: su clave **pública**
- Descifrar: tu clave **privada**
- Firmar: tu clave **privada**
- Verificar firma: la clave **pública** del firmante

> ❓ **¿Qué es más seguro, AES-256 o RSA-2048?**

Ambos son seguros. No compiten: son herramientas diferentes. AES protege el volumen; RSA reparte secretos. El sistema seguro los usa juntos.

> ❓ **¿Qué pasa si pierdo mi clave privada?**

Pierdes acceso a todo lo cifrado con tu clave pública. Por eso se hacen **copias de seguridad**.

---

**PRÓXIMAMENTE EN UD 11:** *Alta disponibilidad. Sin un hilo por conexión, un solo bucle de eventos atenderá miles de clientes a la vez. El servidor concurrente se vuelve esbelto.*

---

## ✅ Criterios de evaluación cubiertos (RA5)

**RA5: Implementa mecanismos de seguridad que garanticen integridad y confidencialidad.**

| CE | Criterio | Cubierto |
|---|---|---|
| RA5a | Principios básicos de seguridad | ✅ Punto 1 |
| RA5b | Tipos de cifrado (simétrico/asimétrico) | ✅ Puntos 5-6 |
| RA5c | Implementa funciones hash (MD5, SHA) | ✅ Puntos 2-3 + ⚡ Laboratorio |
| RA5d | Implementa cifrado AES | ✅ Punto 5 + ⚡ Laboratorio |
| RA5e | Implementa cifrado RSA | ✅ Punto 6 + ⚡ Laboratorio |
| RA5f | Crea y verifica firmas digitales | ✅ Punto 7 + ⚡ Laboratorio |
| RA5g | Implementa cifrado híbrido | ✅ Punto 8 + ⚡ Laboratorio |
| RA5h | Conoce sistemas de roles y RBAC | ✅ Punto 8 |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-seguridad-y-cifrado) · **Anterior:** [08 · Cifrado híbrido y práctica](/ApuntesPSP/09-seguridad-y-cifrado/08-cifrado-hibrido-y-practica) · **Siguiente:** **[UD 11 · Alta disponibilidad](/ApuntesPSP/10-alta-disponibilidad)**
