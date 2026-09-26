# Diccionario de iconos y convenciones Excalidraw

Referencia de los diagramas Excalidraw del sitio (`public/diagrams/*.svg` + fuente editable `*.excalidraw`).
Pipeline documentado en `AGENTS.md` → «Diagramas Excalidraw (MCP)».

## Convención de iconos

No se usan librerías `.excalidrawlib`: los iconos se abstraen con **formas simples (rect/ellipse + texto)**,
que exportan limpio a SVG estático y no añaden dependencias. Si en el futuro se importan iconos de una
librería, extraerlos a JSON temporal, limpiar coordenadas, regenerar IDs, importar con `mode: "merge"` y
registrarlos aquí.

## Paleta del sitio

| Uso | Relleno | Borde |
|-----|---------|-------|
| Python / TCP / concepto principal | `#d0ebff` | `#306998` |
| UDP / advertencias suaves | `#ffec99` | `#e67700` |
| Éxito / datos fluyendo | — | `#2f9e44` |
| Error / fallo (uso exclusivo de errores) | — | `#e03131` |
| Texto secundario | — | `#495057` |
| Ejes de vida (secuencias) | — | `#868e96` dashed |

Reglas: `fillStyle: "solid"` siempre, texto ≥ 16 (títulos 24-28), formas ≥ 120x60,
etiquetas de flecha ≤ 12 caracteres, flechas con `startElementId`/`endElementId`,
zonas de agrupación sin texto interior (título como texto libre en la esquina).

## Inventario

| Diagrama | SVG | Fuente | Unidad | Referencia | Descripción |
|----------|-----|--------|--------|------------|-------------|
| tcp-handshake | `public/diagrams/tcp-handshake.svg` | `public/diagrams/tcp-handshake.excalidraw` | UD 5 | `04-sockets-tcp-y-udp/04-ciclo-y-errores.md` | Secuencia del three-way handshake (SYN → SYN+ACK → ACK) |
| tcp-vs-udp | `public/diagrams/tcp-vs-udp.svg` | `public/diagrams/tcp-vs-udp.excalidraw` | UD 5 | `04-sockets-tcp-y-udp/01-que-es-un-socket.md` | Comparativa TCP (carta certificada) contra UDP (avión de papel) |
| ciclo-vida-socket | `public/diagrams/ciclo-vida-socket.svg` | `public/diagrams/ciclo-vida-socket.excalidraw` | UD 5 | `04-sockets-tcp-y-udp/04-ciclo-y-errores.md` | Ciclo de vida de la conexión TCP: socket() → bind() → listen() → accept() → recv()/sendall() → close() |
| procesos-estados | `public/diagrams/procesos-estados.svg` | `public/diagrams/procesos-estados.excalidraw` | UD 2 | `01-gestion-de-procesos/02-estados-de-un-proceso.md` | Transiciones de estados de un proceso (NUEVO, LISTO, EJECUCIÓN, BLOQUEADO, TERMINADO) |
| hilos-estados | `public/diagrams/hilos-estados.svg` | `public/diagrams/hilos-estados.excalidraw` | UD 3 | `02-hilos-y-concurrencia/07-estados-del-hilo.md` | Transiciones de estados de un hilo (start(), yield(), sleep()/lock) |
| cifrado-hibrido | `public/diagrams/cifrado-hibrido.svg` | `public/diagrams/cifrado-hibrido.excalidraw` | UD 9 | `08-seguridad-y-cifrado/08-cifrado-hibrido-y-practica.md` | Secuencia del intercambio híbrido RSA + AES entre Ana y Bob |
| memory-arquitectura | `public/diagrams/memory-arquitectura.svg` | `public/diagrams/memory-arquitectura.excalidraw` | Transversal | sin referencia activa | Evolución del proyecto del curso: F1 Local → F2 Red → F3 Seguro |
| lock-seccion-critica | `public/diagrams/lock-seccion-critica.svg` | `public/diagrams/lock-seccion-critica.excalidraw` | UD 4 | `03-sincronizacion/02-lock.md` | El Lock protegiendo la sección crítica: un hilo dentro y dos esperando |
| barrier-fases | `public/diagrams/barrier-fases.svg` | `public/diagrams/barrier-fases.excalidraw` | UD 4 | `03-sincronizacion/05-barrier.md` | La Barrier sincronizando dos fases de trabajo entre tres hilos |
| threadpool | `public/diagrams/threadpool.svg` | `public/diagrams/threadpool.excalidraw` | UD 6 | `05-servidores-concurrentes/04-threadpoolexecutor.md` | ThreadPoolExecutor: cola de tareas y equipo fijo de 10 hilos |
| heartbeat | `public/diagrams/heartbeat.svg` | `public/diagrams/heartbeat.excalidraw` | UD 10 | `09-alta-disponibilidad/05-heartbeat.md` | Latidos periódicos del servidor al monitor y alerta si se detienen |
| tipos-primitivos | `public/diagrams/tipos-primitivos.svg` | `public/diagrams/tipos-primitivos.excalidraw` | UD 1 | `00-python-basico/03-tipos-de-datos.md` | Los cinco tipos primitivos como objetos: int, float, bool, str y None |
| metodos-http | `public/diagrams/metodos-http.svg` | `public/diagrams/metodos-http.excalidraw` | UD 7 | `06-http-y-apis-rest/02-metodos-http.md` | Los cinco métodos HTTP actuando sobre el mismo recurso /usuarios/5 |
| rate-limit-429 | `public/diagrams/rate-limit-429.svg` | `public/diagrams/rate-limit-429.excalidraw` | UD 8 | `07-apis-comerciales/05-rate-limiting.md` | Ciclo del rate limit: petición, 429 Too Many Requests y reintento |
| spring-di-contenedor | `public/diagrams/spring-di-contenedor.svg` | `public/diagrams/spring-di-contenedor.excalidraw` | Anexo | `10-anexo-spring-boot/03-inyeccion-de-dependencias.md` | Contenedor IoC de Spring inyectando beans del Repository al Controller |

## Cómo editar un diagrama existente

```bash
# 1. Arrancar canvas en el puerto 3002 (3000/3001 los usan otras instancias)
EXPRESS_SERVER_URL=http://127.0.0.1:3002 npx mcp-excalidraw-server start

# 2. Abrir http://127.0.0.1:3002 en el navegador (necesario para SVG/capturas)

# 3. Importar, editar, reexportar (byte-estable, sin phantom diffs)
EXPRESS_SERVER_URL=http://127.0.0.1:3002 npx mcp-excalidraw-server import public/diagrams/tcp-handshake.excalidraw --replace
# ... editar con add/update/delete ...
EXPRESS_SERVER_URL=http://127.0.0.1:3002 npx mcp-excalidraw-server export --out public/diagrams/tcp-handshake.excalidraw
EXPRESS_SERVER_URL=http://127.0.0.1:3002 npx mcp-excalidraw-server screenshot --format svg --out public/diagrams/tcp-handshake.svg
```
