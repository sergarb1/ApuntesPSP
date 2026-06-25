---
title: "📝 INTERMEDIO POR RESOLVER 9 — Cifrado Moderno"
nav_order: 9
---
### 4. Cifrado híbrido simplificado
Genera una clave AES de 32 bytes y cifra `b"El cifrado hibrido funciona"`. Luego cifra esa clave AES con una clave RSA pública. Descifra en orden inverso y verifica el mensaje original.

### 5. Firma alterada
Firma digitalmente el mensaje `b"Transferencia de 500€"`. Modifica UN byte de la firma y comprueba que la verificación falla con `pkcs1_15.new(...).verify(...)`.

### 6. RBAC con permisos cifrado
Crea un sistema RBAC con 3 roles: `admin` (cifrar, descifrar, firmar), `usuario` (cifrar, firmar), `invitado` (solo cifrar). Implementa la función `puede(usuario, accion)` y pruébala con cada rol.
