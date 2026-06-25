---
title: "💪 INTERMEDIO RESUELTO 8 — Hash y Cifrado Clásico"
nav_order: 8
---
### 4. Hash de un número

```python
import hashlib
h1 = hashlib.sha256(b"12345").hexdigest()
h2 = hashlib.sha256(b"12346").hexdigest()
print(f"12345: {h1}")
print(f"12346: {h2}")
print(f"¿Son parecidos? No, efecto avalancha.")
```

Un mínimo cambio produce un hash completamente diferente.

### 5. César básico

```python
def cifrar(texto, desp):
    res = ""
    for c in texto:
        if c.isalpha():
            base = ord('A') if c.isupper() else ord('a')
            res += chr((ord(c) - base + desp) % 26 + base)
        else:
            res += c
    return res
print(cifrar("Hola", 3))  # "Krod"
```

### 6. Descifrar César

```python
def descifrar(texto, desp):
    return cifrar(texto, -desp)
print(descifrar("Krod", 3))  # "Hola"
```

Descifrar es cifrar con desplazamiento negativo.
