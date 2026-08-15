---
title: "09 — Head First: consolida lo aprendido"
description: Sé el Hash, laboratorio con sal y el ring final de la unidad 🧠
---

<p><small>Sé el Hash, laboratorio con sal y el ring final de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🔐 **U08 · Hash y Cifrado Clásico** → 09 · Head First

---

Has terminado la teoría: huella digital, propiedades del hash, MD5/SHA-1/SHA-256, registro y login con hash, la sal contra las tablas rainbow y el cifrado César. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/08-hash-y-cifrado-clasico/08-buenas-practicas-y-verificacion) y antes de abrir los boletines.

---

## ⭐ Sé el Hash

> *Eres el sistema de registro y login de una aplicación con sal. Acaba de llegar una petición: registrar a un nuevo usuario llamado "Ana" con contraseña "clave123".*

**¿Qué pasa?**

1. Generas una **sal** aleatoria de 16 bytes: `os.urandom(16)`. Cada usuario tiene la suya, irrepetible.
2. Concatenas: `sal + contraseña.encode()` → mezclas la sal con la clave antes de hashear.
3. Calculas `hashlib.sha256(sal + contraseña.encode()).hexdigest()`: la huella de la mezcla.
4. Guardas **sal + hash juntos** (como `salt.hex() + hash`): así el login podrá recuperar la sal.
5. Cuando Ana intenta entrar, extraes su sal (`bytes.fromhex(almacenado[:32])`), recalculas el hash del intento y lo comparas con el guardado.
6. Si coinciden → `✅ login correcto`. Si no → `❌ contraseña incorrecta`.

**En ningún momento existe la contraseña de Ana fuera de su teclado.** Ni tú (la base de datos) la guardas ni la ves.

> 💡 **Ahora tú:** ¿y si dos usuarios usan "clave123"? Como cada uno tiene su sal distinta, sus hashes son diferentes: nadie puede adivinar que comparten contraseña. Eso es lo que aprendiste en el [punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal).

---

## 🔥 Fireside Chat: Hash vs Cifrado

> *Dos mecanismos de seguridad se sientan junto a la chimenea a resolver, de una vez, quién hace qué.*

**Hash:** — Yo soy la huella digital. Transformo cualquier texto en una cadena fija. No se puede deshacer. Unidireccional. Para siempre.

**Cifrado:** — Vaya, qué drástico. Yo puedo cifrar y descifrar. Tengo clave. Si tú pierdes un hash, no hay vuelta atrás. Yo puedo recuperar el mensaje original.

**Hash:** — ¡Esa es precisamente mi gracia! Para contraseñas no quieres que se pueda deshacer. Si alguien roba la base de datos, que se pegue con los hashes.

**Cifrado:** — Pero para enviar un mensaje secreto, el hash no sirve. Necesitas que el destinatario pueda leerlo. Ahí entro yo.

**Hash:** — Y para verificar integridad, nadie me gana. Un archivo, un hash. Si cambia un bit, el hash cambia por completo.

**Cifrado:** — Al final, cada uno a lo suyo. Tú para integridad y contraseñas; yo para confidencialidad.

> **Moraleja**: el hash verifica integridad (no se puede deshacer); el cifrado protege confidencialidad (se deshace con la clave). Ambos son necesarios.

---

## 🕵️ ¿Quién Soy?

1. Me genero con `os.urandom(16)` y soy distinto para cada usuario.
2. Soy un diccionario precomputado de hashes de contraseñas comunes.
3. Tuve colisiones demostradas en 2004: ya nadie me usa para seguridad.
4. Un solo bit distinto en la entrada y me convierto en un hash completamente diferente.
5. Soy el estándar de 256 bits que nunca debes romper con MD5 o SHA-1.
6. Soy el cifrado que desplaza cada letra y que se rompe en 25 intentos.

<details>
<summary>🔄 Respuestas</summary>

1. **La sal** (salt).
2. **La tabla rainbow**.
3. **MD5**.
4. **El efecto avalancha**.
5. **SHA-256**.
6. **El cifrado César**.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "guardé las contraseñas con MD5 y sin sal"

**CONRAD:** — "Clásico: la base de datos cae en manos de un atacante y, en cuestión de horas, ha sacado la mitad de las contraseñas. Razones: 1) Usé **MD5**, que tiene colisiones demostradas desde 2004. 2) **Sin sal**: dos usuarios con la misma contraseña comparten hash y las tablas rainbow funcionan al instante. 3) **Guardé la contraseña en claro** en el log 'por si acaso'. 4) Comparé contraseñas en texto plano en el código, como si la base fuera un cuaderno. 5) **Cifré** la contraseña en vez de hashearla… y el atacante robó también la clave de cifrado."

**CONRAD:** — "Y lo mejor: *'pero SHA-1 sigue siendo rápido'*. ¡Pues claro! Rápido para ti y para el atacante. Seguridad no es velocidad: es resistencia. **SHA-256 con sal**, siempre."

