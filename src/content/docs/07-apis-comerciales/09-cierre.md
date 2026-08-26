---
title: "09 — Cierre: consolida lo aprendido"
description: Sé la petición con API key, laboratorio real y el ring final de la unidad 🧠
---

<p><small>Sé la petición con API key, laboratorio real y el ring final de la unidad 🧠</small></p>

> 🗺️ **Estás en:** 🧪 **U07 · APIs Comerciales** → 09 · Cierre

---

Has terminado la teoría: API keys, variables de entorno, OpenWeatherMap, OpenAI, rate limits, errores HTTP, seguridad y el programa completo. Este cierre es el aterrizaje: recorres lo aprendido con juegos, un laboratorio real contra dos APIs de verdad con fallos intencionados y las preguntas que te harán en una entrevista. Léelo justo después del [punto 8](/ApuntesPSP/07-apis-comerciales/08-practica-apis-comerciales) y antes de abrir los boletines.

---

## ⭐ Sé la petición

> *Eres una petición HTTP con una API key. Acabas de nacer en un `requests.get()` dentro del portátil de un estudiante y tu destino es `api.openweathermap.org`. Empieza el viaje.*

**¿Qué pasa?**

1. `requests` te construye: `https://api.openweathermap.org/data/2.5/weather?q=Sevilla&appid=TU_API_KEY&units=metric&lang=es`. Llevas el **carnet de identidad** (la API key) en la query string.
2. Abres la conexión: primero el **DNS lookup** (`api.openweathermap.org` → una IP), luego el **three-way handshake TCP** y el **handshake TLS** que te cifra para el viaje.
3. Atraviesas Internet hasta el servidor de OpenWeatherMap y te entrega el proceso que te espera en el puerto 443.
4. El servidor **te lee la carnet**: comprueba tu `appid` contra su base de claves y tu plan (¿cuánto puedes pedir por minuto?).
5. Te responde **200 OK** con un JSON: `{"name":"Sevilla","main":{"temp":18.5},...}`.
6. De vuelta en Python, `requests` parsea el JSON y te convierte en un **dict** (`datos["main"]["temp"]` → `18.5`).
7. El estudiante imprime `🌤️  Sevilla: 18.5°C`. Misión cumplida.

**Todo en ~200 ms. Con tu identidad verificada en cada viaje.**

> 💡 **Ahora tú:** ¿y si la clave fuera inválida? En el paso 4 el servidor no te reconoce: te responde **401 Unauthorized** con un JSON de error. Si el estudiante no comprueba el `status_code` y llama directo a `resp.json()`, el programa muere con un mensaje que no dice nada útil. Por eso existe `raise_for_status()` (punto 6).

---

## 🔥 Fireside Chat: REST vs SOAP vs GraphQL

> *Tres estilos de API se sientan junto a la chimenea a discutir, de una vez, quién es el mejor.*

**REST:** — Mira, soy el estándar. Simple, recursos, JSON. Todo el mundo me conoce.

**SOAP:** — Yo fui el rey en los 2000. XML, WSDL, muy estructurado. Aún vivo en bancos.

**GraphQL:** — Yo soy el moderno. Una sola URL, pides exactamente lo que necesitas, ni más ni menos.

**REST:** — ¿Y eso es bueno? Yo tengo URLs claras: `/usuarios/5`, `/productos`.

**GraphQL:** — Sí, pero si quieres el nombre y el correo del usuario y los títulos de sus posts, ¿cuántas peticiones necesitas?

**REST:** — Dos: `/usuarios/5` y `/usuarios/5/posts`.

**GraphQL:** — Yo con una: `query { usuario(id:5) { nombre email posts { titulo } } }`.

**REST:** — Vale, eres más eficiente. Pero yo soy más simple para empezar.

**GraphQL:** — Tienes razón. Para proyectos pequeños, REST gana. Para grandes, yo escalo mejor.

> **Moraleja**: en este módulo manda REST: OpenWeatherMap y OpenAI (vía chat completions) son APIs REST con JSON. SOAP vive en los bancos y GraphQL es la alternativa eficiente para APIs grandes.

---

## 🕵️ ¿Quién soy?

1. Soy el carnet de identidad que la API comercial te da al registrarte.
2. Soy el código de estado cuando te pasas del límite de peticiones.
3. Soy el rol de mensaje de OpenAI que define el comportamiento del asistente.
4. Soy la función de `requests` que lanza una excepción si la respuesta es 4xx o 5xx.
5. Soy el archivo donde guardas tus claves y que nunca, jamás, se sube a git.
6. Soy la técnica que duplica la espera entre reintentos (1, 2, 4, 8…).

<details>
<summary>🔄 Respuestas</summary>

1. **API key**.
2. **429** (Too Many Requests).
3. **system**.
4. **`raise_for_status()`**.
5. **`.env`**.
6. **Backoff exponencial**.

</details>

---

## 🤬 CONRAD VS EL MUNDO: "clave subida a GitHub"

