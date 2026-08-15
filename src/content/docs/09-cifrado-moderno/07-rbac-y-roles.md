---
title: 07 — RBAC y roles
description: Control de acceso basado en roles 👥
---

<p><small>Control de acceso basado en roles 👥</small></p>

> 🗺️ **Estás en:** 🧬 **U09 · Cifrado Moderno** → 07 · RBAC y roles

---

## 📬 La idea en una frase

> **RBAC** (*Role-Based Access Control*) es la forma de decidir **quién puede hacer qué**: los permisos no se asignan a cada persona, sino a su **rol**, y cada usuario hereda los permisos de su rol. Es el principio de **mínimo privilegio** de la U08 llevado a la práctica.

Un becario no necesita borrar la tabla de usuarios. Un editor no necesita compartir documentos con el mundo. Con roles, esa regla se escribe **una sola vez** y se aplica a todos: cambias el rol y cambian los permisos, sin tocar al usuario.

---

## 🧩 Los actores

```python
class Usuario:
    def __init__(self, nombre, rol):
        self.nombre = nombre
        self.rol = rol

class Documento:
    def __init__(self, titulo, contenido):
        self.titulo = titulo
        self.contenido = contenido

PERMISOS = {
    "admin":  ["leer", "escribir", "borrar", "compartir"],
    "editor": ["leer", "escribir"],
    "lector": ["leer"],
}

def puede(usuario, accion):
    return accion in PERMISOS.get(usuario.rol, [])

ana = Usuario("Ana", "admin")
bob = Usuario("Bob", "lector")

print(f"Ana puede borrar: {puede(ana, 'borrar')}")    # True
print(f"Bob puede borrar: {puede(bob, 'borrar')}")    # False
```

```
Ana puede borrar: True
Bob puede borrar: False
```

**Cómo funciona la máquina:**

- `PERMISOS` es un diccionario **rol → lista de acciones**.
- `puede(usuario, accion)` mira el rol del usuario y comprueba si la acción está en su lista.
- `PERMISOS.get(usuario.rol, [])` devuelve lista vacía para roles desconocidos: **por defecto, nada permitido** (mínimo privilegio).

---

## 📋 La matriz de permisos

| Rol | Leer | Escribir | Borrar | Compartir |
|-----|------|----------|--------|-----------|
| admin | ✅ | ✅ | ✅ | ✅ |
| editor | ✅ | ✅ | ❌ | ❌ |
| lector | ✅ | ❌ | ❌ | ❌ |

> 💡 **Matriz de control de acceso:** esta tabla es la "constitución" del sistema. Antes de escribir una sola línea de RBAC, decides quién tiene qué; luego la implementas, como en el código anterior. Si un permiso cambia, solo cambias la tabla (y el diccionario), nunca a cada usuario.

---

## 🔐 RBAC también protege la criptografía

En un sistema real, RBAC no solo decide leer/escribir: también decide **quién puede cifrar, descifrar o firmar**.

```python
PERMISOS = {
    "admin":    ["cifrar", "descifrar", "firmar"],
    "usuario":  ["cifrar", "firmar"],
    "invitado": ["cifrar"],
}

def puede(usuario, accion):
    return accion in PERMISOS.get(usuario["rol"], [])

print(puede({"rol": "admin"}, "descifrar"))   # True
print(puede({"rol": "invitado"}, "firmar"))   # False
```

La combinación de cifrado + RBAC es la que usan los sistemas de archivos cifrados, los repositorios de secretos y las plataformas de gestión de claves: **incluso con la clave correcta, sin el rol correcto no se puede**.

---

## 🧠 Mini-chequeo

1. ¿Qué ventaja tiene asignar permisos por rol y no por usuario?
2. ¿Qué devuelve `puede` para un usuario con un rol que no está en `PERMISOS`?
3. ¿Qué relación tiene RBAC con el principio de mínimo privilegio?

<details>
<summary>🔄 Respuestas</summary>

1. Los permisos se gestionan **una vez por rol**: crear un usuario, cambiarle de rol o retirarle acceso es instantáneo, sin tocar a cada persona. Escala con el número de usuarios.
2. Devuelve `False`: `PERMISOS.get(usuario.rol, [])` usa la lista vacía por defecto. **Nada permitido** si el rol no existe.
3. RBAC es la **herramienta** del principio de mínimo privilegio: el principio dice *da solo lo necesario*, RBAC define *cómo* hacerlo de forma ordenada (a cada rol, su paquete de permisos, y nadie se sale del suyo).
</details>

---

## ✅ Resumen en 3 frases

- RBAC asigna permisos a **roles**, no a personas, y cada usuario hereda los de su rol.
- La **matriz rol × acción** es la regla del sistema; se implementa con un diccionario y una función `puede`.
- Es la puesta en práctica del **mínimo privilegio** de la U08, y controla también quién puede cifrar, descifrar o firmar.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| RBAC | Control de acceso basado en roles |
| Rol | El paquete de permisos de una función (admin, editor, lector) |
| Permiso | Una acción concreta (leer, escribir, borrar, compartir) |
| Matriz de acceso | Tabla rol × acción que define el sistema |
| Mínimo privilegio | Cada rol solo con los permisos que necesita |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/09-cifrado-moderno) · **Anterior:** [06 · Cifrado híbrido](/ApuntesPSP/09-cifrado-moderno/06-cifrado-hibrido) · **Siguiente:** [08 · Práctica: sistema seguro](/ApuntesPSP/09-cifrado-moderno/08-practica-sistema-seguro)