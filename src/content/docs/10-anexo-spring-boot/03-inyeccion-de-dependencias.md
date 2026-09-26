---
title: "03 — Inyección de dependencias"
description: "IoC, @Autowired, Bean y por qué no creas tus propias instancias 🔧"
---

<p><small>IoC, @Autowired, Bean y por qué no creas tus propias instancias 🔧</small></p>

> 🗺️ **Estás en:** ☕ **Anexo · Spring Boot** → 03 · Inyección de dependencias

---

## 📬 La idea en una frase

> La **inyección de dependencias** (DI) significa que **no creas tus propias dependencias**: se las pides a un contenedor (Spring) que las crea y te las entrega. Como un restaurante donde no cocinas: pides y te traen la comida.

---

## 🍽️ La analogía del restaurante

Imagina un restaurante:

- **Sin DI (cocinas tú):** cada vez que necesitas una comida, vas al mercado, compras ingredientes, cocinas. Eres responsable de todo.
- **Con DI (restaurante):** pides la comida. El restaurante (contenedor) la prepara y te la trae. Tú solo consumes.

En código:

```java
// SIN DI: tú creas la dependencia
public class PedidoService {
    private PedidoRepository repo = new PedidoRepository();  // acoplamiento directo
}

// CON DI: Spring te la inyecta
@Service
public class PedidoService {
    private final PedidoRepository repo;

    public PedidoService(PedidoRepository repo) {  // Spring decide qué implementación usar
        this.repo = repo;
    }
}
```

---

## 🏭 El contenedor IoC

**IoC** (*Inversion of Control*) es el principio: el contenedor (Spring) controla la creación y lifecycle de los objetos (beans). Tú solo declaras qué necesitas.

![Diagrama del contenedor IoC de Spring: crea los beans y los inyecta, desde el Repository al Service y del Service al Controller, sin que tú hagas new](/ApuntesPSP/diagrams/spring-di-contenedor.svg)

```java
@Service
public class TareaService {
    private final TareaRepository repo;

    // Spring llama a este constructor y pasa el repository automáticamente
    public TareaService(TareaRepository repo) {
        this.repo = repo;
    }

    public List<Tarea> listarTodas() {
        return repo.findAll();
    }
}
```

> 💡 En Python equivaldría a que Flask creara automáticamente todas tus clases y las pasara como argumentos. No existe algo así de integrado en Python.

---

## 🏷️ Las anotaciones principales

| Anotación | Qué hace |
|-----------|----------|
| `@Component` | Marca una clase como "bean" gestionado por Spring |
| `@Service` | Como `@Component`, pero para servicios de negocio |
| `@Repository` | Como `@Component`, pero para acceso a datos |
| `@Controller` | Como `@Component`, pero para controladores web |
| `@RestController` | Como `@Controller`, pero con `@ResponseBody` automático |
| `@Autowired` | Inyecta una dependencia (por constructor, campo o setter) |

---

## 🔄 El ciclo de vida

```
1. Spring arranca
2. Escanea el paquete (@ComponentScan)
3. Encuentra clases con @Service, @Repository, @Controller...
4. Crea instancias (beans) y las guarda en el contenedor
5. Cuando una clase necesita otra (constructor), Spring la inyecta
6. La app está lista: todos los beans están conectados
```

---

## 🧠 Mini-chequeo

1. ¿Qué problema resuelve la inyección de dependencias?
2. ¿Qué diferencia hay entre `@Component` y `@Service`?
3. ¿Por qué se usa el constructor para inyectar en lugar de `@Autowired` en un campo?

<details>
<summary>🔄 Respuestas</summary>

1. **Desacopla**: la clase no sabe de dónde viene su dependencia, solo que la recibe. Fácil de testear y cambiar implementaciones.
2. **Funcionalmente lo mismo**, pero `@Service` indica que es un servicio de negocio (convención de claridad).
3. El constructor **fuerza** a que la dependencia exista al crear el objeto. `@Autowired` en campo puede dejar `null` y fallar en runtime.
</details>

---

## ✅ Resumen en 3 frases

- La DI significa que Spring crea y entrega las dependencias: tú solo las recibes en el constructor.
- `@Service`, `@Repository` y `@Component` marcan clases como beans; Spring las gestiona.
- El contenedor IoC controla el lifecycle: creación, inyección y destrucción.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| DI | Inyección de dependencias: Spring crea y entrega las dependencias |
| IoC | Inversión de control: el contenedor decide, no tú |
| Bean | Objeto gestionado por Spring |
| Contenedor IoC | El "restaurante" que crea y gestiona los beans |
| `@Autowired` | Anotación para inyectar (preferir constructor) |

---

📚 [Volver al índice del anexo](/ApuntesPSP/10-anexo-spring-boot) · **Anterior:** [02 · Introducción a Spring Boot](/ApuntesPSP/10-anexo-spring-boot/02-introduccion-spring-boot) · **Siguiente:** [04 · RESTController y APIs REST](/ApuntesPSP/10-anexo-spring-boot/04-restcontroller-y-apis)