**CONRAD:** — "Clásico: haces `git add . && git commit && git push` con la API key escrita en el código (o sin `.env` en el `.gitignore`). Razones por las que estás vendido: 1) **La clave queda en el historial de git para siempre**, aunque la borres después. 2) **Cualquiera que encuentre tu repo la usa**: tu cuota gratis se agota en una tarde, o peor, tu tarjeta paga el exceso. 3) La clave no caduca sola: es tu llavero, y lo dejaste en la puerta."

**CONRAD:** — "Y lo mejor: *'es que era un repo privado'*. ¡Pues claro! Los repos privados se hacen públicos, se comparten, se filtran. La seguridad no depende de la visibilidad del repo, sino de que el secreto **no esté ahí**."

**CONRAD:** — "Y no me vengas con *'¿será que la clave no se ve?*'. Ya lo sabes: **rota**. Revoca la clave filtrada en el panel del proveedor, genera una nueva, ponla en el `.env`, y añade `.env` al `.gitignore`. Primero el daño, luego el arreglo."

---

## ⚡ Laboratorio de tortura: OpenWeatherMap + OpenAI

> **Duración:** 1 hora
> **Herramienta:** Python 3 (`requests`, `python-dotenv`, `openai`) y conexión a Internet

**Escenario:** monta un programa que consume las dos APIs comerciales de la unidad con tus claves reales guardadas en el `.env`. Es lo que repetirás en cualquier proyecto que necesite tiempo o IA.

**Tareas paso a paso:**

1. **Crea el `.env`** con tus dos claves reales: `OPENWEATHER_API_KEY=...` y `OPENAI_API_KEY=sk-...`. Añade `.env` al `.gitignore` antes de hacer nada más.
2. **Clima de tu ciudad**: escribe `clima.py` que cargue la clave con `load_dotenv()`, haga GET a OpenWeatherMap y muestre temperatura, sensación, humedad y descripción.
3. **Compara dos ciudades**: llama a la misma función con dos ciudades y muestra cuál está más caliente.
4. **GPT responde**: escribe `gpt.py` que pregunte a GPT-3.5 qué es un Lock en Python con `max_tokens=100` y `temperature=0.7`.
5. **Gestiona el 401**: cambia la `appid` a una clave falsa y haz que el programa detecte el error sin reventar (comprueba `status_code`).
6. **Simula un 429**: haz un bucle de 70 peticiones seguidas a OpenWeatherMap (el plan gratis permite 60/min). ¿Qué código recibes a partir de la 61?

**Fallo intencionado:** en la tarea 2, en lugar de leer la clave del `.env` con `os.getenv`, escríbela a fuego en el código (`API_KEY = "TU_API_KEY"`) y haz `git add . && git commit`. La clave queda **en el historial de git para siempre**, aunque luego la borres y añadas el `.env` al `.gitignore`. Es el fallo más caro de esta unidad: el código funciona, pero acabas de regalar tu carnet de identidad.

> **Pista 1:** las claves son como las llaves de casa: si las dejas en la puerta (en un commit público), no vale con "recogerlas" (borrarlas). Hay que **cambiar la cerradura**: revocar la clave en el panel del proveedor y generar una nueva. Eso es rotar (punto 7).
>
> **Pista 2:** comprueba tú mismo que el daño es real con `git log -p`: ahí verás la clave escrita en el commit aunque ya la hayas borrado del fichero. Y para el resto del laboratorio, vuelve al `.env`: `load_dotenv()` + `os.getenv()` es la única vía.

---

## 🏆 Logros de esta unidad

| Logro | Cómo conseguirlo |
|---|---|
| 🏅 **Key Holder** | Obtener tu API key en OpenWeatherMap y OpenAI y guardarla en el `.env` |
| 🏅 **Env Master** | Cargar claves con `python-dotenv` y proteger el repo con `.gitignore` |
| 🏅 **Weather Rider** | Consumir OpenWeatherMap y parsear `main` y `weather` del JSON |
| 🏅 **GPT Whisperer** | Llamar a chat completions con roles, `max_tokens` y `temperature` |
| 🏅 **429 Survivor** | Sobrevivir al rate limit con esperas y backoff exponencial |
| 🏅 **Key Guardian** | Rotar una clave filtrada y explicar por qué nunca va en el código |

---

## 🧠 Atrévete a pensar

1. ¿Por qué las API keys no deben ir en la URL ni en el código?
2. ¿Qué diferencia hay entre 401 y 403?
3. ¿Qué es el rate limit y por qué las APIs comerciales lo imponen?
4. ¿Por qué el backoff exponencial es mejor que esperar siempre lo mismo?
5. ¿Qué harías si descubres que tu API key se ha subido a GitHub?

<details>
<summary>💡 Soluciones</summary>