**CONRAD:** — "Y no me vengas con *'¿será que los hashes se ven parecidos?'*. Los hashes no se parecen jamás: el efecto avalancha del [punto 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash) te garantiza que un bit distinto cambia todo. Si ves dos hashes parecidos, tienes un bug. A diagnosticar."

---

## ⚡ Laboratorio de Tortura: registro y login con sal

> **Duración:** 45 minutos
> **Herramienta:** Python 3 (`hashlib` y `os`, sin instalar nada)

**Escenario:** construye un mini sistema de registro y login en Python que guarde los usuarios en un diccionario en memoria (nada de base de datos: basta un `usuarios = {}`). Cada usuario debe almacenar `sal + hash` juntos, exactamente como en el [punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal).

**Tareas paso a paso:**

1. Define `registrar(usuario, contraseña)`: genera la sal con `os.urandom(16)`, calcula `hashlib.sha256(salt + contraseña.encode()).hexdigest()`, guarda en el diccionario `usuarios[usuario] = salt.hex() + hash`, y devuelve el string almacenado.
2. Define `login(usuario, contraseña)`: recupera el string del diccionario, extrae la sal con `bytes.fromhex(almacenado[:32])`, recalcula el hash del intento y compara con la parte de hash del string guardado.
3. Registra a dos usuarios con la **misma** contraseña y comprueba que sus hashes son distintos.
4. Haz login correcto y otro con contraseña equivocada: deben dar `✅` y `❌`.
5. Añade un `verificar_integridad(archivo)` que calcule el SHA-256 de un archivo y lo compare con un hash esperado (el [punto 8](/ApuntesPSP/08-hash-y-cifrado-clasico/08-buenas-practicas-y-verificacion)).

**Fallo intencionado:** en el `login`, en lugar de recuperar la sal del string almacenado, **genera una sal nueva** con `os.urandom(16)`. ¿Qué pasa? El hash del intento nunca coincide: cada login genera una sal distinta, así que recalculas con una sal que no es la del registro. Todos los logins fallan, incluso con la contraseña correcta.

> **Pista 1:** la sal debe ser **la misma** en el registro y en el login. Por eso se guarda junto al hash en el [punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal): `bytes.fromhex(almacenado[:32])` la recupera tal cual.
>
> **Pista 2:** si el fallo no se ve a simple vista, añade un `print(f"Sal usada en login: {salt.hex()[:8]}...")` y compáralo con la sal guardada en el registro. Si son distintas en cada intento, ese es el bug.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Huella Digital** | Calcular MD5, SHA-1, SHA-256 y SHA-512 de cualquier texto con `hashlib` |
| 🏅 **Vault Guardian** | Implementar registro y login con hash + sal en Python |
| 🏅 **Rainbow Breaker** | Explicar cómo la sal neutraliza las tablas rainbow |
| 🏅 **César Cracker** | Cifrar, descifrar y romper por fuerza bruta el cifrado César |

---

## 🧠 Atrévete a Pensar

1. ¿Por qué no se puede "descifrar" un hash, y qué alternativas reales le quedan al atacante?
2. ¿Qué pasaría si dos usuarios con la misma contraseña tuvieran el mismo hash en tu base de datos?
3. ¿Por qué descifrar un César con desplazamiento desconocido es trivial y no pasa lo mismo con SHA-256?
4. ¿Cuándo usarías cifrado en lugar de hash? Pon un ejemplo concreto.
5. ¿Qué diferencia hay entre verificar la integridad de un archivo y proteger su confidencialidad?

<details>
<summary>💡 Soluciones</summary>

1. El hash es **unidireccional**: no existe operación inversa. Al atacante le queda **adivinar**: fuerza bruta (probar contraseñas) o **tablas rainbow** (hashes precomputados). La sal y la longitud del hash hacen ambas inviables.
2. Sería una pista para el atacante de que comparten contraseña, y un golpe directo si consigue romper una: la otra cae también. La **sal** hace que hashes iguales no existan.
3. El César tiene solo **25 claves posibles**: probarlas todas es instantáneo. SHA-256 tiene un espacio de claves/entradas tan enorme que la fuerza bruta requeriría más intentos que átomos en el universo.
4. Cuando el destinatario **debe poder leer** el mensaje original: enviar un mensaje secreto, guardar datos que hay que recuperar (tarjetas, documentos). El hash solo sirve para verificar o para no recuperar (contraseñas).
5. **Integridad** = el archivo no fue modificado (se compara su hash). **Confidencialidad** = nadie no autorizado lo lee (se cifra). Son propiedades distintas y complementarias.
</details>

---

## 🧩 Crucigrama de Bits

