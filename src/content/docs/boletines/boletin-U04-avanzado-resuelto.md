---
title: Boletín U04 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Sockets TCP
---

# 💪 Boletín U04 — Avanzado (Resuelto)

---

## 1. Servidor que cuenta caracteres

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        texto = conn.recv(1024).decode()
        conn.sendall(str(len(texto)).encode())
```

`len(texto)` cuenta los caracteres del texto recibido y se devuelve como texto (`str`) convertido a bytes con `.encode()`. Si el cliente envía `"hola"`, recibe `"4"`.

## 2. Cliente interactivo

```python
import socket
with socket.socket() as cli:
    cli.connect(("127.0.0.1", 9000))
    while True:
        mensaje = input("Escribe (o 'salir'): ")
        if mensaje == "salir":
            break
        cli.sendall(mensaje.encode())
        respuesta = cli.recv(1024).decode()
        print(f"Respuesta: {respuesta}")
```

El `while True` mantiene el diálogo abierto. Cuando el usuario escribe `"salir"`, el `break` rompe el bucle y el `with` cierra el socket.

## 3. Servidor que registra IP

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        direccion = conn.getpeername()
        print(f"Cliente conectado: {direccion}")
        conn.sendall(str(direccion).encode())
```

`conn.getpeername()` devuelve la tupla `(IP, puerto)` del extremo remoto (el cliente). Se imprime en el servidor y se devuelve al cliente convertida a texto.

## 4. Servidor de mayúsculas

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        texto = conn.recv(1024).decode()
        conn.sendall(texto.upper().encode())
```

`texto.upper()` convierte el texto recibido a MAYÚSCULAS y se devuelve como bytes con `.encode()`.

## 5. Cliente con reconexión

```python
import socket, time

host = "127.0.0.1"
port = 9000

for intento in range(3):
    try:
        with socket.socket() as cli:
            cli.settimeout(2)
            cli.connect((host, port))
            cli.sendall(b"test")
            print(f"Conectado en el intento {intento + 1}")
            break
    except (ConnectionRefusedError, socket.timeout):
        print(f"Intento {intento + 1} fallido, esperando 2s...")
        time.sleep(2)
else:
    print("Servidor no disponible tras 3 intentos")
```

El `for` reintenta hasta 3 veces. Cada `except` captura el fallo (rechazo o timeout) y espera 2s con `time.sleep(2)`. El `break` sale si se conecta; el `else` del `for` se ejecuta solo si nunca hubo `break`.

## 6. Servidor que maneja múltiples conexiones (sin hilos)

```python
import socket, select

servidor = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
servidor.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
servidor.bind(("127.0.0.1", 9000))
servidor.listen()
servidor.setblocking(False)  # no bloqueante

clientes = []
print("Servidor atendiendo hasta 3 clientes con select...")

while True:
    lectura, _, _ = select.select([servidor] + clientes, [], [], 1.0)

    for sock in lectura:
        if sock is servidor:
            # El servidor está listo: acepta un nuevo cliente
            conn, addr = servidor.accept()
            conn.setblocking(False)
            clientes.append(conn)
            print(f"Conectado {addr}, hay {len(clientes)} cliente(s)")
        else:
            # Un cliente envió datos
            datos = sock.recv(1024)
            if datos:
                sock.sendall(datos)  # eco
            else:
                clientes.remove(sock)
                sock.close()
```

El servidor **no bloqueante** más `select.select()` permite esperar a la vez en el socket servidor y en los sockets de los clientes. Cuando el socket listo es el servidor, se acepta una conexión nueva; cuando es un cliente, se leen sus datos. Sin hilos: un solo hilo atiende a todos.

## 7. Calculadora remota

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        expr = conn.recv(1024).decode()
        try:
            resultado = eval(expr)
            conn.sendall(f"Resultado: {resultado}".encode())
        except Exception as e:
            conn.sendall(f"Error: {e}".encode())
```

`eval("5+3")` devuelve `8`. El `try/except` captura divisiones entre cero o sintaxis inválida y devuelve el error al cliente en lugar de romper el servidor.

> ⚠️ **Ojo:** `eval()` ejecuta código arbitrario: solo úsalo en ejercicios locales de confianza, nunca con entradas de usuarios desconocidos en producción.

## 8. Timeout personalizado

```python
import socket
with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    conn, addr = srv.accept()
    with conn:
        conn.settimeout(10)
        try:
            datos = conn.recv(1024)
            print(f"Recibido: {datos.decode()}")
        except socket.timeout:
            conn.sendall(b"Hasta luego")
            print("Cliente inactivo, cerrando conexion")
```

`conn.settimeout(10)` da al cliente 10 segundos para enviar datos. Si no lo hace, `recv()` lanza `socket.timeout` y el servidor se despide antes de cerrar.

## 9. Servidor de chat simple

```python
import socket, threading

clientes = []
lock = threading.Lock()

def atender(conn, addr):
    print(f"Conectado: {addr}")
    with conn:
        while True:
            try:
                datos = conn.recv(1024)
            except ConnectionResetError:
                break
            if not datos:
                break
            mensaje = f"{addr}: {datos.decode()}".encode()
            with lock:
                for c in clientes:
                    if c is not conn:
                        c.sendall(mensaje)
    with lock:
        clientes.remove(conn)
    conn.close()
    print(f"Desconectado: {addr}")

with socket.socket() as srv:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", 9000))
    srv.listen()
    print("Servidor de chat escuchando...")
    while True:
        conn, addr = srv.accept()
        with lock:
            clientes.append(conn)
        threading.Thread(target=atender, args=(conn, addr), daemon=True).start()
```

Un **hilo por cliente** (`threading.Thread`) permite atender a varios a la vez. Cada hilo espera en su propio `recv()` y, al recibir un mensaje, recorre la lista global de conexiones reenviándolo a **todos menos al emisor**. El **Lock** protege la lista cuando varios hilos la modifican a la vez.

---

📚 [Volver a la unidad](/ApuntesPSP/04-sockets-tcp) · Por resolver: [💪 Boletín U04 — Avanzado](/ApuntesPSP/boletines/boletin-u04-avanzado)