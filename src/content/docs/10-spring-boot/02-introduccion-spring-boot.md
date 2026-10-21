---
title: "02 — Introducción a Spring Boot"
description: "El framework que domina el backend empresarial 🌱"
---

<p><small>El framework que domina el backend empresarial 🌱</small></p>

> 🗺️ **Estás en:** ☕ **UD 11 · Spring Boot** → 02 · Introducción a Spring Boot

---

## 📬 La idea en una frase

> **Spring Boot** es un framework Java que te permite crear servicios web (APIs REST, aplicaciones web, microservicios) en minutos, sin configurar servidores ni XML. Es el Flask/Django del mundo Java, pero con más estructura y opiniones.

---

## 🌱 ¿Qué es Spring Boot?

Spring Boot es una **extensión de Spring Framework** que simplifica enormemente el desarrollo de aplicaciones Java:

- **Autoconfiguración:** detecta qué necesitas y lo configura solo.
- **Servidor embebido:** tu app trae su propio servidor (Tomcat/Netty). No necesitas desplegar en un servidor externo.
- **Opiniones sobre convenciones:** hay una forma "recomendada" de hacer cada cosa (como Flask con Blueprints, pero más estricto).
- **Dependencias gestionadas:** solo añades `spring-boot-starter-*` y todo se resuelve.

---

## 🆚 Flask vs Spring Boot

| Concepto | Flask (Python) | Spring Boot (Java) |
|----------|----------------|---------------------|
| Servidor | Werkzeug | Tomcat (embebido) |
| Rutas | `@app.route('/api')` | `@GetMapping("/api")` |
| Config | `app.config` | `application.properties` |
| Arranque | `app.run()` | `main()` + `SpringApplication.run()` |
| Dependencias | `pip install` | `pom.xml` (Maven) o `build.gradle` |
| JSON | `flask.jsonify()` | `@RestController` (automático) |

---

## 📁 Estructura de un proyecto Spring Boot

```
mi-proyecto/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ejemplo/miproyecto/
│   │   │       ├── MiProyectoApplication.java   ← punto de entrada
│   │   │       ├── controller/
│   │   │       │   └── TareaController.java     ← endpoints REST
│   │   │       ├── model/
│   │   │       │   └── Tarea.java               ← entidad
│   │   │       └── repository/
│   │   │           └── TareaRepository.java     ← acceso a datos
│   │   └── resources/
│   │       └── application.properties            ← configuración
│   └── test/                                     ← tests
├── pom.xml                                       ← dependencias (Maven)
└── mvnw / mvnw.cmd                               ← wrapper (sin instalar Maven)
```

---

## 🚀 Crear tu primer proyecto

### Opción 1: Spring Initializr (recomendada)

1. Ve a [start.spring.io](https://start.spring.io)
2. Selecciona: **Maven**, **Java 17**, **Spring Boot 3.x**
3. Añade dependencias: **Spring Web**, **Spring Data JPA**, **H2 Database**
4. Genera, descarga y abre en IntelliJ

### Opción 2: Línea de comandos

```bash
curl https://start.spring.io/starter.zip?type=maven-project \
  -d dependencies=web,data-jpa,h2 -o mi-proyecto.zip
unzip mi-proyecto.zip
```

---

## 🏃 El punto de entrada

```java
package com.ejemplo.miproyecto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MiProyectoApplication {
    public static void main(String[] args) {
        SpringApplication.run(MiProyectoApplication.class, args);
    }
}
```

**`@SpringBootApplication`** es un atajo que combina:
- `@Configuration`: marca la clase como fuente de configuración.
- `@EnableAutoConfiguration`: activa la autoconfiguración.
- `@ComponentScan`: busca componentes en el paquete y subpaquetes.

> 💡 Equivale a Flask con `app = Flask(__name__)` + `app.run()`, pero Spring lo hace todo por ti.

---

## 🧠 Mini-chequeo

1. ¿Qué es Spring Boot y por qué es tan popular?
2. ¿Qué hace `@SpringBootApplication`?
3. ¿Cuál es la diferencia entre `pom.xml` y `requirements.txt`?

<details>
<summary>🔄 Respuestas</summary>

1. Es un framework que simplifica crear servicios web en Java: autoconfiguración, servidor embebido y dependencias gestionadas.
2. Combina `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`: configura, autoconfigura y busca componentes.
3. `pom.xml` gestiona dependencias Java (Maven); `requirements.txt` gestiona dependencias Python (pip). Ambos resuelven qué versiones instalar.
</details>

---

## ✅ Resumen en 3 frases

- Spring Boot es el "Flask del Java": crea APIs REST en minutos con autoconfiguración y servidor embebido.
- La estructura sigue convenciones: `controller/`, `model/`, `repository/`, `resources/`.
- `@SpringBootstrap` arranca todo: configura, escanea componentes y levanta el servidor.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Spring Boot | Framework Java para crear servicios web rápidamente |
| Maven | Gestor de dependencias (como pip) |
| `pom.xml` | Fichero de dependencias de Maven |
| `application.properties` | Fichero de configuración de Spring Boot |
| Starter | Paquete de dependencias preconfigurado |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/10-spring-boot) · **Anterior:** [01 · Java para desarrolladores Python](/ApuntesPSP/10-spring-boot/01-java-para-python) · **Siguiente:** [03 · Inyección de dependencias](/ApuntesPSP/10-spring-boot/03-inyeccion-de-dependencias)
