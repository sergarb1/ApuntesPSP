---
title: Boletín UD 11 — Avanzado
description: Ejercicios avanzados de Spring Boot y Java
---

# 💪 Boletín UD 11 — Avanzado

> Ejercicios que requieren aplicar Spring Boot de forma más profunda: servicios, validación, JPA con consultas, testing, seguridad básica, gestión de errores y un mini-proyecto por capas completo.

---

## 1. 🏗️ Servicio entre controlador y repositorio

Crea la API de tareas del punto 6 de la unidad completa por capas: `TareaController` → `TareaService` → `TareaRepository`. El servicio añade la lógica: si el título está vacío, lanza `IllegalArgumentException`.

**Pista:** `@Service` en la clase de servicio y `@Autowired` (o constructor injection) para inyectar el repositorio en el servicio y el servicio en el controlador.

## 2. 📋 Consultas personalizadas JPA

Con la entidad `Producto`, crea en el `ProductoRepository` dos consultas: `findByPrecioLessThan(double precio)` y `findByNombreContaining(String texto)`.

**Pista:** Spring Data deriva la consulta del nombre del método: `LessThan` → `WHERE precio < ?`, `Containing` → `WHERE nombre LIKE %?%`. No hace falta escribir SQL.

## 3. ✅ Validación con anotaciones

Añade a `Producto` las anotaciones de validación: `@NotBlank` en `nombre` y `@Positive` en `precio`. En el controlador recibe el objeto con `@Valid` y devuelve un error 400 si no cumple.

**Pista:** necesitas `spring-boot-starter-validation`. `@Valid` en el parámetro del método dispara la validación; Spring devuelve 400 automáticamente con el detalle en el cuerpo.

## 4. 🧪 Primer test con JUnit

Escribe un test unitario para `TareaService`: verifica que `crearTarea()` con título válido devuelve una tarea con ID asignada y que con título vacío lanza `IllegalArgumentException`.

**Pista:** usa `@ExtendWith(MockExtension.class)` + `@Mock TareaRepository` + `@InjectMocks TareaService`. Con `assertThrows(IllegalArgumentException.class, () -> service.crearTarea(""))` compruebas la excepción.

## 5. 🔍 Test de integración del controlador

Crea un test de integración de la API con `@SpringBootTest` + `@AutoConfigureMockMvc` que haga un `GET /api/tareas` y compruebe que responde 200 y que el cuerpo es un JSON con tipo `application/json`.

**Pista:** inyecta `MockMvc`, usa `mockMvc.perform(get("/api/tareas")).andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON))`.

## 6. ❌ Gestión de errores centralizada

Crea una clase `@RestControllerAdvice` que capture `TareaNoEncontradaException` y devuelva un 404 con un cuerpo JSON del tipo `{"error": "...", "mensaje": "..."}`. Lanza esa excepción desde el controlador cuando el ID no exista.

**Pista:** `@RestControllerAdvice` es el equivalente global a un gestor de excepciones; un método con `@ExceptionHandler(TareaNoEncontradaException.class)` + `@ResponseStatus(HttpStatus.NOT_FOUND)` devuelve el cuerpo de error.

## 7. 🗃️ Migración con Flyway

Crea una migración `V1__crear_tabla_productos.sql` en `src/main/resources/db/migration` con la tabla `productos` (id, nombre, precio) y configura Spring para usar H2 con Flyway.

**Pista:** añade `spring-boot-starter-flyway`. Flyway ejecuta al arrancar los ficheros `V<n>__descripcion.sql` en orden; el doble guion bajo separa el número de la descripción.

## 8. 🔐 Seguridad básica con Spring Security

Protege el endpoint `/api/tareas`: solo acepta peticiones con cabecera `X-Api-Key: secreta`. Si falta o es incorrecta, responde 401.

**Pista:** crea una clase que extienda `SecurityFilterChain` (o un filtro `OncePerRequestFilter`) y comprueba la cabecera antes de dejar pasar la petición. Recuerda desactivar CSRF para APIs sin sesiones.

## 9. 📦 Paginación en la API

Modifica `GET /api/productos` para que devuelva una página: acepta los parámetros `page` y `size` y devuelve `Page<Producto>`.

**Pista:** el repositorio debe extender `PagingAndSortingRepository` (o `JpaRepository`, que ya lo hace). Cambia el parámetro del método por `Pageable pageable` y Spring lo arma desde la query string.

## 10. 🚀 Mini-proyecto completo

Extiende la API de tareas con: relación `Tarea` → `Categoria` (OneToMany), endpoint `GET /api/categorias/{id}/tareas`, borrado en cascada y un test de integración que recorra el CRUD completo.

**Pista:** `@ManyToOne` en Tarea y `@OneToMany(mappedBy = "categoria")` en Categoria. Usa `@Transactional` en el servicio para las operaciones que tocan varias tablas. El test usa `@BeforeEach` para crear datos y `@Sql` si prefieres fijarlos en un script.
