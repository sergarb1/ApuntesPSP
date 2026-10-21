---
title: "05 — JPA y bases de datos"
description: "@Entity, Repository, CRUD con Hibernate y H2 🗄️"
---

<p><small>@Entity, Repository, CRUD con Hibernate y H2 🗄️</small></p>

> 🗺️ **Estás en:** ☕ **UD 11 · Spring Boot** → 05 · JPA y bases de datos

---

## 📬 La idea en una frase

> **JPA** (*Java Persistence API*) es el estándar Java para mapear objetos a tablas de base de datos. **Hibernate** es su implementación más usada. Con Spring Data JPA, crear un repositorio CRUD es una interfaz de una línea.

---

## 🆚 SQL vs JPA

```python
# Python + SQLite
import sqlite3
conn = sqlite3.connect('tareas.db')
cursor = conn.execute("INSERT INTO tareas (titulo) VALUES ('Estudiar')")
conn.commit()
```

```java
// Java + JPA
@Entity
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    // ...
}

// Y para guardar:
tareaRepository.save(new Tarea("Estudiar"));
```

**Diferencia clave:** en JPA **trabajas con objetos**, no con SQL. El framework traduce las llamadas a SQL automáticamente.

---

## 🏷️ Las anotaciones de JPA

| Anotación | Qué hace |
|-----------|----------|
| `@Entity` | Marca una clase como tabla de BD |
| `@Id` | Marca el campo como clave primaria |
| `@GeneratedValue` | Genera el ID automáticamente |
| `@Column` | Configura el nombre de la columna |
| `@ManyToOne` / `@OneToMany` | Relaciones entre tablas |

---

## 📦 El repositorio

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    // ¡No necesitas escribir nada! Spring genera las implementaciones
}
```

**Métodos que obtienes gratis:**

| Método | Qué hace |
|--------|----------|
| `findAll()` | SELECT * |
| `findById(id)` | SELECT WHERE id = ? |
| `save(entity)` | INSERT o UPDATE |
| `deleteById(id)` | DELETE WHERE id = ? |
| `count()` | SELECT COUNT(*) |

---

## 🔍 Consultas personalizadas

```java
public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // Spring genera la consulta a partir del nombre del método
    List<Tarea> findByCompletada(boolean completada);
    List<Tarea> findByTituloContaining(String texto);
    Optional<Tarea> findByTitulo(String titulo);
}
```

**Equivalente SQL:**

```sql
SELECT * FROM tareas WHERE completada = true;
SELECT * FROM tareas WHERE titulo LIKE '%texto%';
SELECT * FROM tareas WHERE titulo = 'titulo';
```

> 💡 Solo escribes el SQL cuando necesitas algo que los métodos derivados no pueden expresar. Para eso usas `@Query`.

---

## ⚙️ Configuración (`application.properties`)

```properties
# H2 (base de datos en memoria para desarrollo)
spring.datasource.url=jdbc:h2:mem:tareasdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Consola H2 (accesible en /h2-console)
spring.h2.console.enabled=true
```

| Propiedad | Qué hace |
|-----------|----------|
| `ddl-auto=update` | Actualiza el esquema automáticamente |
| `show-sql=true` | Muestra el SQL generado en consola |
| `h2.console.enabled` | Activa la consola web de H2 |

---

## 🧠 Mini-chequeo

1. ¿Qué es JPA y qué hace Hibernate?
2. ¿Por qué no necesitas escribir SQL para un CRUD básico?
3. ¿Qué hace `JpaRepository<T, ID>` por ti?

<details>
<summary>🔄 Respuestas</summary>

1. JPA es el estándar; Hibernate es la implementación. JPA define cómo mapear objetos a tablas; Hibernate lo ejecuta.
2. Spring Data JPA **genera automáticamente** las implementaciones de los métodos del repositorio basándose en los nombres.
3. Proporciona `findAll`, `findById`, `save`, `deleteById`, `count` y más: CRUD completo sin escribir SQL.
</details>

---

## ✅ Resumen en 3 frases

- JPA mapea objetos Java a tablas de BD con `@Entity` y `@Id`.
- `JpaRepository` genera CRUD automáticamente: solo declaras la interfaz.
- Las consultas personalizadas se crean por nombre de método (`findByTitulo`).

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| JPA | Estándar Java para persistencia de objetos |
| Hibernate | Implementación de JPA más usada |
| `@Entity` | Marca una clase como tabla de BD |
| `@Repository` | Interfaz de acceso a datos |
| `ddl-auto` | Política de actualización del esquema |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-spring-boot) · **Anterior:** [04 · RESTController y APIs REST](/ApuntesPSP/10-spring-boot/04-restcontroller-y-apis) · **Siguiente:** [06 · Ejemplo completo](/ApuntesPSP/10-spring-boot/06-ejemplo-completo)
