---
title: "📝 INTERMEDIO POR RESOLVER 1 — Procesos y Subprocess"
nav_order: 1
---
### 4. Filtrar ipconfig
Ejecuta `ipconfig` con `subprocess.run`, captura toda la salida y muestra solo las líneas que contengan "IPv4".

### 5. Comprobar si un programa existe
Usa `subprocess.run` con el comando `where python` (Windows) o `which python` (Linux) para comprobar si Python está accesible desde la terminal. Muestra el código de retorno.

### 6. Abrir el navegador
Usa `subprocess.Popen` para abrir el navegador predeterminado con la URL `http://localhost:4321`. En Windows usa `start http://localhost:4321` con `shell=True`, en Linux usa `xdg-open http://localhost:4321`.
