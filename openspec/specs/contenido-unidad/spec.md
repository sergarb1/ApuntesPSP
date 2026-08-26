# contenido-unidad — Estándar de calidad de las unidades didácticas

> Barra de calidad "libro de verdad" que toda unidad (U01–U11) debe cumplir tras su ampliación. Prioridad: utilidad real para personas que parten de cero en programación de servicios y procesos.

## ADDED Requirements

### Requirement: Nivel de entrada cero

Cada punto de teoría debe ser comprensible para una persona sin conocimientos previos del módulo.

#### Scenario: Definición de términos en el primer uso
- **WHEN** un lector sin conocimientos de procesos/servicios lee cualquier punto de la unidad
- **THEN** cada término técnico o acrónimo (PID, hilo, socket, puerto, hash, AES, corrutina...) se define con lenguaje llano en su primer uso y no se asume jerga previa

#### Scenario: Analogía cotidiana
- **WHEN** se explica un concepto abstracto de servicios y procesos
- **THEN** el texto incluye al menos una analogía de la vida diaria (cocina, oficina, carteros, colas de supermercado...) que aterrice el concepto

### Requirement: Tamaño de capítulo de libro

Cada punto debe tratarse en profundidad, no como resumen.

#### Scenario: Punto de teoría ampliado
- **WHEN** un revisor abre un punto de teoría de la unidad
- **THEN** el punto contiene contexto introductorio, explicación del concepto en varios párrafos, al menos una tabla o comparativa, un ejemplo concreto resuelto en Python y, cuando aporte, una referencia a diagrama; resultado objetivo ≈120–200 líneas por punto

#### Scenario: Detalle mínimo por sección temática
- **WHEN** el punto trata una sección temática (estados, sincronización, sockets, cifrado...)
- **THEN** cada elemento de esa sección (cada estado, cada mecanismo de bloqueo, cada protocolo, cada algoritmo) tiene su propia explicación desarrollada y no una mera enumeración

### Requirement: Cierre de unidad obligatorio

La unidad conserva las secciones de consolidación del proyecto.

#### Scenario: Secciones de consolidación presentes
- **WHEN** termina la lectura de la unidad
- **THEN** existen páginas o apartados con: ⭐ Sé el código (el Paquete), 🔥 Fireside Chat, 🕵️ ¿Quién soy?, 🤬 CONRAD VS EL MUNDO, ⚡ Laboratorio de tortura, 🧠 Atrévete a pensar, 🧩 Crucigrama de bits, 💬 Entrevista de trabajo, 🤷 No hay preguntas tontas y 🎬 Poscréditos

#### Scenario: Laboratorio con fallo intencionado
- **WHEN** se ejecuta el laboratorio de la unidad
- **THEN** incluye SIEMPRE un fallo intencionado que el alumno debe diagnosticar, con pistas escalonadas

### Requirement: Todo ejercicio con solución

No hay preguntas abiertas sin solución disponible sin spoilear.

#### Scenario: Soluciones ocultas
- **WHEN** el punto incluye ejercicios o adivinanzas
- **THEN** las soluciones se presentan dentro de bloque `<details><summary>...</summary>...</details>`

### Requirement: Coherencia factual y de estilo

El contenido es consistente con el resto del curso.

#### Scenario: Terminología unificada
- **WHEN** se usan conceptos compartidos con otras unidades (PID, hilo, socket, puerto, hash, AES, asyncio...)
- **THEN** el término se usa con idéntico significado y ejemplos coherentes con el resto del curso

#### Scenario: Poscréditos con continuidad
- **WHEN** se cierra la unidad
- **THEN** la escena de Poscréditos enlaza de forma coherente con la siguiente unidad ("PRÓXIMAMENTE EN U0X") y ambas se corresponden; la última unidad (U11) cierra con "🏁 Fin del viaje" sin hook

### Requirement: Cobertura de criterios de evaluación

Cada unidad declara qué CEs cubre del RA correspondiente.

#### Scenario: Tabla de CEs en el índice de unidad
- **WHEN** un revisor consulta la página índice de la unidad
- **THEN** existe una tabla de criterios de evaluación del resultado de aprendizaje con su estado de cobertura (✅/apartado) y dónde se cubre

### Requirement: Flujo de lectura encadenado

Cuando la unidad se amplía a varios archivos, el flujo de lectura entre puntos debe ser natural y navegable.

#### Scenario: Navegación entre puntos
- **WHEN** un usuario termina un punto de la unidad
- **THEN** puede continuar con el siguiente punto de forma obvia (enlace "Siguiente" y "Volver al índice de la unidad"), sin saltos bruscos de lógica

#### Scenario: Referencias cruzadas
- **WHEN** un punto menciona contenido de otra unidad o de otro punto
- **THEN** hay un enlace cruzado al punto correspondiente o una indicación clara ("se verá en U0X")

### Requirement: Lenguaje es-ES obligatorio

Todo el texto destinado al usuario está escrito en español de España natural, sin latinamericanismos evitables ni calcos innecesarios del inglés.

#### Scenario: Vocabulario peninsular
- **WHEN** se redacta o revisa cualquier párrafo, tabla, explicación o ejercicio
- **THEN** no aparecen formas como `computadora`, `prender/prendida`, `celular`, `laptop`, `empacar`, `cómputo`, `monitorear`, `armar` cuando significa montar, `manejar` cuando significa gestionar, ni `driver` o `email` en prosa cuando exista una alternativa española natural, ni números con formato estadounidense

#### Scenario: Mayúsculas en títulos
- **WHEN** se redacta un título o nombre de sección en español
- **THEN** se utiliza estilo oracional: primera palabra y nombres propios en mayúscula, manteniendo las siglas y denominaciones técnicas en su forma oficial

#### Scenario: Terminología técnica
- **WHEN** se utiliza un término técnico inglés asentado
- **THEN** se mantiene cuando sea la forma habitual en informática
- **WHEN** exista un anglicismo evitable con una forma española natural
- **THEN** se utiliza la forma española

#### Scenario: Código y sintaxis técnica
- **WHEN** el término aparece dentro de código, comandos, identificadores, rutas, parámetros o sintaxis de protocolos
- **THEN** no se modifica por motivos lingüísticos