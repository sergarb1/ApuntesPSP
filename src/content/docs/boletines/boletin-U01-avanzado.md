---
title: Boletín UD 2 — Avanzado
description: Ejercicios avanzados de Gestión de procesos
---

# 💪 Boletín UD 2 — Avanzado

> Ejercicios que requieren aplicar los conceptos de procesos, `subprocess` y comunicación entre procesos de forma más profunda, con programas completos. Los tres últimos llevan `multiprocessing` (`Process`, `Manager` y `Lock`).

---

## 1. Filtrar ipconfig

Ejecuta `ipconfig` con `subprocess.run`, captura toda la salida y muestra solo las líneas que contengan "IPv4".

**Pista:** divide el stdout con `split("\n")` y filtra cada línea con el operador `in` para buscar "IPv4".

## 2. Comprobar si un programa existe

Usa `subprocess.run` con el comando `where python` (Windows) o `which python` (Linux) para comprobar si Python está accesible desde la terminal. Muestra el código de retorno.

**Pista:** el código de retorno 0 indica que `where`/`which` encontró Python. Distinto de 0, no lo encontró.

## 3. Abrir el navegador

Usa `subprocess.Popen` para abrir el navegador predeterminado con la URL `http://localhost:4321`. En Windows usa `start http://localhost:4321` con `shell=True`, en Linux usa `xdg-open http://localhost:4321`.

**Pista:** `start` es un comando interno del shell de Windows: necesita `shell=True`. `xdg-open` es un ejecutable real en Linux.

## 4. Lanzador múltiple

Crea un programa que lance 3 programas distintos a la vez (notepad, calc, mspaint). Muestra sus PIDs y luego los mata todos a los 5 segundos.

**Pista:** guarda los objetos `Popen` en una lista o tupla junto con el nombre de cada programa. Recorre la lista para mostrar PIDs y más tarde para terminarlos con `terminate()`.

## 5. Captura de ping

Ejecuta `ping 8.8.8.8 -n 5`, captura stdout y extrae solo las líneas que contienen "tiempo" o "time".

**Pista:** divide el stdout con `split("\n")` y filtra cada línea con el operador `in` para buscar las palabras clave.

## 6. PID del padre

Crea un programa que muestre su propio PID y el PID del proceso padre (PPID).

**Pista:** usa `os.getpid()` para tu PID y `os.getppid()` para el PPID. Ejecuta desde la terminal y observa quién es el padre.

## 7. Comunicación en dos direcciones

Crea un proceso hijo que reciba texto por stdin y devuelva el texto en mayúsculas.

**Pista:** usa `subprocess.Popen` con `stdin=subprocess.PIPE`, `stdout=subprocess.PIPE` y `text=True`. Luego llama a `communicate(input="tu texto")` para enviar datos y leer la respuesta.

## 8. Timeout con reintentos

Crea una función que ejecute un comando con timeout de 3s. Si falla, reintenta hasta 3 veces. Si al final no funciona, lanza una excepción.

**Pista:** envuelve `subprocess.run` con `timeout=3` y `check=False` dentro de un bucle `for`. Captura `subprocess.TimeoutExpired` en cada intento y rompe el bucle si el comando se ejecuta correctamente. Si se agotan los intentos, lanza una excepción personalizada.

## 9. Mini monitor de procesos

Crea un programa que lance un subprocess y verifique su estado cada segundo mientras está vivo.

**Pista:** `proc.poll()` devuelve `None` si el proceso sigue ejecutándose, o el código de retorno si ya terminó. Úsalo en un bucle `while proc.poll() is None` con `time.sleep(1)` dentro.

---

## 10. Contador compartido con candado

Crea un contador que 4 procesos incrementen 100 veces cada uno. El total final debe ser siempre 400. Ejecútalo primero **sin** el candado y comprueba que el resultado es impredecible; después, protégelo con `multiprocessing.Lock`.

**Pista:** usa `multiprocessing.Value('i', 0)` para el contador y `multiprocessing.Lock()`. Pasa ambos como argumentos al `target` del `Process` y protege `contador.value += 1` con `with candado:`.

## 11. Almacén compartido con Manager

Monta un diccionario compartido con `multiprocessing.Manager().dict()` donde 4 procesos registran pares clave-valor (por ejemplo, cada proceso añade 3 productos con su stock). Al terminar, el padre debe ver **todas** las claves de los cuatro procesos.

**Pista:** crea el `manager` dentro de un bloque `with multiprocessing.Manager() as manager:` y pásale `manager.dict()` como argumento a cada `Process`. Sin `join()` a todos los hijos, el padre puede leer el diccionario antes de tiempo.

## 12. Persistencia del almacén

Añade al ejercicio anterior el guardado a fichero: al terminar, vuelca el `manager.dict()` a un JSON; al arrancar, recárgalo y úsalo como estado inicial para que el stock acumulado se mantenga entre ejecuciones.

**Pista:** `json.dump(dict(almacen), f)` — el proxy del Manager no es un dict, hay que convertirlo con `dict(...)` antes de serializarlo. En la carga, devuelve `{}` si el fichero no existe.