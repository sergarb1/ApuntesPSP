---
title: "04 — RESTController y APIs REST"
description: "Crear endpoints REST con Spring Boot: GET, POST, PUT, DELETE 🌐"
---

<p><small>Crear endpoints REST con Spring Boot: GET, POST, PUT, DELETE 🌐</small></p>

> 🗺️ **Estás en:** ☕ **UD 11 · Spring Boot** → 04 · RESTController y APIs REST

---

## 📬 La idea en una frase

> Un **@RestController** expone endpoints HTTP que devuelven JSON. Spring Boot se encarga de convertir objetos Java a JSON automáticamente. Es como Flask, pero sin `jsonify()`.

---

## 🆚 Flask vs @RestController

```python
# Flask
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/tareas', methods=['GET'])
def listar_tareas():
    return jsonify([{"id": 1, "titulo": "Estudiar"}])
```

```java
// Spring Boot
@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @GetMapping
    public List<Tarea> listarTareas() {
        return List.of(new Tarea(1L, "Estudiar"));
    }
}
```

**Diferencia clave:** en Spring, **no necesitas `jsonify()`**. El objeto Java se convierte a JSON automáticamente (gracias a Jackson).

---

## 🏷️ Las anotaciones de routing

| Anotación | Método HTTP | Equivalente Flask |
|-----------|-------------|-------------------|
| `@GetMapping` | GET | `@app.route(..., methods=['GET'])` |
| `@PostMapping` | POST | `@app.route(..., methods=['POST'])` |
| `@PutMapping` | PUT | `@app.route(..., methods=['PUT'])` |
| `@DeleteMapping` | DELETE | `@app.route(..., methods=['DELETE'])` |
| `@RequestMapping` | Cualquiera | `@app.route(...)` |

---

## 📝 Ejemplo completo: API de tareas

```java
@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaService service;

    public TareaController(TareaService service) {
        this.service = service;
    }

    // GET /api/tareas
    @GetMapping
    public List<Tarea> listar() {
        return service.listarTodas();
    }

    // GET /api/tareas/{id}
    @GetMapping("/{id}")
    public Tarea obtener(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    // POST /api/tareas
    @PostMapping
    public Tarea crear(@RequestBody Tarea tarea) {
        return service.crear(tarea);
    }

    // PUT /api/tareas/{id}
    @PutMapping("/{id}")
    public Tarea actualizar(@PathVariable Long id, @RequestBody Tarea tarea) {
        return service.actualizar(id, tarea);
    }

    // DELETE /api/tareas/{id}
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
```

---

## 🔑 Las anotaciones clave

| Anotación | Qué hace |
|-----------|----------|
| `@RestController` | Marca la clase como controlador REST (devuelve JSON) |
| `@RequestMapping("/api/tareas")` | Prefijo de ruta para todos los endpoints |
| `@GetMapping` | Endpoint GET |
| `@PathVariable` | Extrae un parámetro de la URL (`/api/tareas/{id}`) |
| `@RequestBody` | Convierte el body JSON a un objeto Java |

---

## 📦 El modelo

```java
public class Tarea {
    private Long id;
    private String titulo;
    private boolean completada;

    // Constructor vacío (necesario para Jackson)
    public Tarea() {}

    public Tarea(Long id, String titulo, boolean completada) {
        this.id = id;
        this.titulo = titulo;
        this.completada = completada;
    }

    // Getters y Setters (Jackson los usa para serializar)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public boolean isCompletada() { return completada; }
    public void setCompletada(boolean completada) { this.completada = completada; }
}
```

> 💡 Jackson convierte el objeto a JSON usando los **getters**. Si un campo no tiene getter, no aparece en el JSON.

---

## 🧠 Mini-chequeo

1. ¿Qué hace `@RestController` que no haga `@Controller`?
2. ¿Cómo se convierte un objeto Java a JSON en Spring Boot?
3. ¿Qué anotación extrae un parámetro de la URL?

<details>
<summary>🔄 Respuestas</summary>

1. `@RestController` añade `@ResponseBody` automáticamente: todos los métodos devuelven datos (JSON), no vistas HTML.
2. **Jackson** lo hace automáticamente: detecta los getters del objeto y genera el JSON correspondiente.
3. `@PathVariable`: extrae `{id}` de la URL y lo pasa como parámetro del método.
</details>

---

## ✅ Resumen en 3 frases

- `@RestController` expone endpoints REST que devuelven JSON automáticamente.
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` mapean métodos HTTP.
- `@PathVariable` extrae de la URL; `@RequestBody` convierte el body JSON a objeto Java.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| `@RestController` | Controlador que devuelve JSON (no vistas) |
| `@RequestMapping` | Define la ruta base del controlador |
| `@PathVariable` | Parámetro de la URL (`/tareas/{id}`) |
| `@RequestBody` | Body JSON convertido a objeto Java |
| Jackson | Biblioteca que serializa Java ↔ JSON |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-spring-boot) · **Anterior:** [03 · Inyección de dependencias](/ApuntesPSP/10-spring-boot/03-inyeccion-de-dependencias) · **Siguiente:** [05 · JPA y bases de datos](/ApuntesPSP/10-spring-boot/05-jpa-y-bases-de-datos)
