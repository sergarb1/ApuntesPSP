---
title: "04 — Cifrado clásico"
description: "César, fuerza bruta y la gran pregunta: ¿hash o cifrado? 🏛️"
---

<p><small>César, fuerza bruta y la gran pregunta: ¿hash o cifrado? 🏛️</small></p>

> 🗺️ **Estás en:** 🔐 **UD 9 · Seguridad y cifrado** → 04 · Cifrado clásico

---

## 📬 La idea en una frase

> El **cifrado César** desplaza cada letra un número fijo de posiciones: es el cifrado más antiguo que se conoce y, también, el más fácil de romper. Mientras el hash no se puede deshacer, el César **sí** se descifra con una clave.

---

## 🏛️ La historia: Julio César y su desplazamiento de 3

Julio César, para que sus mensajes militares no fueran leídos si caían en manos enemigas, desplazaba **cada letra 3 posiciones** en el alfabeto.


![Diagrama del cifrado César: cada letra del alfabeto se desplaza tres posiciones](/ApuntesPSP/diagrams/cesar.svg)

"Hola Mundo" con desplazamiento 3 → **"Krod Pxqgr"**.

---

## 🐍 Cifrar y descifrar en Python

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

Dos detalles:

- **`caracter.isupper()`** decide si la base es `ord('A')` o `ord('a')`, para que las mayúsculas sigan siendo mayúsculas.
- **Descifrar es cifrar con desplazamiento negativo**: no hace falta otra función.

---

## 💥 Romperlo por fuerza bruta

El desplazamiento solo puede ser un número del **1 al 25**. Prueba los 25 y mira cuál tiene sentido:

```python
cifrado = "Krod Pxqgr"
for desplazamiento in range(1, 26):
    intento = cifrar_cesar(cifrado, -desplazamiento)
    print(f"Desplazamiento {desplazamiento}: {intento}")
```

En 3 intentos lo encontramos. **Por eso el César no sirve para nada serio**: solo 25 claves posibles se prueban en segundos.

---

## 🥊 Hash vs Cifrado: el ring de los conceptos

> *Dos mecanismos de seguridad se citan para resolver de una vez quién hace qué.*

**Hash**: — Yo soy la huella digital. Transformo cualquier texto en una cadena fija. No se puede deshacer. Unidireccional. Para siempre.

**Cifrado**: — Vaya, qué drástico. Yo puedo cifrar y descifrar. Tengo clave. Si tú pierdes un hash, no hay vuelta atrás. Yo puedo recuperar el mensaje original.

**Hash**: — ¡Esa es precisamente mi gracia! Para contraseñas no quieres que se pueda deshacer.

**Cifrado**: — Pero para enviar un mensaje secreto, el hash no sirve. Necesitas que el destinatario pueda leerlo. Ahí entro yo.

**Hash**: — Y para verificar integridad, nadie me gana. Si cambia un bit, el hash cambia por completo.

**Cifrado**: — Al final, cada uno a lo suyo. Tú para integridad y contraseñas; yo para confidencialidad.

---

## ⚖️ La moraleja: cada uno a lo suyo

| | Hash | Cifrado |
|---|---|---|
| **¿Qué hace?** | Resume en una huella de longitud fija | Transforma con una clave |
| **¿Reversible?** | ❌ No, unidireccional | ✅ Sí, con la clave |
| **Protege** | Integridad (y contraseñas) | Confidencialidad |
| **Ejemplo típico** | Checksum de descarga, login | Enviar un mensaje secreto |

> **Moraleja**: El hash verifica integridad (no se puede deshacer). El cifrado protege confidencialidad (se puede deshacer con la clave). Ambos son necesarios.

---

## 🎬 La escena que lo aclara todo

Imagina que envías un mensaje secreto por una red hostil:

- **Solo cifrado:** el mensaje llega cifrado, pero ¿y si un atacante lo modifica por el camino? La confidencialidad estaba protegida; la **integridad, no**.
- **Solo hash:** puedes comprobar que el mensaje no cambió, pero cualquier persona que lo intercepte **lo lee tal cual**. La integridad estaba protegida; la **confidencialidad, no**.
- **Cifrado + hash:** cifras el mensaje (nadie lo lee) y además calculas su hash (el destinatario comprueba que nadie lo tocó). Así lo hacen de verdad los sistemas serios.

---

## 🧠 Mini-chequeo

1. ¿Cómo se descifra un mensaje César si conoces el desplazamiento?
2. Si quieres que nadie pueda leer un mensaje, ¿qué necesitas: hash o cifrado?
3. ¿Por qué un hash sirve para guardar contraseñas y el cifrado no es la mejor opción?

<details>
<summary>🔄 Respuestas</summary>

1. Aplicando `cifrar_cesar(texto, -desplazamiento)`: cifrar con el desplazamiento **negativo** devuelve el texto original.
2. **Cifrado**: es reversible con la clave, así que el destinatario puede leerlo.
3. Porque para contraseñas no queremos recuperarlas nunca, solo comprobar que coinciden. El hash es unidireccional (perfecto); el cifrado es reversible y, si roban la clave, recuperan todo.
</details>

---

## ✅ Resumen en 3 frases

- El César desplaza cada letra un número fijo; descifrar es desplazar hacia atrás. Con solo 25 claves posibles, se rompe al instante.
- El hash es **unidireccional** (integridad, contraseñas); el cifrado es **reversible con clave** (confidencialidad).
- No se excluyen: en los sistemas reales se combinan (cifrar para esconder, hashear para verificar).

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Cifrado César | Desplazar cada letra un número fijo de posiciones |
| Integridad | Que un dato no ha sido modificado (hash) |
| Confidencialidad | Que solo quien corresponde lo lea (cifrado) |
| Unidireccional | Imposible de revertir, propia del hash |
| Reversible con clave | Se deshace con la clave correcta, propia del cifrado |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-seguridad-y-cifrado) · **Anterior:** [03 · Contraseñas seguras](/ApuntesPSP/08-seguridad-y-cifrado/03-contrasenas-seguras) · **Siguiente:** [05 · Cifrado simétrico (AES)](/ApuntesPSP/08-seguridad-y-cifrado/05-cifrado-simetrico-aes)
