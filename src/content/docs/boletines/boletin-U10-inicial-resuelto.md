---
title: Boletín UD 11 — Inicial (Resuelto)
description: Soluciones de los ejercicios básicos de Spring Boot y Java
---

# ✅ Boletín UD 11 — Inicial (Resuelto)

---

## 1. Hola, Java

```java
public class Saludo {
    public static void main(String[] args) {
        System.out.println("Hola, PSP desde Java");
    }
}
```

En Java todo vive dentro de una clase; `main` debe ser `public static void`. Se compila con `javac Saludo.java` y se ejecuta con `java Saludo`.

## 2. Variables y tipos

```java
public class Tipos {
    public static void main(String[] args) {
        int notaMedia = 7;
        double altura = 1.75;
        boolean aprobado = true;
        String nombre = "Sergi";

        System.out.println("Nota: " + notaMedia);
        System.out.println("Altura: " + altura);
        System.out.println("Aprobado: " + aprobado);
        System.out.println("Nombre: " + nombre);
    }
}
```

En Java los tipos tienen tamaño fijo y no se infieren (salvo `var`). La concatenación de strings se hace con `+`.

## 3. Lista de la compra

```java
import java.util.ArrayList;
import java.util.List;

public class Compra {
    public static void main(String[] args) {
        List<String> compra = new ArrayList<>();
        compra.add("Pan");
        compra.add("Leche");
        compra.add("Huevos");
        compra.add("Café");
        compra.add("Arroz");

        System.out.println(compra);
        System.out.println("Elementos: " + compra.size());
    }
}
```

Se declara con la interfaz (`List`) y se instancia con la clase (`ArrayList`). `size()` es el equivalente a `len()` de Python.

## 4. Clase `Alumno`

```java
public class Alumno {
    String nombre;
    double nota;

    public Alumno(String nombre, double nota) {
        this.nombre = nombre;
        this.nota = nota;
    }

    public String aprobado() {
        return nota < 5 ? "SUSPENSO" : "APROBADO";
    }

    public static void main(String[] args) {
        Alumno a1 = new Alumno("Ana", 8.5);
        Alumno a2 = new Alumno("Luis", 4.2);
        System.out.println(a1.nombre + ": " + a1.aprobado());
        System.out.println(a2.nombre + ": " + a2.aprobado());
    }
}
```

`this.nombre` distingue el atributo del parámetro. El operador ternario funciona igual que en Python.

## 5. Tu primer `@RestController`

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SaludoController {

    @GetMapping("/saludo")
    public String saludo() {
        return "Hola desde Spring";
    }
}
```

La anotación de la clase es **`@RestController`**: combina `@Controller` (componente web) y `@ResponseBody` (el valor devuelto se serializa, no es una vista).

## 6. Parámetro en la ruta

```java
@GetMapping("/saludo/{nombre}")
public String saludoNombre(@PathVariable String nombre) {
    return "Hola, " + nombre;
}
```

`@PathVariable` enlaza el trozo `{nombre}` de la ruta con el parámetro del método. `GET /saludo/Ana` devuelve "Hola, Ana".

## 7. JSON de respuesta

```java
public class Tarea {
    private long id;
    private String titulo;

    public Tarea(long id, String titulo) {
        this.id = id;
        this.titulo = titulo;
    }

    public long getId() { return id; }
    public String getTitulo() { return titulo; }
}
```

```java
@GetMapping("/tarea")
public Tarea tarea() {
    return new Tarea(1, "Estudiar PSP");
}
```

La biblioteca es **Jackson**, incluida en `spring-boot-starter-web`. Serializa el objeto usando los getters: `{"id":1,"titulo":"Estudiar PSP"}`.

## 8. Entidad JPA mínima

```java
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private double precio;

    // Constructores, getters y setters
}
```

- **`@Entity`**: la clase es una entidad persistente (una tabla).
- **`@Id`**: marca la clave primaria.
- **`@GeneratedValue(IDENTITY)`**: la BD genera el ID autoincremental.

Spring necesita `spring-boot-starter-data-jpa` en el `pom.xml` y una BD configurada (H2 en memoria vale con `spring.datasource.url=jdbc:h2:mem:testdb`).
