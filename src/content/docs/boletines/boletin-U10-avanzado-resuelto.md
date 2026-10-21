---
title: Boletín UD 11 — Avanzado (Resuelto)
description: Soluciones de los ejercicios avanzados de Spring Boot y Java
---

# 💪 Boletín UD 11 — Avanzado (Resuelto)

---

## 1. 🏗️ Servicio entre controlador y repositorio

```java
@Service
public class TareaService {

    private final TareaRepository repository;

    public TareaService(TareaRepository repository) {
        this.repository = repository;
    }

    public Tarea crearTarea(String titulo) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("El título no puede estar vacío");
        }
        Tarea t = new Tarea();
        t.setTitulo(titulo);
        t.setCompletada(false);
        return repository.save(t);
    }
}
```

```java
@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaService service;

    public TareaController(TareaService service) {
        this.service = service;
    }

    @PostMapping
    public Tarea crear(@RequestBody Tarea tarea) {
        return service.crearTarea(tarea.getTitulo());
    }
}
```

**Inyección por constructor** (la recomendada por Spring): el atributo es `final` y Spring inyecta el bean automáticamente, sin `@Autowired`.

## 2. 📋 Consultas personalizadas JPA

```java
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByPrecioLessThan(double precio);

    List<Producto> findByNombreContaining(String texto);
}
```

Spring Data deriva el SQL del nombre del método: `findByPrecioLessThan` → `SELECT * FROM producto WHERE precio < ?`. `Containing` → `WHERE nombre LIKE %?%`. No se escribe una línea de SQL.

## 3. ✅ Validación con anotaciones

```java
@Entity
public class Producto {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Positive(message = "El precio debe ser positivo")
    private double precio;
}
```

```java
@PostMapping("/productos")
public ResponseEntity<Producto> crear(@Valid @RequestBody Producto p) {
    return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(p));
}
```

Con `spring-boot-starter-validation`, `@Valid` dispara la validación; si falla, Spring devuelve **400 Bad Request** con el detalle de cada campo en el cuerpo. No hace falta capturar nada a mano.

## 4. 🧪 Primer test con JUnit

```java
@ExtendWith(MockitoExtension.class)
class TareaServiceTest {

    @Mock
    TareaRepository repository;

    @InjectMocks
    TareaService service;

    @Test
    void crearTareaTituloValidoAsignaId() {
        Tarea guardada = new Tarea();
        guardada.setId(1L);
        when(repository.save(any(Tarea.class))).thenReturn(guardada);

        Tarea resultado = service.crearTarea("Estudiar PSP");

        assertEquals(1L, resultado.getId());
        verify(repository).save(any(Tarea.class));
    }

    @Test
    void crearTareaTituloVacioLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class,
                () -> service.crearTarea(""));
    }
}
```

`@Mock` crea un doble del repositorio, `@InjectMocks` lo mete en el servicio. `verify` comprueba que se llamó a `save`.

## 5. 🔍 Test de integración del controlador

```java
@SpringBootTest
@AutoConfigureMockMvc
class TareaControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void listarTareasResponde200Json() throws Exception {
        mockMvc.perform(get("/api/tareas"))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
```

`@SpringBootTest` levanta el contexto completo (con BD de prueba) y `MockMvc` simula peticiones HTTP reales sin abrir puerto.

## 6. ❌ Gestión de errores centralizada

```java
public class TareaNoEncontradaException extends RuntimeException {
    public TareaNoEncontradaException(Long id) {
        super("Tarea no encontrada: " + id);
    }
}
```

```java
@RestControllerAdvice
public class GestorErrores {

    @ExceptionHandler(TareaNoEncontradaException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> noEncontrada(TareaNoEncontradaException e) {
        return Map.of("error", "404", "mensaje", e.getMessage());
    }
}
```

`@RestControllerAdvice` aplica a todos los controladores. En el controlador: `throw new TareaNoEncontradaException(id)` y el cliente recibe 404 con JSON de error.

## 7. 🗃️ Migración con Flyway

```sql
-- V1__crear_tabla_productos.sql
CREATE TABLE productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DOUBLE NOT NULL
);
```

```properties
# application.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.flyway.enabled=true
```

Flyway ejecuta al arrancar cada `V<n>__descripcion.sql` por orden y guarda en su propia tabla qué migraciones ya corrieron. Si cambias un fichero ya ejecutado, lanza error al arrancar.

## 8. 🔐 Seguridad básica con Spring Security

```java
@Configuration
@EnableWebSecurity
public class SeguridadConfig {

    @Bean
    SecurityFilterChain filtrar(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
            .addFilterBefore(new ApiKeyFilter(),
                    UsernamePasswordAuthenticationFilter.class);
        http.httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
```

```java
public class ApiKeyFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String clave = req.getHeader("X-Api-Key");
        if ("secreta".equals(clave)) {
            chain.doFilter(req, res);
        } else {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
```

El filtro se ejecuta antes de la cadena de autenticación: sin la cabecera correcta, **401**. CSRF se desactiva porque una API sin sesiones no lo necesita.

## 9. 📦 Paginación en la API

```java
@GetMapping("/productos")
public Page<Producto> listar(@RequestParam int page,
                             @RequestParam int size) {
    Pageable pageable = PageRequest.of(page, size);
    return repository.findAll(pageable);
}
```

`JpaRepository` ya extiende `PagingAndSortingRepository`. La respuesta incluye `content` (los elementos) más `totalPages`, `totalElements` y `number`. Llamada: `GET /api/productos?page=0&size=10`.

## 10. 🚀 Mini-proyecto completo

```java
@Entity
public class Tarea {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private boolean completada;

    @ManyToOne
    private Categoria categoria;
}
```

```java
@Entity
public class Categoria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    private List<Tarea> tareas;
}
```

```java
@Service
public class TareaService {

    private final TareaRepository tareas;
    private final CategoriaRepository categorias;

    public TareaService(TareaRepository tareas,
                        CategoriaRepository categorias) {
        this.tareas = tareas;
        this.categorias = categorias;
    }

    @Transactional
    public Tarea moverATarea(Long categoriaId, Tarea tarea) {
        Categoria cat = categorias.findById(categoriaId)
                .orElseThrow(() ->
                    new TareaNoEncontradaException(categoriaId));
        tarea.setCategoria(cat);
        return tareas.save(tarea);
    }
}
```

```java
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final TareaRepository tareas;

    public CategoriaController(TareaRepository tareas) {
        this.tareas = tareas;
    }

    @GetMapping("/{id}/tareas")
    public List<Tarea> tareasDe(@PathVariable Long id) {
        return tareas.findByCategoriaId(id);
    }
}
```

En el repositorio: `List<Tarea> findByCategoriaId(Long categoriaId);`. `@Transactional` garantiza que crear y relacionar se hace en una sola transacción; `cascade = ALL` propaga el borrado a las tareas hijas.
