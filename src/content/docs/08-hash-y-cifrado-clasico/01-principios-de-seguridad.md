---
title: 01 — Principios de seguridad
description: "La base de todo: cero confianza y defensa en profundidad 🛡️"
---

<p><small>La base de todo: cero confianza y defensa en profundidad 🛡️</small></p>

> 🗺️ **Estás en:** 🔐 **U08 · Hash y Cifrado Clásico** → 01 · Principios de seguridad

---

## 📬 La idea en una frase

> Antes de cifrar una sola letra, tienes que interiorizar los **principios de seguridad**: si no entiendes por qué se hace algo, cualquier herramienta que aprendas después será un martillo mal usado.

Los algoritmos cambian (MD5 cayó, SHA-1 cayó, algún día caerá SHA-256), pero los principios son eternos. Son las reglas del oficio que distinguen a quien "copia código" de quien diseña sistemas seguros.

---

## 🏰 Los seis principios que no puedes olvidar

| Principio | Traducción al español de la calle |
|-----------|-----------------------------------|
| **Zero Trust** | No te fíes ni de tu sombra. Verifica siempre. |
| **Mínimo privilegio** | Da solo los permisos mínimos necesarios. |
| **Defensa en profundidad** | No pongas toda la seguridad en una capa. |
| **Cifra todo** | En tránsito (TLS) y en reposo (disco). |
| **Rotación de claves** | Cambia las claves periódicamente. |
| **No inventes tu cripto** | Las bibliotecas existentes ya han sido auditadas. |

**Desglose de cada uno:**

- **Zero Trust** — La red interna no es de fiar por defecto. Un usuario autenticado hoy puede ser un atacante mañana. Por eso cada operación sensible se vuelve a verificar. En esta unidad lo ves con los hashes: ni siquiera confiamos en nuestra propia base de datos, por eso no guardamos contraseñas en claro.
- **Mínimo privilegio** — Nadie debería tener más acceso del que necesita para su trabajo. Un becario no necesita borrar la tabla de usuarios. Esto conecta directamente con **RBAC** (Control de Acceso Basado en Roles): a cada rol le toca un paquete de permisos, y nadie se sale del suyo. Lo verás a fondo en la [U09 · Cifrado Moderno](/ApuntesPSP/09-cifrado-moderno), pero el principio lo aplicas ya.
- **Defensa en profundidad** — Si solo tienes una cerradura, alguien con la llave abre la casa entera. La seguridad real apila capas: contraseña con hash + sal, cifrado en disco, firewall, logs. Si una capa cae, las demás siguen.
- **Cifra todo** — Los datos viajan por la red (en tránsito, con TLS) y descansan en el disco (en reposo). En esta unidad ciframos en reposo las contraseñas con hash; en la U09 cifrarás mensajes completos con AES y RSA.
- **Rotación de claves** — Una clave que lleva 5 años en uso es una clave comprometida. Igual que cambias la cerradura cuando se pierde una copia, las claves y contraseñas se renuevan periódicamente.
- **No inventes tu cripto** — La tentación de escribir "mi propio algoritmo" es enorme… y siempre termina mal. Las bibliotecas como `hashlib` o `pycryptodome` llevan décadas siendo atacadas y parcheadas. Tú no puedes hacer eso en un finde.

---

## 🔑 La analogía de las cerraduras de una casa

Imagina tu casa como un sistema informático. Las **cerraduras** son los mecanismos de seguridad: la puerta principal (contraseña), la alarma (detección de intrusos), la caja fuerte (cifrado de datos sensibles).

- Poner una sola cerradura en la puerta y nada más es **seguridad de una capa**: si alguien copia la llave, entra y listo.
- Dejar la llave bajo el felpudo es el equivalente a guardar contraseñas en **texto plano**: la seguridad existe, pero no sirve de nada.
- Tener cerradura **y** alarma **y** caja fuerte es **defensa en profundidad**: aunque salten la primera, la segunda los delata y la tercera los frena.
- Y lo más importante: **ningún cerrajero serio diseña su propia cerradura desde cero**; compra una certificada. Eso es *no inventes tu cripto*.

> Cuando en el [punto 4](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas) guardes una contraseña con hash, estarás instalando una cerradura decente. Cuando añadas **sal** en el [punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal), estarás poniendo la segunda vuelta.

---

## 📖 La cita que debes saber

> "La seguridad no es un producto, es un proceso." — Bruce Schneier

No es un interruptor que enciendes y olvidas: es una disciplina continua de revisar, parchear, rotar y auditar. Por eso existen los principios: para que el proceso nunca se detenga.

---

## 🧠 Mini-chequeo

1. ¿Por qué "no inventes tu cripto" es un principio y no una sugerencia?
2. ¿Qué relación hay entre "mínimo privilegio" y RBAC?
3. ¿Por qué el cifrado se aplica "en tránsito" y "en reposo"?

<details>
<summary>🔄 Respuestas</summary>

1. Porque la criptografía necesita **años de ataques y auditorías** para ser fiable. Tu algoritmo casero puede tener una puerta trasera que ni tú conoces. Las bibliotecas estándar (`hashlib`, `pycryptodome`) ya pasaron ese proceso.
2. RBAC es la herramienta: se definen **roles** y cada rol tiene los permisos mínimos de su función. El principio dice *da solo lo necesario*; RBAC dice *cómo* hacerlo de forma ordenada.
3. Porque los datos se mueven y se guardan. **En tránsito** viajan por la red (TLS protege eso); **en reposo** descansan en discos y bases de datos (cifrado de disco o de campos, como los hashes de contraseña).
</details>

---

## ✅ Resumen en 3 frases

- La seguridad real se construye sobre **principios** (Zero Trust, mínimo privilegio, defensa en profundidad), no sobre herramientas sueltas.
- **No inventes tu cripto**: usa bibliotecas auditadas, cifra todo y rota las claves.
- Estos principios son el filtro con el que evaluarás cada decisión del resto de la unidad (y de tu vida como programador).

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Zero Trust | No confiar en nadie por defecto; verificar siempre |
| Mínimo privilegio | Cada usuario solo con los permisos que necesita |
| Defensa en profundidad | Varias capas de seguridad independientes |
| RBAC | Control de acceso por roles (a cada rol, sus permisos) |
| Rotación de claves | Renovar claves/contraseñas periódicamente |
| Cifrado en tránsito / en reposo | Proteger datos mientras viajan / mientras se guardan |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-hash-y-cifrado-clasico) · **Siguiente:** [02 · Qué es un hash](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash)
