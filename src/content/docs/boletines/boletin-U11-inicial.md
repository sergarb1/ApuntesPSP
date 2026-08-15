---
title: Boletín U11 — Inicial
description: Ejercicios básicos de asyncio y Disponibilidad
---

# 📝 Boletín U11 — Inicial

> Ejercicios básicos para afianzar los conceptos de asyncio: corrutinas, el event loop, gather, las tareas en segundo plano y los primeros mecanismos de disponibilidad.

---

## 1. Mensaje diferido

Crea una corrutina `async def preparar()` que imprima "Preparando...", espere 2 segundos con `await asyncio.sleep(2)`, e imprima "¡Listo!". Ejecútala con `asyncio.run()`.

## 2. Saludo y despedida

Crea dos corrutinas: `saludar()` (espera 0.5s y dice "Hola") y `despedirse()` (espera 1s y dice "Adiós"). Ejecuta ambas con `asyncio.gather`.

## 3. Temporizador

Crea una corrutina que imprima "tic" cada 2 segundos, 4 veces. Usa `asyncio.sleep(2)` dentro de un bucle `for`.

## 4. Corrutina que devuelve

Crea una corrutina `sumar(a, b)` que espere 1 segundo y devuelva `a + b`. Lánzala y muestra el resultado.

**Pista:** llamar a una corrutina no ejecuta su cuerpo: devuelve un objeto corrutina. Para obtener el resultado usa `await sumar(3, 4)` dentro de una corrutina `main()` y ejecuta con `asyncio.run(main())`.

## 5. Tres tareas a la vez

Crea 3 corrutinas que esperen 1, 2 y 3 segundos. Lánzalas con `asyncio.gather` y mide el tiempo total con `time.time()`. ¿Cuánto dura en vez de 6 segundos?

**Pista:** con `gather` el total es el de la tarea más lenta (3s), no la suma. Guarda `inicio = time.time()` antes del `gather` y resta después.

## 6. Tarea en segundo plano

Crea una corrutina `contar()` que imprima un número cada 0.5s (hasta 4). Lánzala con `asyncio.create_task` desde una corrutina `main()` que haga `await asyncio.sleep(1)` y luego imprima "main sigue". ¿Qué se imprime mientras tanto?

## 7. Heartbeat básico

Crea una corrutina heartbeat que imprima "💓 vivo" cada 2 segundos. Lánzala con `create_task` desde `main()` y deja que `main()` espere 5 segundos antes de terminar.

**Pista:** el heartbeat es un `while True` con `await asyncio.sleep(2)`. `main()` debe esperar (`await asyncio.sleep(5)`) o la tarea de fondo muere con él.

## 8. Timeout básico

Crea una corrutina `lenta()` que tarde 8 segundos y devuelva "Hecho". Usa `asyncio.wait_for` con timeout de 3s y muestra qué excepción salta y qué imprime tu `except`.

**Pista:** `asyncio.wait_for(lenta(), timeout=3)` lanza `asyncio.TimeoutError` al pasar los 3 segundos y cancela la corrutina lenta.