```
Horizontal:
1. Función que convierte cualquier dato en una huella de longitud fija (4 letras)
4. Valor aleatorio que se mezcla con la contraseña antes de hashear (3 letras)
6. Algoritmo de 128 bits roto desde 2004 (3 letras)
8. Cifrado por desplazamiento de letras, el abuelo de la criptografía (5 letras)

Vertical:
2. Algoritmo seguro de 256 bits de la familia SHA-2 (5 letras)
3. Diccionario precomputado de hashes de contraseñas comunes (6 letras)
5. Propiedad del hash: un bit de cambio altera todo (9 letras)
7. Lo opuesto de cifrado: operación para recuperar el mensaje (8 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. HASH, 4. SAL, 6. MD5, 8. CESAR
**Vertical:** 2. SHA256, 3. RAINBOW, 5. AVALANCHA, 7. DESCIFRAR

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Cómo guardarías las contraseñas de tus usuarios en una base de datos?"**
2. **"¿Qué diferencia hay entre hash y cifrado? ¿Cuándo usarías cada uno?"**
3. **"¿Qué es el efecto avalancha y por qué importa en los hashes?"**
4. **"¿Qué es una tabla rainbow y cómo la neutraliza la sal?"**
5. **"¿Cómo verificas que un archivo descargado no fue manipulado?"**

> 💡 **Cómo encararlas:** la 1 y la 2 son las "preguntas reina". Para la 1, recorre la cadena del [punto 4](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas) y el [punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal): hash con sal (SHA-256), nunca la original, comparar hashes en el login. Para la 2, repite la moraleja del [punto 7](/ApuntesPSP/08-hash-y-cifrado-clasico/07-hash-vs-cifrado): hash → integridad, cifrado → confidencialidad. Si sabes contarlo fluido, ya eres medio desarrollador seguro.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Se puede descifrar un hash?**

No, el hash no se descifra (es unidireccional, como viste en el [punto 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash)). Pero se puede **adivinar** usando tablas rainbow o fuerza bruta. Por eso se usa **sal**: añadir un valor aleatorio antes de hashear vuelve inútiles ambos ataques. Un hash no se revierte: se intenta acertar la entrada.

> ❓ **¿Qué es una tabla rainbow?**

Una tabla precomputada de hashes para contraseñas comunes (123456, password, etc). Si tu hash está en la tabla, tu contraseña está comprometida. El **sal** lo evita porque añade aleatoriedad: el hash guardado ya no es el de la contraseña sola, sino el de `sal + contraseña`, que es único por usuario.

> ❓ **¿Qué pasa si dos usuarios tienen la misma contraseña?**

Sin sal, tendrían el mismo hash y un atacante lo sabría al instante. Con sal, aunque la contraseña sea la misma, los hashes son **diferentes** (mira el ejemplo de hash con sal del [punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal)). Nadie puede deducir que comparten clave.

> ❓ **¿Para qué sirve el hash de un archivo?**

Para verificar **integridad**. Descargas Ubuntu, verificas su SHA256, y si coincide con el de la web oficial, sabes que no lo han manipulado. Un solo bit distinto en el archivo produce un hash completamente diferente: esa es la señal de alarma.

---

## 🎬 Post-Créditos

> *La base de datos guarda solo hashes con sal. Nadie conoce las contraseñas, ni siquiera el servidor.*

*Un atacante roba la base de datos. Encuentra miles de huellas irreversibles e inútiles.*

*En su otra pantalla, un mensaje cifrado viaja seguro. El hash verificó que nadie lo tocó.*

*Las cerraduras se apilan. La casa sigue en pie.*

**PRÓXIMAMENTE EN U09:** *Cifrado moderno. El hash verifica, pero ¿cómo se envía un mensaje secreto que solo el destinatario pueda leer? AES y RSA.*

---

## ✅ Criterios de evaluación cubiertos (RA5)

**RA5: Implementa mecanismos de seguridad que garanticen la integridad y la confidencialidad de los datos.**

| CE | Criterio | Cubierto |
|---|---|---|
| a) | Principios básicos de seguridad | ✅ Principios (punto 1) + hash vs cifrado (punto 7) |
| c) | Implementa funciones hash (MD5, SHA) | ✅ Puntos 2-5 + ⚡ Laboratorio de Tortura |
| h) | Conoce sistemas de roles y RBAC | ✅ Mínimo privilegio (punto 1) |

> RA5b (tipos de cifrado), RA5d (AES), RA5e (RSA), RA5f (firmas digitales) y RA5g (cifrado híbrido) se cubren en la **U09 · Cifrado Moderno**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-hash-y-cifrado-clasico) · **Anterior:** [08 · Buenas prácticas y verificación](/ApuntesPSP/08-hash-y-cifrado-clasico/08-buenas-practicas-y-verificacion) · **Siguiente:** **[U09 · Cifrado Moderno](/ApuntesPSP/09-cifrado-moderno)**