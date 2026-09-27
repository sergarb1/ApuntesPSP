---
title: UD 9 — Seguridad y cifrado con Python
description: "Hash, cifrado simétrico y asimétrico, firmas digitales 🔐"
nav_order: 08
---

<p><small>Hash, cifrado simétrico y asimétrico, firmas digitales 🔐</small></p>

---

Cada vez que escribes una contraseña en un formulario, un servidor decide si es la correcta sin saber cuál es. ¿Cómo es posible? Gracias al **hash**: una función que convierte cualquier texto en una huella digital imposible de revertir. Pero la seguridad no termina ahí: también necesitas **cifrar** datos para que solo el destinatario pueda leerlos, **firmar** documentos para demostrar que son tuyos y proteger sistemas con principios como el mínimo privilegio.

Esta unidad fusiona hash y cifrado en un solo bloque: empezarás con las funciones hash (MD5, SHA-256) y las contraseñas seguras, pasarás al cifrado clásico (César) y moderno (AES, RSA), verás las firmas digitales y el cifrado híbrido, y cerrarás con un sistema seguro completo.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Explicar qué es un **hash** y sus propiedades (determinismo, unidireccionalidad, longitud fija).
- Comparar MD5, SHA-1, SHA-256 y SHA-512 con criterio.
- Diseñar un sistema de registro/login que almacene solo hashes.
- Explicar la **sal** y cómo neutraliza las tablas rainbow.
- Cifrar y descifrar con el **cifrado César**.
- Distinguir cuándo usar hash (integridad) y cuándo cifrado (confidencialidad).
- Cifrar y descifrar con **AES** (simétrico) usando `cryptography`.
- Cifrar y descifrar con **RSA** (asimétrico) usando `cryptography`.
- Crear y verificar **firmas digitales**.
- Implementar **cifrado híbrido** (AES + RSA).
- Aplicar principios de seguridad: Zero Trust, mínimo privilegio, defensa en profundidad.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Principios de seguridad](/ApuntesPSP/08-seguridad-y-cifrado/01-principios-de-seguridad) | Zero Trust, mínimo privilegio, defensa en profundidad | Todos |
| [02 · Hash y huellas digitales](/ApuntesPSP/08-seguridad-y-cifrado/02-hash-y-huellas-digitales) | `hashlib`, MD5, SHA-1, SHA-256, SHA-512 | Todos |
| [03 · Contraseñas seguras](/ApuntesPSP/08-seguridad-y-cifrado/03-contrasenas-seguras) | Hash de contraseñas, sal, registro/login | Todos |
| [04 · Cifrado clásico](/ApuntesPSP/08-seguridad-y-cifrado/04-cifrado-clasico) | César, fuerza bruta, hash vs cifrado | Todos |
| [05 · Cifrado simétrico (AES)](/ApuntesPSP/08-seguridad-y-cifrado/05-cifrado-simetrico-aes) | AES con `cryptography`, modos de operación | Todos |
| [06 · Cifrado asimétrico (RSA)](/ApuntesPSP/08-seguridad-y-cifrado/06-cifrado-asimetrico-rsa) | RSA, claves pública/privada | Todos |
| [07 · Firmas digitales](/ApuntesPSP/08-seguridad-y-cifrado/07-firmas-digitales) | Firmar y verificar con RSA | Todos |
| [08 · Cifrado híbrido y práctica](/ApuntesPSP/08-seguridad-y-cifrado/08-cifrado-hibrido-y-practica) | AES+RSA, RBAC, sistema seguro completo | Todos |
| [09 · Cierre](/ApuntesPSP/08-seguridad-y-cifrado/09-cierre) | Sé el cifrado, Fireside, Laboratorio de tortura… | Todos |

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u08-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u08-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u08-avanzado" class="elink">⭐ Avanzado por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u08-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA5)

**RA5: Implementa mecanismos de seguridad que garanticen integridad y confidencialidad.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| RA5a | Principios básicos de seguridad | ✅ Punto 1 |
| RA5b | Tipos de cifrado (simétrico/asimétrico) | ✅ Puntos 4-6 |
| RA5c | Implementa funciones hash (MD5, SHA) | ✅ Puntos 2-3 + ⚡ Laboratorio (punto 9) |
| RA5d | Implementa cifrado AES | ✅ Punto 5 + ⚡ Laboratorio (punto 9) |
| RA5e | Implementa cifrado RSA | ✅ Punto 6 + ⚡ Laboratorio (punto 9) |
| RA5f | Crea y verifica firmas digitales | ✅ Punto 7 |
| RA5g | Implementa cifrado híbrido | ✅ Punto 8 |
| RA5h | Conoce sistemas de roles y RBAC | ✅ Punto 8 |

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la UD 8 y dominas APIs? Empieza por el [punto 1](/ApuntesPSP/08-seguridad-y-cifrado/01-principios-de-seguridad), que sienta los cimientos.

¿Ya sabes qué es un hash? Saltar a los [puntos 4](/ApuntesPSP/08-seguridad-y-cifrado/04-cifrado-clasico), [5](/ApuntesPSP/08-seguridad-y-cifrado/05-cifrado-simetrico-aes) o [6](/ApuntesPSP/08-seguridad-y-cifrado/06-cifrado-asimetrico-rsa).

**📍 Primer punto:** [01 · Principios de seguridad](/ApuntesPSP/08-seguridad-y-cifrado/01-principios-de-seguridad)
**⏭️ Al acabar la unidad, continúa en [UD 10 · Alta disponibilidad](/ApuntesPSP/09-alta-disponibilidad).**
