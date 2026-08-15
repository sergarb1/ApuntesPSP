---
title: 06 — Cifrado César
description: El abuelo de la criptografía, roto pero didáctico 🏛️
---

<p><small>El abuelo de la criptografía, roto pero didáctico 🏛️</small></p>

> 🗺️ **Estás en:** 🔐 **U08 · Hash y Cifrado Clásico** → 06 · Cifrado César

---

## 📬 La idea en una frase

> El **cifrado César** desplaza cada letra un número fijo de posiciones en el alfabeto: es el cifrado más antiguo que se conoce y, también, el más fácil de romper. Perfecto para aprender el concepto, inútil para proteger nada real.

Es el otro gran protagonista de esta unidad: mientras el hash (puntos anteriores) no se puede deshacer, el César **sí** se descifra con una clave: el desplazamiento.

---

## 🏛️ La historia: Julio César y su desplazamiento de 3

Julio César, para que sus mensajes militares no fueran leídos si caían en manos enemigas, desplazaba **cada letra 3 posiciones** en el alfabeto. El receptor, que conocía el truco, desplazaba cada letra **3 hacia atrás**.

```
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
│ │ │ │
▼ ▼ ▼ ▼
D E F G   (cada letra se convierte en la que está 3 posiciones más adelante)
```

"Hola Mundo" con desplazamiento 3 → **"Krod Pxqgr"**. Sencillo de entender, y por eso es el cifrado ideal para empezar.

---

## 🐍 Cifrar y descifrar en Python

La función recorre el texto carácter a carácter. Si el carácter es una letra, calcula su nueva posición con la aritmética `% 26` (para que al llegar a la 'z' vuelva a la 'a'). Los espacios y signos se dejan igual.

```python
def cifrar_cesar(texto, desplazamiento):
    resultado = ""
    for caracter in texto:
        if caracter.isalpha():
            base = ord('A') if caracter.isupper() else ord('a')
            resultado += chr((ord(caracter) - base + desplazamiento) % 26 + base)
        else:
            resultado += caracter
    return resultado

def descifrar_cesar(texto, desplazamiento):
    return cifrar_cesar(texto, -desplazamiento)

original = "Hola Mundo"
cifrado = cifrar_cesar(original, 3)
descifrado = descifrar_cesar(cifrado, 3)

print(f"Original:  {original}")     # Hola Mundo
print(f"Cifrado:   {cifrado}")      # Krod Pxqgr
print(f"Descifrado:{descifrado}")   # Hola Mundo
```

**Salida**:
```
Original:  Hola Mundo
Cifrado:   Krod Pxqgr
Descifrado: Hola Mundo
```

Dos detalles del código:

- **`caracter.isupper()`** decide si la base es `ord('A')` (65) o `ord('a')` (97), para que las mayúsculas sigan siendo mayúsculas y las minúsculas, minúsculas.
- **Descifrar es cifrar con desplazamiento negativo**: `descifrar_cesar(texto, 3)` llama a `cifrar_cesar(texto, -3)`. No hace falta otra función.

---

## 🎭 Be the code: César paso a paso

> "Sé el cifrado César caracter a caracter."

```
cifrar_cesar("Hola Mundo", 3)

1. Carácter 'H' (mayúscula)
   → base = ord('A') = 65
   → (ord('H') - 65 + 3) % 26 + 65
   → (72 - 65 + 3) % 26 + 65
   → 10 % 26 + 65
   → 10 + 65 = 75
   → chr(75) = 'K'

2. Carácter 'o' (minúscula)
   → base = ord('a') = 97
   → (111 - 97 + 3) % 26 + 97
   → 17 % 26 + 97
   → 17 + 97 = 114
   → chr(114) = 'r'

3. 'l' → 'o'
4. 'a' → 'd'
5. ' ' → ' ' (no es letra, se queda igual)
6. 'M' → 'P'
7. 'u' → 'x'
8. 'n' → 'q'
9. 'd' → 'g'
10. 'o' → 'r'

Resultado: "Krod Pxqgr" 🏁
```

