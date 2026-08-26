---
title: Boletín U05 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Sockets UDP y Protocolos
---

# 💪 Boletín U05 — Avanzado (Resuelto)

---

## 1. Cliente NTP manual

```python
import socket, struct, time

def hora_ntp():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.settimeout(5)
        # Paquete NTP: 48 bytes, modo cliente
        paquete = b'\x1b' + 47 * b'\0'
        s.sendto(paquete, ("pool.ntp.org", 123))
        datos, _ = s.recvfrom(1024)

    # El timestamp está en los bytes 40-43
    t = struct.unpack('!I', datos[40:44])[0]
    # Ajustar época NTP (1900) a Unix (1970)
    return t - 2208988800

hora = hora_ntp()
print(f"Hora NTP oficial: {time.ctime(hora)}")
```

El `settimeout(5)` evita que el `recvfrom()` se quede bloqueado si el datagrama de respuesta se pierde (muy UDP). El timestamp se desempaqueta de los bytes 40-43 con `struct.unpack('!I', ...)` y se ajusta restando **2208988800** segundos de época.

## 2. Servidor UDP multimensaje

```python
import socket
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
    srv.bind(("127.0.0.1", 9001))
    for i in range(1, 4):
        datos, direccion = srv.recvfrom(1024)
        print(f"Mensaje {i} de {direccion}: {datos.decode()}")
        srv.sendto(f"OK #{i}".encode(), direccion)
```

Con `for i in range(1, 4)` el servidor responde a 3 mensajes y se cierra solo al salir del bucle (el `with` libera el socket). Cada respuesta lleva su número de orden.

## 3. Cliente HTTP con parseo de cabeceras

```python
import socket

with socket.socket() as s:
    s.connect(("example.com", 80))
    s.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n")
    resp = b""
    while True:
        d = s.recv(4096)
        if not d:
            break
        resp += d

cabeceras, _, cuerpo = resp.decode(errors="replace").partition("\r\n\r\n")
for linea in cabeceras.split("\r\n"):
    if linea.startswith(("Content-Type:", "Content-Length:")):
        print(linea)
```

`partition("\r\n\r\n")` separa las cabeceras del cuerpo. Buscando las líneas que empiezan por `Content-Type:` y `Content-Length:` extraes justo los dos valores que pide el ejercicio.

## 4. Cliente HTTP manual a `/ip`

```python
import socket
with socket.socket() as s:
    s.connect(("httpbin.org", 80))
    s.sendall(b"GET /ip HTTP/1.1\r\nHost: httpbin.org\r\nConnection: close\r\n\r\n")
    resp = b""
    while True:
        d = s.recv(4096)
        if not d: break
        resp += d
    print(resp.decode()[:500])
```

HTTP es texto sobre TCP. Mandas una petición y recibes una respuesta: en el cuerpo de `/ip` viene tu IP pública en JSON.

## 5. Compara TCP y UDP

```python
import socket, time
def test_tcp():
    t = time.time()
    for _ in range(10):
        with socket.socket() as s:
            s.connect(("127.0.0.1", 9000))
            s.send(b"x")
            s.recv(1024)
    return time.time() - t
def test_udp():
    t = time.time()
    for _ in range(10):
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.sendto(b"x", ("127.0.0.1", 9001))
            s.recvfrom(1024)
    return time.time() - t
print(f"TCP: {test_tcp():.3f}s")
print(f"UDP: {test_udp():.3f}s")
```

UDP suele ser más rápido porque no tiene handshake: cada intercambio TCP paga un `connect()` (three-way handshake) que UDP se ahorra.

## 6. Mini servidor web

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 8080))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        conn.recv(1024)  # Leer petición (la ignoramos)
        respuesta = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>Hola mundo</h1>"
        conn.sendall(respuesta.encode())
```

Abre http://127.0.0.1:8080 en tu navegador y verás "Hola mundo". El `SO_REUSEADDR` te permite relanzar el servidor sin esperar a que el puerto se libere.

## 7. Ping UDP

```python
import socket, time, threading

def servidor():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
        srv.bind(("127.0.0.1", 9001))
        datos, direccion = srv.recvfrom(1024)
        srv.sendto(b"PONG", direccion)

threading.Thread(target=servidor, daemon=True).start()

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as cli:
    inicio = time.time()
    cli.sendto(b"PING", ("127.0.0.1", 9001))
    datos, _ = cli.recvfrom(1024)
    fin = time.time()

print(f"PONG recibido en {fin - inicio:.4f} segundos")
```

El servidor se ejecuta en un hilo `daemon` mientras el cliente mide el tiempo de ida y vuelta. Ese tiempo es el **RTT** (round-trip time), la métrica de latencia de las redes.

## 8. Broadcast UDP

```python
import socket

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as servidor:
    servidor.bind(("0.0.0.0", 9001))
    print("Servidor escuchando en todas las interfaces...")
    while True:
        datos, direccion = servidor.recvfrom(1024)
        print(f"Datagrama de {direccion}: {datos.decode()}")
        servidor.sendto(b"Recibido!", direccion)