1. Porque la URL queda en **logs e historial**, y el código va a **GitHub**: cualquiera con la clave puede usarla (y gastar tu cuota o tu dinero). Las claves viven en el `.env`.
2. **401** = no te has autenticado (falta o es mala la clave). **403** = te has autenticado, pero no tienes permiso para esa acción concreta.
3. Es la **cuota de peticiones** por tiempo. Se impone para **proteger el servidor**: un cliente desbocado (o un ataque) derribaría la API para todos. Tu plan gratis dice cuánto puedes pedir.
4. Porque **no machaca un servidor ya saturado**: al principio reintentas rápido y, si sigue fallando, espacias más. Esperar siempre 5s (o peor, no esperar) empeora el problema o bloquea tu IP.
5. **Rotar la clave**: revocarla en el panel del proveedor, generar una nueva, actualizar el `.env`, y añadir `.env` al `.gitignore`. Borrar del código no sirve: ya está en el historial de git.
</details>

---

## 🧩 Crucigrama de bits

```
Horizontal:
1. Código de estado cuando te pasas del límite de peticiones (3 letras)
4. Archivo donde guardas tus claves y nunca se sube a git (3 letras)
5. Parámetro de OpenWeatherMap que pone las unidades en grados (5 letras)
8. Código de estado cuando la API key es inválida (3 letras)

Vertical:
2. Rol de mensaje de OpenAI que define el comportamiento del asistente (6 letras)
3. Proveedor de clima con API key gratuita (14 letras)
6. Librería para peticiones HTTP en Python (8 letras)
7. Espera exponencial entre reintentos (7 letras)
```

<details>
<summary>📝 Soluciones</summary>

**Horizontal:** 1. 429, 4. ENV, 5. UNITS, 8. 401
**Vertical:** 2. SYSTEM, 3. OPENWEATHERMAP, 6. REQUESTS, 7. BACKOFF

</details>

---

## 💬 Entrevista de trabajo

1. **"¿Qué es una API key y cómo la enviarías al servidor?"**
2. **"¿Cómo guardas las credenciales en una aplicación Python? ¿Por qué no en el código?"**
3. **"¿Qué es un rate limit? ¿Cómo gestionarías un 429?"**
4. **"Escribe en Python una llamada a OpenWeatherMap con `requests` y procesa la respuesta JSON."**
5. **"¿Qué diferencia hay entre REST, SOAP y GraphQL? ¿Cuál usarías y por qué?"**

> 💡 **Cómo encararlas:** la 1 y la 4 son las "preguntas reina". Para la 1, recorre el [punto 1](/ApuntesPSP/07-apis-comerciales/01-api-keys): la API key es el carnet de identidad, va en la query (`appid`) o en `Authorization: Bearer`, y nunca en el código. Para la 4, escribe el esqueleto del [punto 3](/ApuntesPSP/07-apis-comerciales/03-openweathermap): `params` (con `units=metric`), comprobar `status_code`, `resp.json()` y acceder a `main` y `weather`. Si además mencionas el `.env` y el `raise_for_status`, la entrevista es tuya.

---

## 🤷 No hay preguntas tontas

> ❓ **¿Me pueden banear por usar mucho la API?**

Sí. Todas tienen límites (rate limits). Lee la documentación. OpenWeatherMap gratis: 60 peticiones/minuto.

> ❓ **¿Qué pasa si me paso del límite?**

HTTP 429 (Too Many Requests). Algunas APIs bloquean tu IP por un tiempo.

> ❓ **¿OpenAI es caro?**

GPT-3.5-turbo cuesta ~$0.0015 por 1000 tokens. Una pregunta normal son ~100 tokens = $0.00015. Muy barato para pruebas.

> ❓ **¿Puedo guardar la API key en el código para pruebas?**

Solo si el código nunca va a GitHub. Mejor acostúmbrate a `.env` desde el principio.

---

## 🎬 Poscréditos

> *Tu petición parte con su API key cifrada por TLS y vuelve con el JSON del tiempo bajo el brazo.*
>
> *El 429 llegó, esperaste con backoff, y la petición siguiente salió bien.*
>
> *Y las claves se quedaron en el `.env`, lejos de GitHub, donde deben vivir.*

**PRÓXIMAMENTE EN U08:** *hash y cifrado clásico. Las contraseñas que no se pueden leer: MD5, SHA y el viejo cifrado César.*

---

## ✅ Criterios de evaluación cubiertos (RA4a-b)

**RA4: Desarrolla aplicaciones que se comunican por red. Servicios en red.**

| CE | Criterio | Cubierto |
|---|---|---|
| a) | Utiliza APIs REST para obtener datos externos | ✅ Puntos 3-5 y 8 + ⚡ Laboratorio de tortura |
| b) | Gestiona peticiones HTTP y procesa respuestas JSON | ✅ Puntos 1, 5-6 y 8 + ⚡ Laboratorio de tortura |

> RA4c (servidores concurrentes) y RA4d (ThreadPool) se cubren en la **U10 · Servidores Concurrentes**. RA4e-g (asyncio, disponibilidad, comparativa) se cubren en la **U11 · asyncio y disponibilidad**.

---

📚 [Volver al índice de la unidad](/ApuntesPSP/07-apis-comerciales) · **Anterior:** [08 · Práctica APIs comerciales](/ApuntesPSP/07-apis-comerciales/08-practica-apis-comerciales) · **Siguiente:** **[U08 · Hash y Cifrado Clásico](/ApuntesPSP/08-hash-y-cifrado-clasico)**