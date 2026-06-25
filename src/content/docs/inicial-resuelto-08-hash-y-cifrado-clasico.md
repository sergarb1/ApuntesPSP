---
title: "✅ INICIAL RESUELTO 8 — Hash y Cifrado Clásico"
nav_order: 8
---
### 1. MD5 de "hola"

```python
import hashlib
print(hashlib.md5(b"hola").hexdigest())
# a47c1382b0e5e7b7f6e6349e4ff93e05
```

### 2. SHA256 de "python"

```python
import hashlib
h = hashlib.sha256(b"python").hexdigest()
print(h)
print(f"Longitud: {len(h)} caracteres")  # 64
```

SHA256 siempre devuelve 64 caracteres hexadecimales (256 bits).

### 3. Compara hashes

```python
import hashlib
texto = b"Hola mundo"
print(f"MD5:    {len(hashlib.md5(texto).hexdigest())} chars (128 bits)")
print(f"SHA1:   {len(hashlib.sha1(texto).hexdigest())} chars (160 bits)")
print(f"SHA256: {len(hashlib.sha256(texto).hexdigest())} chars (256 bits)")
```

MD5 → 32, SHA1 → 40, SHA256 → 64 caracteres.
