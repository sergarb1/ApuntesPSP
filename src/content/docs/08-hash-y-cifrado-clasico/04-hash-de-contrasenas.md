---
title: 04 — Hash de contraseñas
description: Guarda la huella, nunca la original 🔐
---

<p><small>Guarda la huella, nunca la original 🔐</small></p>

> 🗺️ **Estás en:** 🔐 **U08 · Hash y Cifrado Clásico** → 04 · Hash de contraseñas

---

## 📬 La idea en una frase

> Cuando un usuario se registra, no guardamos su contraseña: guardamos su **hash**. En el login recalculamos el hash del intento y comparamos hashes. Así, si roban la base de datos, no roban contraseñas.

Este es el momento en que todo lo anterior cobra sentido. Y es **el "Be the code"** de la unidad: te metes dentro del programa que registra a Ana y luego decide si su login es válido.

---

## 🎭 Be the code: registro y login con hash

> "Sé el programa que registra a un usuario y luego verifica su login. Contraseñas seguras, sin almacenar la original."

```python
import hashlib

def registrar(usuario, contraseña):
    hash_contra = hashlib.sha256(contraseña.encode()).hexdigest()
    print(f"  Usuario '{usuario}' registrado")
    print(f"  Hash: {hash_contra[:16]}...")
    return hash_contra

def login(usuario, contraseña, hash_almacenado):
    hash_intento = hashlib.sha256(contraseña.encode()).hexdigest()
    if hash_intento == hash_almacenado:
        print(f"  ✅ {usuario}: login correcto")
        return True
    else:
        print(f"  ❌ {usuario}: contraseña incorrecta")
        return False

# Simular registro y login
hash_ana = registrar("Ana", "MiClaveSecreta123")
login("Ana", "MiClaveSecreta123", hash_ana)  # ✅
login("Ana", "OtraClave", hash_ana)           # ❌
```

**Salida**:
```
  Usuario 'Ana' registrado
  Hash: 33b1f04c2e6e5d3c...
  ✅ Ana: login correcto
  ❌ Ana: contraseña incorrecta
```

La máquina nunca ve la contraseña: ve su hash. El registro calcula el hash y lo devuelve (en una app real, lo guardarías en la base de datos). El login vuelve a calcular el hash del intento y lo compara con el almacenado.

---

## 🐾 La traza paso a paso

```
1. Ana se registra con "MiClaveSecreta123"
2. Python codifica a bytes → b"MiClaveSecreta123"
3. hashlib.sha256() procesa → 256 bits de hash
4. hexdigest() devuelve 64 caracteres hexadecimales
5. Guardamos en BD: "33b1f04c2e6e5d3c..." (solo el hash)

6. Ana hace login con "MiClaveSecreta123"
7. Calculamos hash del intento → "33b1f04c2e6e5d3c..."
8. Comparamos con el almacenado → ¡COINCIDEN!
9. ✅ Login correcto

10. Un atacante intenta con "OtraClave"
11. Hash del intento → "ff34ee22..." (distinto)
12. No coincide → ❌ Acceso denegado
```

Fíjate en el paso 8: no comparamos contraseñas, **comparamos hashes**. Y como el hash es determinista ([punto 2](/ApuntesPSP/08-hash-y-cifrado-clasico/02-que-es-un-hash)), la misma contraseña siempre produce el mismo hash.

---

## 🗄️ La regla de oro

> La contraseña original **nunca** se almacena. Solo su hash.

- Si roban la base de datos con hashes, no tienen contraseñas: solo huellas irreversibles.
- Los sistemas serios además añaden **sal** (lo verás en el [punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal)) para que ni siquiera las huellas idénticas se reconozcan entre usuarios.
- Cifrar la contraseña en lugar de hashearla **no** sirve para esto: si el atacante roba también la clave de cifrado (y suele hacerlo), recupera todo. El hash es la elección correcta por ser unidireccional.

> ⚠️ **Y lo que NUNCA debe aparecer en tu código:** `if contraseña == contraseña_guardada:` comparando texto plano, ni un `print(f"Contraseña de Ana: {contraseña}")` en los logs. Eso es *seguridad de una sola capa* (el [punto 1](/ApuntesPSP/08-hash-y-cifrado-clasico/01-principios-de-seguridad) que acabamos de violar).

---

## 🧠 Mini-chequeo

1. ¿Qué guardamos exactamente en la base de datos al registrar a un usuario?
2. ¿Por qué el login vuelve a calcular el hash en lugar de comparar contraseñas?
3. ¿Por qué cifrar la contraseña sería peor que hashearla para este caso?

<details>
<summary>🔄 Respuestas</summary>

1. Solo el **hash** de la contraseña (`hashlib.sha256(contraseña.encode()).hexdigest()`). Nunca la contraseña en claro.
2. Porque la contraseña original no está en ninguna parte: la única forma de "comprobar" algo es volver a hashear el intento y ver si su huella coincide con la almacenada (propiedad determinista).
3. Porque el cifrado es **reversible**: si el atacante roba la clave de descifrado (o la fuerza), recupera todas las contraseñas. El hash, al ser unidireccional, no puede deshacerse aunque roben la base de datos.
</details>

---

## ✅ Resumen en 3 frases

- En el registro se guarda el **hash** de la contraseña; en el login se hashea el intento y se comparan huellas.
- La traza lo deja claro: en ningún momento existe la contraseña original fuera del cerebro (y del teclado) del usuario.
- Es la primera "cerradura decente" del [punto 1](/ApuntesPSP/08-hash-y-cifrado-clasico/01-principios-de-seguridad)… y el [punto 5](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal) le pone la segunda vuelta.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Hash de contraseña | Huella irreversible que se guarda en lugar del texto plano |
| registrar() | Función que hashea y "almacena" la contraseña |
| login() | Función que hashea el intento y compara con el almacenado |
| hexdigest() | Representación hexadecimal del hash |
| Texto plano | La contraseña tal cual, lo que NUNCA se guarda |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-hash-y-cifrado-clasico) · **Anterior:** [03 · MD5, SHA-1 y SHA-256](/ApuntesPSP/08-hash-y-cifrado-clasico/03-md5-sha1-sha256) · **Siguiente:** [05 · Hash con sal](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal)