---
title: U08 — Hash y Cifrado Clásico
description: La huella digital que protege tus contraseñas 🔐
nav_order: 08
---

<p><small>La huella digital que protege tus contraseñas 🔐</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 **Hash y Cifrado Clásico** → 🧬 Cifrado → 🏗️ Servidores → ⏱️ asyncio

---

Cada vez que escribes una contraseña en un formulario, un servidor decide si es la correcta sin saber cuál es. ¿Cómo es posible? Gracias al **hash**: una función que convierte cualquier texto en una huella digital imposible de revertir. En esta unidad aprenderás a usar MD5, SHA-1 y SHA-256 para guardar contraseñas sin riesgo, a protegerlas con **sal** frente a tablas rainbow, y conocerás al abuelo de todos los cifrados: el **César**.

Entenderás también los **principios de seguridad** que sostienen todo el edificio (Zero Trust, mínimo privilegio, defensa en profundidad) y sabrás distinguir cuándo toca hashear (integridad, contraseñas) y cuándo cifrar (confidencialidad). El siguiente tema, [U09 · Cifrado Moderno](/ApuntesPSP/09-cifrado-moderno), tomará el relevo con AES y RSA, que sí se pueden deshacer con una clave.

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es un hash, sus propiedades (determinismo, unidireccionalidad, longitud fija, efecto avalancha) y su papel como huella digital.
- Comparar MD5, SHA-1, SHA-256 y SHA-512 con criterio, sabiendo cuáles están rotos y cuáles son seguros.
- Diseñar un sistema de **registro/login** que almacene solo hashes, nunca la contraseña original.
- Explicar la **sal** (salt) y cómo neutraliza las tablas rainbow.
- Cifrar y descifrar con el **cifrado César**, y romperlo por fuerza bruta en 25 intentos.
- Distinguir cuándo usar hash (integridad) y cuándo cifrado (confidencialidad).
- Verificar la integridad de un archivo con su checksum SHA-256.
- Aplicar los principios básicos de seguridad (Zero Trust, mínimo privilegio, defensa en profundidad) a cualquier sistema.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Principios de seguridad](/ApuntesPSP/08-hash-y-cifrado-clasico/01-principios-de-seguridad) | La base de todo: cero confianza, mínimo privilegio y defensa en profundidad | Todos |
| [02 · Qué es un hash](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash) | La huella digital y sus propiedades, con `hashlib` en acción | Todos |
| [03 · MD5, SHA-1 y SHA-256](/ApuntesPSP/08-hash-y-cifrado-clasico/03-md5-sha1-sha256) | Tabla comparativa, hash de archivos y cuál usar hoy | Todos |
| [04 · Hash de contraseñas](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas) | Registro y login guardando solo la huella, nunca la original | Todos |
| [05 · Hash con sal](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal) | Cómo la sal arruina las tablas rainbow (y el Pool Puzzle) | Todos |
| [06 · Cifrado César](/ApuntesPSP/08-hash-y-cifrado-clasico/06-cifrado-cesar) | El abuelo de la criptografía, paso a paso y por fuerza bruta | Todos |
| [07 · Hash vs Cifrado](/ApuntesPSP/08-hash-y-cifrado-clasico/07-hash-vs-cifrado) | El ring: integridad contra confidencialidad | Todos |
| [08 · Buenas prácticas y verificación](/ApuntesPSP/08-hash-y-cifrado-clasico/08-buenas-practicas-y-verificacion) | Checksums de descargas, cuándo hash y cuándo cifrar, ejercicios | Todos |
| [09 · Cierre](/ApuntesPSP/08-hash-y-cifrado-clasico/09-cierre) | Sé el Hash, Fireside, Laboratorio de Tortura, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u08-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u08-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u08-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u08-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA5)

**RA5: Implementa mecanismos de seguridad que garanticen la integridad y la confidencialidad de los datos.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Principios básicos de seguridad | ✅ Punto 1 + Punto 7 |
| c) | Implementa funciones hash (MD5, SHA) | ✅ Puntos 2-5 + ⚡ Laboratorio (punto 9) |
| h) | Conoce sistemas de roles y RBAC | ✅ Punto 1 (principios: mínimo privilegio) |

> RA5b (tipos de cifrado), RA5d (AES), RA5e (RSA), RA5f (firmas digitales) y RA5g (cifrado híbrido) se cubren en la **U09 · Cifrado Moderno**.

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U07 y dominas las APIs comerciales? Perfecto, este tema no necesita nada de lo anterior: la seguridad es un campo nuevo y autónomo. Si además ya sabes qué es una API key y por qué no debe ir en el código, tienes el chip mental adecuado: en esta unidad verás por qué tampoco se guardan las contraseñas en claro. Arranca en el [punto 1](/ApuntesPSP/08-hash-y-cifrado-clasico/01-principios-de-seguridad), que sienta los cimientos de todo lo demás.

¿Ya sabes qué es un hash y solo necesitas el César o el diseño de contraseñas? Puedes saltar a los [puntos 4](/ApuntesPSP/08-hash-y-cifrado-clasico/04-hash-de-contrasenas), [5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal) y [6](/ApuntesPSP/08-hash-y-cifrado-clasico/06-cifrado-cesar). Pero si vienes de cero en criptografía, no te saltes los puntos 1 a 3: las propiedades del hash y la comparativa de algoritmos son la base de todo el módulo.

**📍 Primer punto:** [01 · Principios de seguridad](/ApuntesPSP/08-hash-y-cifrado-clasico/01-principios-de-seguridad)  
**⏭️ Al acabar la unidad, continúa en [U09 · Cifrado Moderno](/ApuntesPSP/09-cifrado-moderno).**
