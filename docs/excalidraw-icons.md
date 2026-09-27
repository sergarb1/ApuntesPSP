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
| proceso-memoria | `public/diagrams/proceso-memoria.svg` | `public/diagrams/proceso-memoria.excalidraw` | UD 2 | `01-gestion-de-procesos/01-que-es-un-proceso.md` | La burbuja de memoria del proceso: código, estado, contador de programa y PID |
| paralela-vs-distribuida | `public/diagrams/paralela-vs-distribuida.svg` | `public/diagrams/paralela-vs-distribuida.excalidraw` | UD 2 | `01-gestion-de-procesos/03-paralela-vs-distribuida.md` | Paralela (4 núcleos de una máquina) vs distribuida (servidores por red) y la concurrencia como turno en 1 CPU |
| pipes-comunicacion | `public/diagrams/pipes-comunicacion.svg` | `public/diagrams/pipes-comunicacion.excalidraw` | UD 2 | `01-gestion-de-procesos/06-comunicacion-con-procesos.md` | Comunicación con pipes: Python → stdin → hijo → stdout → Python |
| hilos-estados | `public/diagrams/hilos-estados.svg` | `public/diagrams/hilos-estados.excalidraw` | UD 3 | `02-hilos-y-concurrencia/07-estados-del-hilo.md` | Transiciones de estados de un hilo (start(), yield(), sleep()/lock) |
| cifrado-hibrido | `public/diagrams/cifrado-hibrido.svg` | `public/diagrams/cifrado-hibrido.excalidraw` | UD 9 | `08-seguridad-y-cifrado/08-cifrado-hibrido-y-practica.md` | Secuencia del intercambio híbrido RSA + AES entre Ana y Bob |
| memory-arquitectura | `public/diagrams/memory-arquitectura.svg` | `public/diagrams/memory-arquitectura.excalidraw` | Transversal | sin referencia activa | Evolución del proyecto del curso: F1 Local → F2 Red → F3 Seguro |
| lock-seccion-critica | `public/diagrams/lock-seccion-critica.svg` | `public/diagrams/lock-seccion-critica.excalidraw` | UD 4 | `03-sincronizacion/02-lock.md` | El Lock protegiendo la sección crítica: un hilo dentro y dos esperando |
| barrier-fases | `public/diagrams/barrier-fases.svg` | `public/diagrams/barrier-fases.excalidraw` | UD 4 | `03-sincronizacion/05-barrier.md` | La Barrier sincronizando dos fases de trabajo entre tres hilos |
| threadpool | `public/diagrams/threadpool.svg` | `public/diagrams/threadpool.excalidraw` | UD 6 | `05-servidores-concurrentes/04-threadpoolexecutor.md` | ThreadPoolExecutor: cola de tareas y equipo fijo de 10 hilos |
| heartbeat | `public/diagrams/heartbeat.svg` | `public/diagrams/heartbeat.excalidraw` | UD 10 | `09-alta-disponibilidad/05-heartbeat.md` | Latidos periódicos del servidor al monitor y alerta si se detienen |
| tipos-primitivos | `public/diagrams/tipos-primitivos.svg` | `public/diagrams/tipos-primitivos.excalidraw` | UD 1 | `00-python-basico/03-tipos-de-datos.md` | Los cinco tipos primitivos como objetos: int, float, bool, str y None |
| hilo-principal | `public/diagrams/hilo-principal.svg` | `public/diagrams/hilo-principal.excalidraw` | UD 3 | `02-hilos-y-concurrencia/02-primer-hilo.md` | El hilo principal main lanzando los hilos secundarios A y B dentro del proceso |
| gil-turnos | `public/diagrams/gil-turnos.svg` | `public/diagrams/gil-turnos.excalidraw` | UD 3 | `02-hilos-y-concurrencia/06-gil.md` | Turnos del GIL en el tiempo: mientras un hilo ejecuta, el otro espera |
| udp-datagramas | `public/diagrams/udp-datagramas.svg` | `public/diagrams/udp-datagramas.excalidraw` | UD 5 | `04-sockets-tcp-y-udp/05-cliente-y-servidor-udp.md` | Cinco datagramas UDP de los que el 3 se pierde y jamás se reenvía |
| telefono-socket | `public/diagrams/telefono-socket.svg` | `public/diagrams/telefono-socket.excalidraw` | UD 5 | `04-sockets-tcp-y-udp/01-que-es-un-socket.md` | La analogía del teléfono mapeada a socket(), IP, puerto, SO, conexión y close() |
| fin-conexion | `public/diagrams/fin-conexion.svg` | `public/diagrams/fin-conexion.excalidraw` | UD 5 | `04-sockets-tcp-y-udp/04-ciclo-y-errores.md` | La despedida TCP: FIN → ACK → FIN → ACK entre cliente y servidor |
| ciclo-servidor | `public/diagrams/ciclo-servidor.svg` | `public/diagrams/ciclo-servidor.excalidraw` | UD 5 | `04-sockets-tcp-y-udp/04-ciclo-y-errores.md` | El ciclo de vida del servidor TCP: socket() → bind() → listen() → accept() → recv()/sendall() → close() |
| ntp | `public/diagrams/ntp.svg` | `public/diagrams/ntp.excalidraw` | UD 5 | `04-sockets-tcp-y-udp/06-http-y-ntp.md` | NTP por UDP: petición de hora a pool.ntp.org y respuesta en dos datagramas |
| criterio-tcp-udp | `public/diagrams/criterio-tcp-udp.svg` | `public/diagrams/criterio-tcp-udp.excalidraw` | UD 5 | `04-sockets-tcp-y-udp/07-cuando-usar-cada-protocolo.md` | Árbol de decisión: ¿puedo permitirme perder datos? NO → TCP, SÍ → UDP |
| servidor-secuencial | `public/diagrams/servidor-secuencial.svg` | `public/diagrams/servidor-secuencial.excalidraw` | UD 6 | `05-servidores-concurrentes/01-servidor-secuencial.md` | Gantt del servidor secuencial: 3 clientes procesados uno detrás de otro (9 s) |
| servidor-concurrente | `public/diagrams/servidor-concurrente.svg` | `public/diagrams/servidor-concurrente.excalidraw` | UD 6 | `05-servidores-concurrentes/01-servidor-secuencial.md` | Gantt del servidor concurrente: 3 hilos procesan a la vez y acaban en 3 s |
| servidor-lento | `public/diagrams/servidor-lento.svg` | `public/diagrams/servidor-lento.excalidraw` | UD 6 | `05-servidores-concurrentes/02-el-problema-de-la-espera.md` | Gantt con un cliente lento que bloquea la cola mientras los demás esperan |
| hilo-por-cliente | `public/diagrams/hilo-por-cliente.svg` | `public/diagrams/hilo-por-cliente.excalidraw` | UD 6 | `05-servidores-concurrentes/03-hilo-por-cliente.md` | Patrón hilo por cliente: cada cliente lanzado a su hilo, el principal sigue en accept() |
| url-anatomia | `public/diagrams/url-anatomia.svg` | `public/diagrams/url-anatomia.excalidraw` | UD 7 | `06-http-y-apis-rest/01-web-y-http.md` | Anatomía de una URL: scheme, host, path y query params |
| flujo-errores-api | `public/diagrams/flujo-errores-api.svg` | `public/diagrams/flujo-errores-api.excalidraw` | UD 8 | `07-apis-comerciales/06-errores-http.md` | Flujo de errores HTTP al consumir una API: reintentos, esperas y rendición controlada |
| cesar | `public/diagrams/cesar.svg` | `public/diagrams/cesar.excalidraw` | UD 9 | `08-seguridad-y-cifrado/04-cifrado-clasico.md` | El cifrado César: desplazar cada letra 3 posiciones por el alfabeto |
| aes-simetrico | `public/diagrams/aes-simetrico.svg` | `public/diagrams/aes-simetrico.excalidraw` | UD 9 | `08-seguridad-y-cifrado/05-cifrado-simetrico-aes.md` | AES simétrico: Ana y Bob comparten la clave K, que nunca viaja por la red |
| rsa-asimetrico | `public/diagrams/rsa-asimetrico.svg` | `public/diagrams/rsa-asimetrico.excalidraw` | UD 9 | `08-seguridad-y-cifrado/06-cifrado-asimetrico-rsa.md` | RSA asimétrico: cifrar con la pública de Bob y descifrar solo con su privada |
| firmas | `public/diagrams/firmas.svg` | `public/diagrams/firmas.excalidraw` | UD 9 | `08-seguridad-y-cifrado/07-firmas-digitales.md` | Firma digital: hash firmado con la privada de Ana y verificado con la pública |
| event-loop | `public/diagrams/event-loop.svg` | `public/diagrams/event-loop.excalidraw` | UD 10 | `09-alta-disponibilidad/08-disponibilidad-y-practica.md` | El Event Loop atendiendo clientes concurrentes con un solo hilo |
| capas-spring | `public/diagrams/capas-spring.svg` | `public/diagrams/capas-spring.excalidraw` | Anexo | `10-anexo-spring-boot/06-ejemplo-completo.md` | La arquitectura en capas de Spring Boot: Controller → Service → Repository → BD |
| semaphore-aforo | `public/diagrams/semaphore-aforo.svg` | `public/diagrams/semaphore-aforo.excalidraw` | UD 4 | `03-sincronizacion/04-semaphore.md` | Semaphore(3) como aforo: tres hilos dentro y dos esperando su acquire() |
| condition-wait-notify | `public/diagrams/condition-wait-notify.svg` | `public/diagrams/condition-wait-notify.excalidraw` | UD 4 | `03-sincronizacion/06-condition.md` | La Condition: wait() y notify() entre productor y consumidor bajo el mismo lock |
| productor-consumidor | `public/diagrams/productor-consumidor.svg` | `public/diagrams/productor-consumidor.excalidraw` | UD 4 | `03-sincronizacion/07-productor-consumidor.md` | Cola compartida entre productor y consumidor con Condition |
| codigos-estado | `public/diagrams/codigos-estado.svg` | `public/diagrams/codigos-estado.excalidraw` | UD 7 | `06-http-y-apis-rest/04-codigos-de-estado.md` | Las cuatro familias de códigos HTTP: 2xx, 3xx, 4xx y 5xx con sus ejemplos |
| dotenv-flujo | `public/diagrams/dotenv-flujo.svg` | `public/diagrams/dotenv-flujo.excalidraw` | UD 8 | `07-apis-comerciales/02-variables-de-entorno.md` | El flujo del .env: load_dotenv() → os.environ → tu código, sin subir claves al repo |
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