Repasa el carácter 'H': `ord('H')` es 72, le restamos la base 65, sumamos el desplazamiento 3, hacemos `% 26` para quedarnos dentro del alfabeto y volvemos a sumar la base. Da 75, que es `chr(75) = 'K'`.

---

## 💥 Romperlo por fuerza bruta

El desplazamiento solo puede ser un número del **1 al 25** (el 0 no cambia nada, y 26 vuelve a ser 0). Prueba los 25 y mira cuál tiene sentido:

```python
def cifrar_cesar(texto, desplazamiento):
    resultado = ""
    for caracter in texto:
        if caracter.isalpha():
            base = ord('A') if caracter.isupper() else ord('a')
            resultado += chr((ord(caracter) - base + desplazamiento) % 26 + base)
        else:
            resultado += caracter
    return resultado

cifrado = "Krod Pxqgr"
for desplazamiento in range(1, 26):
    intento = cifrar_cesar(cifrado, -desplazamiento)
    print(f"Desplazamiento {desplazamiento}: {intento}")
```

**Salida** (extracto):
```
Desplazamiento 1: Jqnc Owpfq
Desplazamiento 2: Ipmb Nvoep
Desplazamiento 3: Hola Mundo   ← ¡aquí! Tiene sentido
Desplazamiento 4: Gnkz Ltmcn
...
Desplazamiento 25: Lspe Qyrhs
```

En 3 intentos lo encontramos. **Por eso el César no sirve para nada serio**: solo 25 claves posibles se prueban en segundos.

> ⚠️ **César NO es seguro**. Solo 25 desplazamientos posibles. Se rompe en segundos. Pero es perfecto para aprender el concepto. El cifrado serio que sí puedes usar en producción lo verás en la [U09 · Cifrado Moderno](/ApuntesPSP/09-cifrado-moderno) con AES y RSA.

---

## 🧠 Mini-chequeo

1. ¿Cómo se descifra un mensaje César si conoces el desplazamiento?
2. ¿Por qué `% 26` es imprescindible en la fórmula?
3. ¿Cuántos desplazamientos distintos hay que probar en fuerza bruta?

<details>
<summary>🔄 Respuestas</summary>

1. Aplicando `cifrar_cesar(texto, -desplazamiento)`: cifrar con el desplazamiento **negativo** devuelve el texto original. Descifrar es cifrar al revés.
2. Porque el alfabeto tiene 26 letras: al sumar el desplazamiento, `% 26` hace que la 'z' "dé la vuelta" a la 'a'. Sin él, los caracteres finales saldrían del alfabeto.
3. **25** (del 1 al 25). El 0 no cambia nada y el 26 equivale al 0. Por eso se rompe en segundos.
</details>

---

## ✅ Resumen en 3 frases

- El César desplaza cada letra un número fijo de posiciones; descifrar es desplazar hacia atrás (desplazamiento negativo).
- Es un cifrado **reversible** con clave (el desplazamiento), al contrario que el hash: se puede recuperar el mensaje original.
- Con solo 25 desplazamientos posibles, se rompe por fuerza bruta al instante: inútil en producción, perfecto para aprender.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Cifrado César | Desplazar cada letra un número fijo de posiciones |
| Desplazamiento | La "clave": cuántas posiciones se mueve cada letra |
| % 26 | Módulo que mantiene las letras dentro del alfabeto |
| Fuerza bruta | Probar todas las claves posibles (aquí, 25) |
| isalpha() | Devuelve True si el carácter es una letra |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-hash-y-cifrado-clasico) · **Anterior:** [05 · Hash con sal](/ApuntesPSP/08-hash-y-cifrado-clasico/05-hash-con-sal) · **Siguiente:** [07 · Hash vs Cifrado](/ApuntesPSP/08-hash-y-cifrado-clasico/07-hash-vs-cifrado)