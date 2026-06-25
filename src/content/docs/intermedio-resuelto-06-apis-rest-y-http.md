---
title: "💪 INTERMEDIO RESUELTO 6 — APIs REST y HTTP"
nav_order: 6
---
### 4. Código 404

```python
import requests
resp = requests.get("https://api.github.com/users/usuarioquenoexiste123")
print(resp.status_code)  # 404
```

El servidor devuelve 404. No lanza excepción a menos que uses `raise_for_status()`.

### 5. GET con parámetros

```python
import requests
resp = requests.get("https://jsonplaceholder.typicode.com/posts", params={"userId": 1})
posts = resp.json()
print(f"El usuario 1 tiene {len(posts)} posts")
```

`params` construye la query string automáticamente.

### 6. POST simple

```python
import requests
resp = requests.post("https://jsonplaceholder.typicode.com/posts",
                     json={"title": "test", "body": "test", "userId": 1})
print(resp.status_code)  # 201 Created
```

201 = "Created". El recurso se ha creado correctamente.