```

`"0.0.0.0"` significa "cualquier interfaz": el servidor acepta datagramas de cualquier cliente. El bucle infinito atiende a todos los que lleguen, uno tras otro, respondiendo con la dirección de cada uno.

## 9. HTTP desde cero con parseo

```python
import socket

with socket.socket() as s:
    s.connect(("example.com", 80))
    s.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n")
    respuesta = b""
    while True:
        d = s.recv(4096)
        if not d: break
        respuesta += d

texto = respuesta.decode(errors="replace")
cabeceras, _, cuerpo = texto.partition("\r\n\r\n")
lineas = cabeceras.split("\r\n")
print(f"Código de estado: {lineas[0]}")
for linea in lineas[1:]:
    print(f"  {linea}")
print(f"Cuerpo: {len(cuerpo)} caracteres")
```

`partition("\r\n\r\n")` separa cabeceras del cuerpo: la **primera línea** de las cabeceras es el código de estado (`HTTP/1.1 200 OK`), y el resto son las cabeceras `Nombre: valor`.

## 10. Mini navegador web

```python
import socket

def descargar_html(url):
    host = url.split("/", 1)[0]                      # "www.example.com"
    ruta = "/" + url.split("/", 1)[1] if "/" in url else "/"

    with socket.socket() as s:
        s.connect((host, 80))
        s.sendall(f"GET {ruta} HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n".encode())
        respuesta = b""
        while True:
            d = s.recv(4096)
            if not d:
                break
            respuesta += d

    cabeceras, _, cuerpo = respuesta.partition(b"\r\n\r\n")
    return cuerpo.decode(errors="replace")

html = descargar_html("www.example.com/")
with open("pagina.html", "w", encoding="utf-8") as f:
    f.write(html)
print(f"Guardados {len(html)} caracteres de HTML en pagina.html")
```

Se extrae el **host** (la parte antes de la primera `/`) y la **ruta** (el resto). Tras recibir toda la respuesta, `partition(b"\r\n\r\n")` separa cabeceras del cuerpo y solo se guarda el cuerpo en el archivo.

## 11. Comparativa TCP vs UDP (100 mensajes)

```python
import socket, time, threading

def servidor_tcp():
    with socket.socket() as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", 9000))
        srv.listen()
        for _ in range(100):
            conn, _ = srv.accept()
            with conn:
                conn.recv(1024)
                conn.send(b"x")

def servidor_udp():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as srv:
        srv.bind(("127.0.0.1", 9001))
        for _ in range(100):
            datos, direccion = srv.recvfrom(1024)
            srv.sendto(datos, direccion)

threading.Thread(target=servidor_tcp, daemon=True).start()
threading.Thread(target=servidor_udp, daemon=True).start()
time.sleep(0.2)  # dar tiempo a que arranquen los servidores

def test_tcp():
    t = time.time()
    for _ in range(100):
        with socket.socket() as s:
            s.connect(("127.0.0.1", 9000))
            s.send(b"x")
            s.recv(1024)
    return time.time() - t

def test_udp():
    t = time.time()
    for _ in range(100):
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.sendto(b"x", ("127.0.0.1", 9001))
            s.recvfrom(1024)
    return time.time() - t

print(f"TCP: {test_tcp():.3f}s")
print(f"UDP: {test_udp():.3f}s")
```

Ambos servidores se ejecutan en hilos mientras el cliente mide 100 intercambios. El servidor TCP exige `accept()` por cada conexión (handshake incluido); el UDP solo `recvfrom()` + `sendto()`. La diferencia de tiempo es el coste de la fiabilidad de TCP.

## 12. Servidor HTTP simple

```python
import socket

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 8080))
    srv.listen()
    print("Servidor HTTP escuchando en http://127.0.0.1:8080")
    while True:
        conn, addr = srv.accept()
        with conn:
            peticion = conn.recv(1024).decode(errors="replace")
            primera_linea = peticion.split("\r\n")[0]
            partes = primera_linea.split(" ")
            ruta = partes[1] if len(partes) > 1 else "/"
            print(f"Petición de {addr}: {primera_linea}")

            if ruta == "/":
                cuerpo, estado = "<h1>Bienvenido a mi servidor</h1>", "200 OK"
            elif ruta == "/acerca":
                cuerpo, estado = "<h1>Sobre este servidor</h1>", "200 OK"
            else:
                cuerpo, estado = "<h1>404 — Página no encontrada</h1>", "404 Not Found"

            respuesta = (
                f"HTTP/1.1 {estado}\r\n"
                "Content-Type: text/html\r\n"
                f"Content-Length: {len(cuerpo.encode())}\r\n"
                "\r\n" + cuerpo
            )
            conn.sendall(respuesta.encode())
```

Se lee la primera línea de la petición (`GET /ruta HTTP/1.1`) y se extrae la **ruta** (segunda palabra). Según la ruta se sirve distinto HTML con su código de estado (`200 OK` o `404 Not Found`) y la cabecera `Content-Length` con el tamaño exacto del cuerpo.