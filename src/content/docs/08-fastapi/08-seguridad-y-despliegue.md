---
title: 08 — Seguridad y despliegue
description: "API key con Depends, CORS y uvicorn en producción 🔐"
---

<p><small>API key con <code>Depends</code>, CORS y uvicorn en producción 🔐</small></p>

> 🗺️ **Estás en:** 🧩 **UD 9 · FastAPI** → 08 · Seguridad y despliegue

---

## 📬 La idea en una frase

> Una API publicada necesita **quién puede entrar** (API key), **quién puede llamarla desde el navegador** (CORS) y **cómo se arranca** (uvicorn sin `--reload`, con workers).

Todo eso se resuelve con pocas líneas y sin inventar nada.

---

## 🔑 API key con `Depends`

En la UD 8 viste la API key desde el lado del cliente. Ahora la exiges tú. El mecanismo se llama **dependencia**: una función que FastAPI ejecuta antes de la ruta.

```python
import os
from fastapi import Depends, FastAPI, Header, HTTPException

app = FastAPI()
API_KEY = os.getenv("API_KEY", "clave-de-clase")


def verificar_clave(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="API key inválida")


@app.get("/juegos", dependencies=[Depends(verificar_clave)])
def listar_juegos():
    return [{"id": 1, "titulo": "Metroid"}]
```

| Pieza | Qué hace |
|---|---|
| `Header(...)` | Lee la cabecera `x-api-key` de la petición (obligatoria) |
| `Depends(verificar_clave)` | Ejecuta la comprobación **antes** de la función de la ruta |
| `dependencies=[...]` | Protege la ruta sin recibir el valor en la función |
| `401` | Código correcto para «no te reconozco» |

> 💡 Si quieres que la ruta **reciba** el usuario validado, declara `usuario: str = Depends(verificar_clave)` y devuelve el nombre desde la dependencia. Así encadenas autenticación y lógica.

---

## 🌍 CORS: llamar desde un navegador

Un navegador bloquea por defecto que una página de `http://localhost:4321` llame a una API de `http://localhost:8000`: son **orígenes** distintos. Para permitirlo, la API debe enviar las cabeceras CORS.

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"],  # en producción, tu dominio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

| Ajuste | Qué controla |
|---|---|
| `allow_origins` | Qué webs pueden llamar a la API |
| `allow_methods` | Qué verbos se permiten (`["*"]` = todos) |
| `allow_headers` | Qué cabeceras puede enviar el cliente |

> ⚠️ **Nunca pongas `allow_origins=["*"]` con credenciales en producción.** Es como dejar la puerta abierta y además preguntar el nombre al que entra.

---

## 🔐 Secretos fuera del código

La API key **no** va en `main.py` ni se sube a GitHub:

```bash
# .env
API_KEY=una-clave-larga-y-aleatoria
```

```python
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("API_KEY")
```

Y en `.gitignore`:

```text
.env
venv/
__pycache__/
*.db
videojuegos.db
```

> 💡 Fíjate en `*.db`: la base de datos local tampoco se sube. Se regenera con el script de poblado y así el repo no arrastra datos de prueba.

---

## 🚀 Arrancar en producción

`--reload` vigila ficheros y reinicia el servidor: perfecto en desarrollo, **prohibido en producción** (consume recursos y corta peticiones).

```bash
# Desarrollo
uvicorn main:app --reload --port 8000

# Producción: varios procesos, sin recarga
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

| Opción | Efecto |
|---|---|
| `--host 0.0.0.0` | Escucha en todas las interfaces (accesible desde la red) |
| `--workers 4` | Cuatro procesos atendiendo peticiones en paralelo |
| `--reload` | Solo desarrollo |
| `--port` | Puerto de escucha |

> ⚠️ **`--workers` y SQLite:** varios procesos escribiendo el mismo fichero pueden bloquearse. Para clase, un worker y listo; si la API crece, toca PostgreSQL.

---

## 🧱 Buenas prácticas de entrega

| Práctica | Por qué |
|---|---|
| Códigos de estado correctos | El cliente distingue éxito, error suyo y error del servidor |
| `HTTPException` con `detail` claro | Mensajes útiles sin trazas internas |
| `timeout` en las consultas externas | Una API no debe quedarse colgada |
| Validación con Pydantic | Nunca confíes en lo que llega |
| `/docs` presentable | Es la carta de presentación de la API |
| Probar 200/201/404/422 | Los cuatro caminos que siempre fallan |

---

## 🧠 Mini-chequeo

1. ¿Qué hace `Depends(verificar_clave)` en una ruta?
2. ¿Por qué el navegador bloquea una llamada de `localhost:4321` a `localhost:8000`?
3. ¿Qué opción de `uvicorn` no debe usarse en producción?

<details>
<summary>🔄 Respuestas</summary>

1. Ejecuta la función **antes** de la ruta y, si lanza `HTTPException`, la petición no llega al endpoint.
2. Porque son **orígenes distintos** (puerto diferente) y falta la cabecera CORS; se resuelve con `CORSMiddleware`.
3. **`--reload`**: reinicia el servidor al cambiar ficheros y no está pensado para producción.
</details>

---

## ✅ Resumen en 3 frases

- Una dependencia con `Depends` exige la API key antes de ejecutar la ruta y devuelve 401 si no coincide.
- `CORSMiddleware` permite que un navegador de otro origen llame a la API, con orígenes concretos en producción.
- La API se arranca con `uvicorn` sin `--reload`, con `--host 0.0.0.0` y los workers que admita la base de datos.

## 🐛 Vocabulario rápido

| Término | Idea general |
|---|---|
| Dependencia | Función que FastAPI ejecuta antes de la ruta |
| `Header` | Lee una cabecera de la petición |
| CORS | Permiso del navegador para llamar a otro origen |
| Origen | Combinación de protocolo, dominio y puerto |
| Worker | Proceso de uvicorn que atiende peticiones |
| `.env` | Fichero local de variables secretas, fuera de git |

---

📚 [Volver al índice de la unidad](/ApuntesPSP/08-fastapi) · **Anterior:** [07 · Documentación automática y pruebas](/ApuntesPSP/08-fastapi/07-documentacion-y-pruebas) · **Siguiente:** [09 · Ejemplo completo: API de videojuegos](/ApuntesPSP/08-fastapi/09-ejemplo-completo-api-de-videojuegos)
