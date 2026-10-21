---
title: Boletín UD 11 — Inicial
description: Ejercicios básicos de Spring Boot y Java
---

# 📝 Boletín UD 11 — Inicial

> Ejercicios básicos para afianzar el puente Python → Java: tipos, clases, inyección de dependencias, controladores REST y JPA. En este boletín escribes **Java**, no Python.

---

## 1. Hola, Java

Crea una clase `Saludo` con un `main` que imprima "Hola, PSP desde Java".

**Pista:** en Java todo vive dentro de una clase: `public class Saludo { public static void main(String[] args) { ... } }`.

## 2. Variables y tipos

Declara e imprime: un `int` con la nota media, un `double` con tu altura en metros, un `boolean` si has aprobado y un `String` con tu nombre. Usa `System.out.println`.

**Pista:** en Java cada tipo tiene tamaño fijo (`int` 32 bits, `double` doble precisión) y no se declaran con `=` inferido salvo con `var`.

## 3. Lista de la compra

Crea una `ArrayList<String>` con 4 productos, añade un quinto con `add`, imprime la lista completa y cuántos elementos tiene con `size()`.

**Pista:** `List<String> compra = new ArrayList<>();` — las colecciones se declaran con la interfaz, no con la clase concreta.

## 4. Clase `Alumno`

Crea la clase `Alumno` con atributos `nombre` y `nota`, un constructor con ambos parámetros y un método `String aprobado()` que devuelva "SUSPENSO" si nota < 5 y "APROBADO" si no. Crea dos objetos y muéstralos.

**Pista:** `public String aprobado() { return nota < 5 ? "SUSPENSO" : "APROBADO"; }` — el operador ternario funciona como en Python.

## 5. Tu primer `@RestController`

Crea un controlador `SaludoController` con un `@GetMapping("/saludo")` que devuelva el texto "Hola desde Spring". ¿Qué anotación marca la clase como controlador REST?

**Pista:** `@RestController` (equivale a `@Controller` + `@ResponseBody`: devuelve datos, no vistas).

## 6. Parámetro en la ruta

Añade al controlador un `@GetMapping("/saludo/{nombre}")` que reciba el nombre de la ruta y devuelva "Hola, {nombre}". Usa `@PathVariable`.

**Pista:** el método recibe `@PathVariable String nombre` y Spring lo enlaza con `{nombre}` de la ruta.

## 7. JSON de respuesta

Crea la clase `Tarea` con campos `id` (long) y `titulo` (String), con constructor y getters. Devuélvela desde un `@GetMapping("/tarea")`. ¿Qué biblioteca convierte el objeto a JSON?

**Pista:** Spring incluye **Jackson**, que serializa los objetos a JSON automáticamente al devolverlos desde un `@RestController`.

## 8. Entidad JPA mínima

Crea la entidad `Producto` (campos `id`, `nombre`, `precio`) con las anotaciones `@Entity` y `@Id`. Indica qué anotación marca la clave primaria y cuál hace que la tabla se genere con ID autoincremental.

**Pista:** `@Id` marca la clave primaria; `@GeneratedValue(strategy = GenerationType.IDENTITY)` la hace autoincremental (como `INTEGER PRIMARY KEY AUTOINCREMENT` en SQLite).

**Pista extra:** recuerda que Spring necesita `spring-boot-starter-data-jpa` en el `pom.xml` y una BD (H2 en memoria vale) en `application.properties`.
