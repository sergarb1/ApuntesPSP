---
title: U09 — Cifrado Moderno
description: AES, RSA y firmas digitales para proteger el mensaje 🧬
nav_order: 09
---

<p><small>AES, RSA y firmas digitales para proteger el mensaje 🧬</small></p>

> 🗺️ **Ruta del viaje:** 🚀 Proceso → 🔀 Hilo → 🔒 Sincronización → 🔌 TCP → 📡 UDP → 🌐 API REST → 🧪 APIs comerciales → 🔐 Hash → 🧬 **Cifrado Moderno** → 🏗️ Servidores → ⏱️ asyncio

---

En la U08 aprendiste a hashear: a convertir una contraseña en una huella digital irrepetible. Pero el hash no se puede deshacer: es unidireccional. ¿Y si quieres enviar un mensaje secreto que el destinatario sí pueda leer? Ahí entra el **cifrado moderno**: con **AES** (rápido y simétrico) y **RSA** (lento y elegante) podrás cifrar, descifrar, firmar y verificar mensajes, tal y como lo hacen HTTPS, WhatsApp o Signal cada segundo.

Aprenderás también el **cifrado híbrido** (lo mejor de ambos mundos: RSA reparte la clave, AES cifra el tráfico), las **firmas digitales** para demostrar quién creó un mensaje y el **control de acceso RBAC** para decidir quién puede hacer qué. Es la otra mitad de la seguridad que empezaste en la [U08 · Hash y Cifrado Clásico](/ApuntesPSP/08-hash-y-cifrado-clasico).

Esta unidad se lee como un **libro de 9 capítulos**: los 8 primeros son teoría en progresión y el 9º aterriza todo en la práctica.

---

## 🎯 Objetivo de la unidad

Al terminar, serás capaz de:

- Distinguir el cifrado **simétrico** (una clave) del **asimétrico** (par público/privado) y saber cuándo usar cada uno.
- Cifrar y descifrar con **AES** (modos EAX, ECB, CBC, GCM) usando `pycryptodome`.
- Explicar qué son el **nonce**, el **tag** y el **padding** y por qué hay que enviarlos junto al cifrado.
- Generar pares de claves **RSA** de 2048 bits y cifrar/descifrar con clave pública y privada.
- **Firmar** digitalmente un mensaje con tu clave privada y **verificar** la firma con la clave pública del firmante.
- Diseñar un **cifrado híbrido** AES + RSA, el método que usa HTTPS.
- Implementar un sistema **RBAC** de roles y permisos.
- Construir un mini sistema seguro completo que cifre, descifre, firme y verifique.

---

## 🗺️ Mapa de la unidad

| Punto | Qué aprenderás | Nivel |
|---|---|---|
| [01 · Cifrado simétrico vs asimétrico](/ApuntesPSP/09-cifrado-moderno/01-cifrado-simetrico-vs-asimetrico) | Una clave o un par: cuándo usar cada uno | Todos |
| [02 · AES](/ApuntesPSP/09-cifrado-moderno/02-aes) | El cifrado simétrico moderno con `pycryptodome`, nonce y tag | Todos |
| [03 · Modos de AES](/ApuntesPSP/09-cifrado-moderno/03-modos-aes) | ECB, CBC y GCM: cómo se aplica el bloque, IV y padding | Todos |
| [04 · RSA](/ApuntesPSP/09-cifrado-moderno/04-rsa) | Generar el par de claves y cifrar con la pública | Todos |
| [05 · Firmas digitales](/ApuntesPSP/09-cifrado-moderno/05-firmas-digitales) | Firmar y verificar: integridad + autenticidad | Todos |
| [06 · Cifrado híbrido](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido) | AES + RSA: el método que usa HTTPS | Todos |
| [07 · RBAC y roles](/ApuntesPSP/09-cifrado-moderno/07-rbac-y-roles) | Control de acceso basado en roles | Todos |
| [08 · Práctica: sistema seguro](/ApuntesPSP/09-cifrado-moderno/08-practica-sistema-seguro) | Cifrar y firmar un sistema completo | Todos |
| [09 · Cierre](/ApuntesPSP/09-cifrado-moderno/09-cierre) | Sé la clave, Fireside, Laboratorio, Crucigrama… | Todos |

> 📖 **Flujo de lectura:** los 8 primeros puntos son teoría en progresión. El 9º es el aterrizaje práctico: léelo justo después del 8º y antes de abrir los boletines.

---

## 📝 Boletines de la unidad

> Practica con los pares del curso: empezar siempre el resuelto para ver el estilo y luego intentar el por-resolver.

<div class="ejercicio-links">
  <a href="/ApuntesPSP/boletines/boletin-u09-inicial-resuelto" class="elink">✅ Inicial resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u09-inicial" class="elink">🟢 Inicial por resolver</a>
  <a href="/ApuntesPSP/boletines/boletin-u09-avanzado-resuelto" class="elink">💪 Avanzado resuelto</a>
  <a href="/ApuntesPSP/boletines/boletin-u09-avanzado" class="elink">⭐ Avanzado por resolver</a>
</div>

---

## ✅ Criterios de evaluación cubiertos (RA5)

**RA5: Implementa mecanismos de seguridad que garanticen la integridad y la confidencialidad de los datos.**

| CE | Criterio | Dónde se cubre |
|---|---|---|
| a) | Principios básicos de seguridad | ✅ Puntos 1 y 7 (mínimo privilegio) |
| b) | Tipos de cifrado (simétrico, asimétrico) | ✅ Puntos 1, 2 y 4 |
| c) | Implementa funciones hash (MD5, SHA) | ✅ Cubierto en la U08 |
| d) | AES | ✅ Puntos 2-3 + ⚡ Laboratorio (punto 9) |
| e) | RSA | ✅ Puntos 4-5 + ⚡ Laboratorio (punto 9) |
| f) | Firmas digitales | ✅ Punto 5 + ⚡ Laboratorio (punto 9) |
| g) | Cifrado híbrido | ✅ Punto 6 + ⚡ Laboratorio (punto 9) |
| h) | Conoce sistemas de roles y RBAC | ✅ Punto 7 |

---

## 🚪 ¿Por dónde empiezo?

¿Vienes de la U08 y dominas el hash y el cifrado César? Perfecto, este tema es la evolución natural: ya sabes verificar integridad con SHA-256 y distinguir cuándo toca hash y cuándo cifrar. Repasa la [U08 · Hash y Cifrado Clásico](/ApuntesPSP/08-hash-y-cifrado-clasico) para tener fresco el principio de *mínimo privilegio* y el de *no inventes tu cripto*, y arranca en el [punto 1](/ApuntesPSP/09-cifrado-moderno/01-cifrado-simetrico-vs-asimetrico), que parte justo de la pregunta: ¿una clave o dos?

¿Ya sabes qué es AES y RSA y solo necesitas las firmas o el híbrido? Puedes saltar a los [puntos 5](/ApuntesPSP/09-cifrado-moderno/05-firmas-digitales) y [6](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido). Pero si vienes de cero en criptografía moderna, no te saltes los puntos 1 a 4: entender la diferencia simétrico/asimétrico y cómo se cifra con cada uno es la base de todo lo demás.

**📍 Primer punto:** [01 · Cifrado simétrico vs asimétrico](/ApuntesPSP/09-cifrado-moderno/01-cifrado-simetrico-vs-asimetrico)  
**⏭️ Al acabar la unidad, continúa en [U10 · Servidores Concurrentes](/ApuntesPSP/10-servidores-concurrentes).**