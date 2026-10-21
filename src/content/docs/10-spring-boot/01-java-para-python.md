---
title: "01 — Java para desarrolladores Python"
description: "Puente rápido entre Python y Java: tipos, clases, concurrencia ☕"
---

<p><small>Puente rápido entre Python y Java: tipos, clases, concurrencia ☕</small></p>

> 🗺️ **Estás en:** ☕ **UD 11 · Spring Boot** → 01 · Java para desarrolladores Python

---

## 📬 La idea en una frase

> Java es **estáticamente tipado** (el tipo se declara al crear la variable) y **orientado a objetos** (todo vive dentro de clases). Donde Python es flexible y conciso, Java es explícito y estructurado. Cambia la sintaxis, no el pensamiento.

---

## 🔄 Python vs Java: la comparativa rápida

| Concepto | Python | Java |
|----------|--------|------|
| Declarar variable | `x = 10` | `int x = 10;` |
| Función | `def hola(nombre):` | `public void hola(String nombre) {}` |
| Clase | `class Gato:` | `public class Gato {}` |
| Lista | `lista = [1, 2, 3]` | `List<Integer> lista = List.of(1, 2, 3);` |
| Imprimir | `print(x)` | `System.out.println(x);` |
| Null | `None` | `null` |
| Comentario | `# esto` | `// esto` |

---

## 🐍 Tipos básicos

```java
public class TiposBasicos {
    public static void main(String[] args) {
        int entero = 42;
        double decimal = 3.14;
        boolean activo = true;
        String texto = "Hola Mundo";
        char letra = 'A';

        System.out.println("Entero: " + entero);
        System.out.println("Decimal: " + decimal);
        System.out.println("Activo: " + activo);
        System.out.println("Texto: " + texto);
        System.out.println("Letra: " + letra);
    }
}
```

**Diferencia clave:** en Python todo es dinámico. En Java **declaras el tipo** (`int`, `double`, `String`...). Eso da más seguridad: el compilador detecta errores antes de ejecutar.

---

## 📦 Colecciones

```java
import java.util.*;

List<String> frutas = new ArrayList<>(List.of("manzana", "pera", "uva"));
frutas.add("naranja");
System.out.println(frutas);  // [manzana, pera, uva, naranja]

Map<String, Integer> edades = new HashMap<>();
edades.put("Ana", 25);
edades.put("Bob", 30);
System.out.println(edades.get("Ana"));  // 25
```

**Comparativa:**

| Python | Java |
|--------|------|
| `lista = [1, 2, 3]` | `List<Integer> lista = new ArrayList<>(List.of(1, 2, 3));` |
| `dic = {"a": 1}` | `Map<String, Integer> dic = new HashMap<>();` |
| `for x in lista:` | `for (int x : lista) {}` |

---

## 🏗️ Clases y objetos

```java
public class Gato {
    private String nombre;
    private int vidas;

    // Constructor
    public Gato(String nombre) {
        this.nombre = nombre;
        this.vidas = 9;
    }

    // Método
    public void maullar() {
        System.out.println(nombre + ": ¡Miau!");
    }

    // Getter
    public String getNombre() {
        return nombre;
    }
}

// Uso
Gato miGato = new Gato("Felix");
miGato.maullar();  // Felix: ¡Miau!
```

**Comparativa con Python:**

```python
# Python
class Gato:
    def __init__(self, nombre):
        self.nombre = nombre
        self.vidas = 9

    def maullar(self):
        print(f"{self.nombre}: ¡Miau!")

mi_gato = Gato("Felix")
mi_gato.maullar()
```

**Diferencias clave:**
- Java usa `private` para encapsular (Python no tiene privados reales).
- Java necesita `public` para acceder desde fuera.
- Java usa `this.` explícitamente.
- Java tiene **interfaces** (como Python abstracto, pero forzado).

---

## ⚡ Concurrencia

```java
// Java: hilos con Thread
Thread hilo = new Thread(() -> {
    System.out.println("Hilo en ejecución");
});
hilo.start();
hilo.join();
```

**Comparativa:**

| Python | Java |
|--------|------|
| `threading.Thread(target=fn)` | `new Thread(() -> { ... })` |
| `hilo.start()` | `hilo.start()` |
| `hilo.join()` | `hilo.join()` |
| GIL (un hilo a la vez en CPU) | Sin GIL (hilos reales en paralelo) |

> 💡 **Ventaja de Java:** sin GIL, los hilos truly paralelos en multiproceso. En Python necesitas `multiprocessing` para eso.

---

## 🧠 Mini-chequeo

1. ¿Qué diferencia hay entre `int x = 10;` en Java y `x = 10` en Python?
2. ¿Por qué Java usa `private` en los atributos de una clase?
3. ¿Cuál es la ventaja de Java sobre Python en concurrencia?

<details>
<summary>🔄 Respuestas</summary>

1. En Java **declaras el tipo** (`int`); en Python no. Java detecta errores de tipo en compilación; Python en ejecución.
2. Para **encapsular**: solo se puede acceder al atributo a través de getters/setters. En Python los "privados" son por convención (`_nombre`), no por fuerza.
3. Java **no tiene GIL**: los hilos truly paralelos en multiproceso. En Python el GIL limita un hilo a la vez en CPU.
</details>

---

## ✅ Resumen en 3 frases

- Java es estáticamente tipado y orientado a objetos: declara tipos, usa clases con `private`/`public`, y tiene interfaces forzadas.
- Las colecciones (`List`, `Map`) son como las de Python pero con tipos explícitos.
- En concurrencia, Java gana por no tener GIL: hilos truly paralelos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| JDK | Java Development Kit: compila y ejecuta Java |
| Estáticamente tipado | El tipo se declara al crear la variable |
| GIL | Global Interpreter Lock: limita Python a un hilo en CPU |
| Interfaz | Contrato que una clase debe cumplir (métodos obligatorios) |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-spring-boot) · **Siguiente:** [02 · Introducción a Spring Boot](/ApuntesPSP/10-spring-boot/02-introduccion-spring-boot)
