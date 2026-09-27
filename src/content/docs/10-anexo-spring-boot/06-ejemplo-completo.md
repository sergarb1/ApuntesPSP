---
title: "06 — Ejemplo completo: API de tareas"
description: "Crea una API REST completa con Spring Boot, JPA y H2 🏗️"
---

<p><small>Crea una API REST completa con Spring Boot, JPA y H2 🏗️</small></p>

> 🗺️ **Estás en:** ☕ **Anexo · Spring Boot** → 06 · Ejemplo completo

---

## 📬 La idea en una frase

> Vamos a montar una **API de tareas** completa: modelo, repositorio, servicio y controlador. CRUD completo con H2 en memoria. El "To-Do App" del mundo Spring Boot.

---

## 🏗️ El proyecto completo

### Paso 1: Modelo (`Tarea.java`)

```java
package com.ejemplo.tareas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tareas")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private boolean completada = false;

    // Constructor vacío (JPA lo necesita)
    public Tarea() {}

    public Tarea(String titulo) {
        this.titulo = titulo;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public boolean isCompletada() { return completada; }
    public void setCompletada(boolean completada) { this.completada = completada; }
}
```

---

### Paso 2: Repositorio (`TareaRepository.java`)

```java
package com.ejemplo.tareas.repository;

import com.ejemplo.tareas.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByCompletada(boolean completada);
}
```

---

### Paso 3: Servicio (`TareaService.java`)

```java
package com.ejemplo.tareas.service;

import com.ejemplo.tareas.model.Tarea;
import com.ejemplo.tareas.repository.TareaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TareaService {

    private final TareaRepository repo;

    public TareaService(TareaRepository repo) {
        this.repo = repo;
    }

    public List<Tarea> listarTodas() {
        return repo.findAll();
    }

    public Tarea obtenerPorId(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Tarea no encontrada: " + id));
    }

    public Tarea crear(Tarea tarea) {
        return repo.save(tarea);
    }

    public Tarea actualizar(Long id, Tarea datos) {
        Tarea tarea = obtenerPorId(id);
        tarea.setTitulo(datos.getTitulo());
        tarea.setCompletada(datos.isCompletada());
        return repo.save(tarea);
    }

    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}
```

---

### Paso 4: Controlador (`TareaController.java`)

```java
package com.ejemplo.tareas.controller;

import com.ejemplo.tareas.model.Tarea;
import com.ejemplo.tareas.service.TareaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaService service;

    public TareaController(TareaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Tarea> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Tarea obtener(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PostMapping
    public Tarea crear(@RequestBody Tarea tarea) {
        return service.crear(tarea);
    }

    @PutMapping("/{id}")
    public Tarea actualizar(@PathVariable Long id, @RequestBody Tarea tarea) {
        return service.actualizar(id, tarea);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
```

---

### Paso 5: Punto de entrada (`TareasApplication.java`)

```java
package com.ejemplo.tareas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TareasApplication {
    public static void main(String[] args) {
        SpringApplication.run(TareasApplication.class, args);
    }
}
```

---

## 🧪 Probar la API

```bash
# Crear tarea
curl -X POST http://localhost:8080/api/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Estudiar Spring Boot"}'

# Listar tareas
curl http://localhost:8080/api/tareas

# Obtener tarea por ID
curl http://localhost:8080/api/tareas/1

# Actualizar tarea
curl -X PUT http://localhost:8080/api/tareas/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Estudiar Spring Boot", "completada": true}'

# Eliminar tarea
curl -X DELETE http://localhost:8080/api/tareas/1
```

---

## 📊 La arquitectura en capas


![Diagrama de la arquitectura en capas de Spring Boot: Controller, Service, Repository y base de datos](/ApuntesPSP/diagrams/capas-spring.svg)

**Cada capa solo depende de la inferior:** Controller → Service → Repository → Database. Eso es **separación de capas** (como MVC en Python).

---

## 🧠 Mini-chequeo

1. ¿Por qué el modelo tiene un constructor vacío?
2. ¿Qué pasaría si eliminas `@Service` de `TareaService`?
3. ¿Por qué el controller depende del service y no del repository directamente?

<details>
<summary>🔄 Respuestas</summary>

1. JPA necesita instanciar el objeto sin parámetros para mapearlo desde la BD. Los campos se rellenan con setters.
2. Spring no lo detectaría como bean y el controller no podría inyectarlo: la app fallaría al arrancar.
3. Separación de capas: el controller maneja HTTP, el service la lógica de negocio, el repository los datos. Mezclar rompe esa separación.
</details>

---

## ✅ Resumen en 3 frases

- Una API Spring Boot tiene 4 capas: Controller → Service → Repository → Model.
- El `@RestController` recibe HTTP y devuelve JSON; el `@Service` tiene la lógica; el `Repository` accede a la BD.
- Con JPA y H2, el CRUD se genera casi automáticamente.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Capas | Separación: Controller → Service → Repository → Model |
| `@Entity` | Clase que se mapea a una tabla |
| `@Service` | Lógica de negocio |
| `JpaRepository` | CRUD automático con JPA |

---

📚 [Volver al índice del anexo](/ApuntesPSP/10-anexo-spring-boot) · **Anterior:** [05 · JPA y bases de datos](/ApuntesPSP/10-anexo-spring-boot/05-jpa-y-bases-de-datos) · **Siguiente:** [07 · Cierre](/ApuntesPSP/10-anexo-spring-boot/07-cierre)
