---
title: "⭐ AVANZADO 8 — Hash y Cifrado Clásico"
nav_order: 8
---

## ⭐ AVANZADO 08 — Hash y Cifrado Clásico


---

### 1. 🎯 Verificador de integridad

Calcula el SHA256 de un archivo y compáralo con un hash esperado.

**Pista**: Lee el archivo en modo binario (`"rb"`) y pásalo directamente a `hashlib.sha256().hexdigest()`. Compara el hash calculado con el hash esperado del mismo contenido. Si coinciden, el archivo no ha sido modificado.

---

### 2. 🔍 Fuerza bruta César

Dado un texto cifrado con César (desplazamiento desconocido), prueba los 25 desplazamientos y muestra solo los que tengan palabras en español.

**Pista**: Para cada desplazamiento del 1 al 25, aplica el descifrado César. Usa un conjunto de palabras comunes en español (como `"hola"`, `"mundo"`, `"python"`) para filtrar resultados. Si el texto descifrado contiene alguna palabra conocida, es probable que sea el correcto.

---

### 3. 🧩 Hash con salt

Añade un salt aleatorio al hash de una contraseña para evitar tablas rainbow.

**Pista**: Genera un salt de 16 bytes con `os.urandom(16)`. El hash final es `salt + sha256(salt + password.encode()).digest()`. Para verificar, extrae los primeros 16 bytes (el salt) y repite el cálculo. Si dos usuarios tienen la misma contraseña, sus hashes serán distintos gracias al salt.

---

### 4. 🎭 Comparación gráfica de avalancha

Muestra cómo un bit de diferencia en la entrada cambia completamente el hash.

**Pista**: Convierte ambos hashes a hexadecimal con `hexdigest()` y compáralos carácter por carácter. Cuenta cuántos caracteres son diferentes. El efecto avalancha debería mostrar aproximadamente el 50% de caracteres distintos aunque la entrada cambie solo un bit.

---

### 5. ⏱ Velocidad de hashes

Compara cuánto tarda MD5 vs SHA1 vs SHA256 en hashear 1 millón de veces.

**Pista**: Usa un bucle de 1 millón de iteraciones llamando a cada función de hash (`hashlib.md5`, `hashlib.sha1`, `hashlib.sha256`). Mide el tiempo total con `time.time()` antes y después. MD5 es el más rápido; SHA256 el más lento pero más seguro.

---

### 6. 🏗️ Mini gestor de contraseñas

Guarda contraseñas con hash + salt en un archivo JSON. Permite registro y login.

**Pista**: Almacena cada usuario en un JSON con el formato `salt.hex() + hashlib.sha256(salt + password.encode()).hexdigest()`. Para verificar, extrae el salt (primeros 32 caracteres hexadecimales), conviértelo a bytes con `bytes.fromhex()` y recalcula el hash con la contraseña proporcionada.
