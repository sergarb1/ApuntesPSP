---
title: "✅ INICIAL RESUELTO 6 — APIs REST y HTTP"
nav_order: 6
---
### 1. GET a GitHub

```python
import requests
resp = requests.get("https://api.github.com/users/python")
print(resp.status_code)  # 200
```

### 2. Mostrar JSON

```python
import requests
resp = requests.get("https://api.github.com/users/python")
print(resp.json())
```

`resp.json()` convierte el JSON a diccionario Python.

### 3. Nombre real

```python
import requests
datos = requests.get("https://api.github.com/users/python").json()
print(datos["name"])  # "Python"
```
