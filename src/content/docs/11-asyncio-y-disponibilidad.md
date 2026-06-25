---
title: "TEMA 11 — Asyncio y Disponibilidad"
nav_order: 11
---

## TEMA 11 — Asyncio y Disponibilidad (RA4e-g)

> "Asyncio es como un cocinero que, mientras espera a que hierva el agua, corta verduras. En vez de quedarse mirando la olla, hace otras cosas."

---

## Índice

1. [El problema de esperar](#el-problema-de-esperar)
2. [Asyncio — fundamentos](#asyncio--fundamentos)
3. [Corrutinas y event loop](#corrutinas-y-event-loop)
4. [Servidor con asyncio](#servidor-con-asyncio)
5. [Be the code, my friend, my friend — Asyncio paso a paso](#be-the-code-my-friend-my-friend--asyncio-paso-a-paso)
6. [Disponibilidad — heartbeat](#disponibilidad--heartbeat)
7. [Reintentos con backoff](#reintentos-con-backoff)
8. [Timeout en servidor](#timeout-en-servidor)
9. [🥊 El ring de los conceptos — Threads vs Asyncio](#el-ring-de-los-conceptos--threads-vs-asyncio)
10. [Preguntas tontas — Asyncio](#preguntas-tontas--asyncio)
11. [✏️ Aprieta el lápiz](#✏-aprieta-el-lápiz)
12. [RAs cubiertos y criterios de evaluación](#ras-cubiertos-y-criterios-de-evaluación)

---

## El problema de esperar

Un servidor que usa `accept()` y `recv()` se **bloquea** mientras espera. No puede hacer nada más.

```python
# ❌ Esto bloquea TODO el programa
datos = conn.recv(1024)  # El programa se para aquí hasta que lleguen datos
```

**Solución 1**: Hilos (TEMA 10) — caros si hay muchos clientes.

**Solución 2**: Asyncio — un solo hilo, pero cambia de tarea cuando una espera.

---

## Asyncio — fundamentos

```python
import asyncio

async def saludar():
    print("Hola")
    await asyncio.sleep(1)  # "Oye, mientras duermo, haz otras cosas"
    print("Mundo")

asyncio.run(saludar())
```

| Concepto | Qué es |
|----------|--------|
| `async def` | Define una **corrutina** (función que puede pausarse) |
| `await` | Pausa la corrutina hasta que algo termine |
| `asyncio.run()` | Crea el event loop y ejecuta la corrutina principal |

> `await = "Oye, esto va a tardar. Mientras, ocúpate de otras cosas."`

---

## Corrutinas y event loop

El **event loop** es el gestor. Decide qué corrutina ejecuta en cada momento.

```python
import asyncio

async def tarea(nombre, segundos):
    print(f"  {nombre} empieza")
    await asyncio.sleep(segundos)
    print(f"  {nombre} termina ({segundos}s)")

async def main():
    # Lanzar 3 tareas "a la vez"
    await asyncio.gather(
        tarea("A", 3),
        tarea("B", 1),
        tarea("C", 2)
    )

asyncio.run(main())
```

**Salida**:
```
  A empieza
  B empieza
  C empieza
  B termina (1s)
  C termina (2s)
  A termina (3s)
```

> Las 3 empiezan a la vez. B termina primero (solo 1s). El event loop aprovecha los `await` de otras para avanzar.

---

## Servidor con asyncio

```python
import asyncio

async def atender(reader, writer):
    addr = writer.get_extra_info('peername')
    print(f"[+] Cliente {addr} conectado")

    datos = await reader.read(1024)
    print(f"    Recibido: {datos.decode()}")

    writer.write(b"OK: " + datos)
    await writer.drain()  # Espera a que se envíe

    writer.close()
    await writer.wait_closed()
    print(f"[-] Cliente {addr} desconectado")

async def main():
    servidor = await asyncio.start_server(atender, "127.0.0.1", 5000)
    print("🚀 Servidor ASYNCIO en 127.0.0.1:5000")

    async with servidor:
        await servidor.serve_forever()

asyncio.run(main())
```

> Con asyncio, un solo hilo puede atender miles de conexiones. Cada `await` es una oportunidad para atender a otro cliente.

---

## Be the code, my friend, my friend — Asyncio paso a paso

> "Sé el event loop. Tu trabajo es coordinar corrutinas sin bloquear ni un milisegundo."

```
Event Loop arranca
│
├── 1. Ejecuta main()
│      ├── Crea servidor TCP
│      └── Registra atender() para nuevos clientes
│
├── 2. Event Loop: "Espero eventos... (I/O, timers, etc.)"
│
├── [Cliente-1 conecta]
│  3. Event Loop: "¡Cliente nuevo! Ejecuto atender(cliente1)"
│  4. atender(cliente1) empieza
│  5. await reader.read() → "No hay datos aún"
│  6. atender(cliente1) se pausa (cede el control)
│
├── [Cliente-2 conecta mientras cliente1 espera]
│  7. Event Loop: "¡Otro cliente! Ejecuto atender(cliente2)"
│  8. atender(cliente2) empieza
│  9. await reader.read() → "Tampoco hay datos"
│ 10. atender(cliente2) se pausa
│
├── [Cliente-1 envía datos]
│ 11. Event Loop: "Cliente1 tiene datos → reanudo atender(cliente1)"
│ 12. atender(cliente1) recibe los datos
│ 13. writer.write() → escribe buffer
│ 14. await writer.drain() → espera envío → se pausa
│
├── [Cliente-2 envía datos]
│ 15. Event Loop: "Cliente2 tiene datos → reanudo atender(cliente2)"
│ 16. atender(cliente2) recibe, responde, termina 🏁
│
├── [writer.drain() de cliente1 listo]
│ 17. Event Loop: "Cliente1 puede finalizar"
│ 18. atender(cliente1) termina 🏁
│
└── Event Loop sigue esperando más clientes...
```

> Nunca hay espera activa. Cuando una corrutina espera, otra aprovecha. **Un solo hilo, miles de conexiones.**

---

## Disponibilidad — heartbeat

Un **heartbeat** (latido) es un mensaje periódico para verificar que el servidor sigue vivo.

```python
import asyncio

async def heartbeat(intervalo=5):
    while True:
        print("💓 Heartbeat: servidor vivo")
        await asyncio.sleep(intervalo)

async def servidor_con_heartbeat():
    # Lanzar heartbeat en segundo plano
    asyncio.create_task(heartbeat())

    servidor = await asyncio.start_server(
        lambda r, w: None, "127.0.0.1", 5000
    )
    async with servidor:
        await servidor.serve_forever()

asyncio.run(servidor_con_heartbeat())
```

---

## Reintentos con backoff

```python
import asyncio

async def conectar_con_backoff(host, port, max_intentos=5):
    for intento in range(max_intentos):
        try:
            reader, writer = await asyncio.wait_for(
                asyncio.open_connection(host, port),
                timeout=3
            )
            print(f"✅ Conectado a {host}:{port}")
            return reader, writer
        except (asyncio.TimeoutError, ConnectionRefusedError):
            espera = 2 ** intento  # 1, 2, 4, 8, 16 segundos
            print(f"⚠️ Intento {intento+1} fallido. Esperando {espera}s...")
            await asyncio.sleep(espera)

    raise Exception("No se pudo conectar")
```

> El **backoff exponencial** evita saturar un servidor que ya está teniendo problemas.

---

## Timeout en servidor

```python
import asyncio

async def atender_con_timeout(reader, writer):
    try:
        # Esperar datos con timeout de 10 segundos
        datos = await asyncio.wait_for(reader.read(1024), timeout=10)
        writer.write(b"OK: " + datos)
        await writer.drain()
    except asyncio.TimeoutError:
        writer.write(b"⏱ Timeout: conexión cerrada por inactividad\n")
        await writer.drain()
    finally:
        writer.close()
        await writer.wait_closed()
```

---

## 🥊 El ring de los conceptos — Threads vs Asyncio

**Thread**: "Yo soy multitarea de verdad. Tengo mi propia pila, mi propio contexto. El SO me gestiona."

**Asyncio**: "Yo soy multitarea cooperativa. Un solo hilo, pero cambio de tarea cuando una espera."

**Thread**: "Si tengo 10.000 clientes, creo 10.000 hilos. El sistema sufre."

**Asyncio**: "Yo con 10.000 clientes uso un hilo y 10.000 corrutinas. Mucho más ligero."

**Thread**: "Pero mis operaciones son bloqueantes de verdad. Si llamo a `time.sleep()`, otro hilo ejecuta."

**Asyncio**: "Mis operaciones son `await` — nunca bloqueo. El event loop decide qué toca."

**Thread**: "Para servidores pequeños (<100 clientes), soy más simple."

**Asyncio**: "Para servidores con mucho I/O y muchas conexiones, soy imbatible."

| Característica | Threads | Asyncio |
|----------------|---------|---------|
| Nº de hilos | Varios (gestión del SO) | 1 (event loop) |
| Cambio de contexto | Gestionado por el SO | Cooperativo (en await) |
| Escalabilidad | Media (límite de hilos) | Alta (miles de conexiones) |
| Complejidad | Baja (simple) | Media (curva de aprendizaje) |
| CPU-bound | No sirve (GIL) | No sirve |
| I/O-bound | Sí funciona | Excelente |

---

## Preguntas tontas — Asyncio

**❓ ¿Asyncio es más rápido que threads?**
Para I/O-bound tasks, sí, porque no hay cambio de contexto del SO. Para CPU-bound, no hay diferencia (ambos limitados por el GIL).

**❓ ¿Puedo mezclar código síncrono con asyncio?**
Sí, con `loop.run_in_executor()`. Pero mejor si todo es asyncio.

**❓ ¿Qué es una corrutina?**
Una función declarada con `async def` que puede pausarse con `await` y reanudarse después. No es un hilo, es una función que sabe esperar.

**❓ ¿`await` bloquea el hilo?**
No. `await` le dice al event loop: "ahora no necesito CPU, ocúpate de otras corrutinas". Es **cooperativo**.

**❓ ¿Cuándo usar threads y cuándo asyncio?**
- Threads: proyectos pequeños, librerías bloqueantes, simplicidad
- Asyncio: muchos clientes concurrentes, mucho I/O, escalabilidad

---

## ✏️ Aprieta el lápiz

1. **Asyncio básico**: Crea 3 corrutinas que esperen 1, 2 y 3 segundos. Lánzalas con `gather` y mide el tiempo total.
2. **Servidor asyncio**: Convierte el servidor TCP del TEMA 10 a asyncio.
3. **Heartbeat**: Añade un heartbeat que imprima "💓 vivo" cada 3s mientras el servidor funciona.
4. **Backoff**: Crea un cliente que intente conectarse 3 veces con backoff exponencial.
5. **Comparativa**: Mide el tiempo de atender 100 clientes con threads vs asyncio (simula 0.1s de I/O).

---

## RAs cubiertos y criterios de evaluación

### RA4 — Servicios en red (e-g)

| Criterio | Descripción | Cubierto |
|----------|-------------|----------|
| RA4e | Implementa mecanismos de disponibilidad (heartbeat, reintentos, timeout) | ✅ |
| RA4f | Desarrolla servidores con asyncio | ✅ |
| RA4g | Compara modelos de concurrencia (hilos vs asyncio) | ✅ |

> RA4c (servidores concurrentes con hilos) y RA4d (ThreadPool) se cubren en el **TEMA 10**.
