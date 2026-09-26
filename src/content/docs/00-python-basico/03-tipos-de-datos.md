---
title: 03 — Tipos de datos y operadores
description: Enteros, floats, booleans, strings, None y sus operadores 🔢
---

<p><small>Enteros, floats, booleans, strings, None y sus operadores 🔢</small></p>

> 🗺️ **Estás en:** 🐍 **U01 · Python 3 básico** → 03 · Tipos de datos y operadores

---

## 📬 La idea en una frase

> Todo en Python es un objeto con un tipo. Los tipos primitivos son enteros, floats, booleans, strings y None. Cada tipo tiene sus operadores, y Python deduce el tipo automáticamente.

No necesitas declarar tipos como en C o Java. Python **adivina** el tipo cuando asignas un valor. Si escribas `x = 5`, `x` es un entero. Si luego escribes `x = "hola"`, pasa a ser un string. Eso es el **tipado dinámico**.

![Diagrama de los cinco tipos primitivos de Python — int, float, bool, str y None — como objetos que cuelgan de la idea de que todo es un objeto](/ApuntesPSP/diagrams/tipos-primitivos.svg)

---

## 🔢 Números enteros (int)

Los enteros no tienen límite de tamaño: puedes tener números enormes sin preocuparte.

```python
3       # => 3
-10     # => -10
1000000 # => 1000000
```

### Operaciones aritméticas

```python
1 + 1       # => 2
8 - 1       # => 7
10 * 2      # => 20
(1 + 3) * 2  # => 8   (paréntesis refuerzan la precedencia)
```

### División

La división con `/` **siempre** devuelve un float (decimal), incluso entre enteros:

```python
35 / 5   # => 7.0  (float, no int)
34 / 5   # => 6.8
```

Si quieres un resultado entero con truncado de decimales, usa `//`:

```python
34 // 5  # => 6   (trunca los decimales)
35 // 5  # => 7
```

### Potencia y módulo

```python
2 ** 3    # => 8   (2 elevado a 3)
10 % 3    # => 1   (resto de la división: 10 / 3 = 3 resto 1)
```

---

## 🏊 Números decimales (float)

Cuando un operador es float, el resultado siempre es float:

```python
3 * 2.0    # => 6.0
3.5 + 1.2  # => 4.7
```

Cuidado con la precisión de los floats:

```python
0.1 + 0.2  # => 0.30000000000000004  (no exacto)
```

Esto no es un error de Python: es cómo funciona el formato de punto flotante en todos los lenguajes. Para cálculos que requieren precisión exacta (dinero, por ejemplo), se usa el módulo `decimal`.

---

## ✅ Booleanos (bool)

Dos valores: `True` y `False` (con mayúscula inicial).

```python
True
False
```

### Operador lógico `not`

```python
not True   # => False
not False  # => True
```

### Comparaciones (devuelven bool)

```python
1 == 1     # => True    (igualdad)
2 == 1     # => False
1 != 1     # => False   (desigualdad)
2 != 1     # => True
1 < 10     # => True
1 > 10     # => False
2 <= 2     # => True
2 >= 2     # => True
```

### Comparaciones encadenadas

Python permite encadenar comparaciones, como en las matemáticas:

```python
1 < 2 < 3    # => True   (equivalente a 1 < 2 and 2 < 3)
2 < 3 < 2    # => False
```

---

## 📝 Strings (str)

Los strings son cadenas de texto. Se crean con comillas simples `'` o dobles `"`:

```python
"Hola mundo"
'Hola mundo'
```

### Concatenación

```python
"Hola " + "mundo!"   # => "Hola mundo!"
```

### Acceso a caracteres

Un string se puede tratar como una lista de caracteres (los índices empiezan en 0):

```python
"Hola"[0]    # => 'H'
"Hola"[-1]   # => 'o'  (el último carácter)
```

### Formato de strings

#### Método `.format()`

```python
"{} pueden ser {}".format("strings", "interpolados")
# => "strings pueden ser interpolados"

# Reutilizar argumentos por posición
"{0} sé ligero, {0} sé rápido".format("Jack")
# => "Jack sé ligero, Jack sé rápido"

# Usar palabras clave
"{nombre} quiere comer {comida}".format(nombre="Bob", comida="lasaña")
# => "Bob quiere comer lasaña"
```

#### f-strings (Python 3.6+)

La forma moderna y más cómoda: pon `f` antes de la comilla e incluye variables entre `{}`:

```python
nombre = "Bob"
comida = "Lasaña"
f"{nombre} quiere comer {comida}"   # => "Bob quiere comer lasaña"
```

Las f-strings son la forma recomendada en Python moderno.

### Métodos útiles

```python
"Hola Mundo".lower()      # => "hola mundo"
"Hola Mundo".upper()      # => "HOLA MUNDO"
"Hola Mundo".replace("Mundo", "Python")  # => "Hola Python"
"hola mundo".split()      # => ["hola", "mundo"]
"  hola  ".strip()        # => "hola" (elimina espacios al inicio y final)
```

---

## 🕳️ None

`None` es el valor que representa "nada". Es un objeto único de tipo `NoneType`:

```python
None   # => None
```

### Comparar con None

**No uses `==`** para comparar con None. Usa `is`:

```python
"etc" is None   # => False
None is None    # => True
```

### Valores que se evalúan como False

`None`, `0`, strings vacíos, listas vacías, diccionarios vacíos y conjuntos vacíos se evalúan como `False` en un contexto booleano:

```python
bool(0)     # => False
bool("")    # => False
bool([])    # => False
bool({})    # => False
bool(set()) # => False
```

Todo lo demás se evalúa como `True`.

---

## 🔧 Funciones de conversión

```python
int(3.7)      # => 3    (trunca, no redondea)
float(5)      # => 5.0
str(100)      # => "100"
bool(1)       # => True
bool(0)       # => False
bool("hola")  # => True
bool("")      # => False
```

---

## 🧠 Mini-chequeo

1. ¿Qué devuelve `10 / 2` en Python 3? ¿Y `10 // 2`?
2. ¿Cuál es la diferencia entre `==` y `is`?
3. ¿Por qué `0.1 + 0.2` no da exactamente `0.3`?

<details>
<summary>🔄 Respuestas</summary>

1. `10 / 2` devuelve `5.0` (float). `10 // 2` devuelve `5` (int, división entera).
2. `==` compara **valores**: `1 == 1.0` es `True`. `is` compara **identidad de objeto**: `1 is 1.0` es `False`.
3. Por la precisión del formato de punto flotante. `0.1` y `0.2` no se representan exactamente en binario, por lo que la suma acumula un pequeño error. No es un bug de Python.

</details>

---

## ✅ Resumen en 3 frases

- Los tipos primitivos son `int`, `float`, `bool`, `str` y `None`; Python deduce el tipo automáticamente.
- La división `/` devuelve float; `//` devuelve entero con truncado.
- Usa `is` para comparar con None y f-strings para formatear texto de forma moderna.

---

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| **int** | Número entero, sin límite de tamaño |
| **float** | Número decimal (punto flotante) |
| **bool** | Booleano: `True` o `False` |
| **str** | String, cadena de texto |
| **None** | Valor que representa "nada" |
| **Tipado dinámico** | El tipo se deduce al asignar, no se declara |
| **f-string** | Formato de strings moderno con `f"..."` |
| **Concatenación** | Unir strings con `+` |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/00-python-basico) · **Anterior:** [02 · Comentarios](/ApuntesPSP/00-python-basico/02-comentarios) · **Siguiente:** [04 · Variables y colecciones](/ApuntesPSP/00-python-basico/04-variables-y-colecciones)
