# contenido-boletin — Estándar de calidad de los boletines de ejercicios

> Barra de calidad que todo boletín (inicial/avanzado y sus resueltos) debe cumplir. Todo boletín parte de un nivel graduado y refuerza los puntos de su unidad.

## ADDED Requirements

### Requirement: Par resuelto / por resolver

Cada boletín debe existir en versión para resolver y versión resuelta, con idéntica numeración.

#### Scenario: Misma estructura en ambos ficheros
- **WHEN** existe un boletín `boletin-U0X-<nivel>.md`
- **THEN** existe su homólogo `boletin-U0X-<nivel>-resuelto.md` con el mismo enunciado, misma numeración de ejercicios y soluciones completas

#### Scenario: Respuestas verificadas
- **WHEN** se abre un fichero resuelto
- **THEN** cada ejercicio tiene su solución desarrollada (no solo la palabra final) y las respuestas se corresponden 1:1 con los ejercicios del boletín por resolver

### Requirement: Graduación de dificultad

Los boletines ofrecen un recorrido progresivo.

#### Scenario: Nivel inicial accesible
- **WHEN** un alumno resuelve el boletín inicial
- **THEN** los ejercicios cubren los conceptos básicos de la unidad con enunciados directos y sin trucos; la dificultad crece de forma suave de la primera a la última pregunta

#### Scenario: Nivel avanzado de aplicación
- **WHEN** un alumno resuelve el boletín avanzado
- **THEN** los ejercicios piden aplicar varios conceptos combinados, diagnosticar fallos o diseñar (no solo memorizar), e incluyen pistas para no bloquear al alumno

### Requirement: Cobertura de los puntos de la unidad

El boletín refuerza todos los bloques del contenido.

#### Scenario: Ejercicio por sección
- **WHEN** un revisor compara el boletín con los puntos del índice de la unidad
- **THEN** cada punto importante (procesos, hilos, sincronización, sockets, APIs, hash/cifrado, asyncio...) tiene al menos un ejercicio asociado en el conjunto inicial+avanzado

### Requirement: Tamaño amplio

Los boletines deben tener suficiente recorrido (≥8 ejercicios por boletín) y no quedarse en anécdotas.

#### Scenario: Mínimo de ejercicios
- **WHEN** un revisor cuenta los ejercicios de un boletín
- **THEN** hay al menos 8 ejercicios por boletín (inicial y avanzado por separado), repartidos entre teoría, cálculo/diseño y (si aplica) práctica mental de laboratorio

#### Scenario: Hints (pistas)
- **WHEN** un ejercicio es complejo o admite varias aproximaciones
- **THEN** incluye una nota de pista en el boletín por resolver (no en el resuelto) que orienta sin regalar la solución