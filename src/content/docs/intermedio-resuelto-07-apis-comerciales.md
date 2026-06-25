---
title: "💪 INTERMEDIO RESUELTO 7 — APIs Comerciales"
nav_order: 7
---
### 4. .env básico

```python
from dotenv import load_dotenv
import os
load_dotenv()
print(os.getenv("OPENWEATHER_API_KEY"))  # "test123"
```

Crea un .env con: `OPENWEATHER_API_KEY=test123`

### 5. Chat con GPT

```python
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()
cliente = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
resp = cliente.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "¿Qué es Python?"}]
)
print(resp.choices[0].message.content)
```

### 6. Timeout

```python
import requests
try:
    resp = requests.get("https://192.0.2.1", timeout=3)
except requests.exceptions.Timeout:
    print("Timeout — el servidor no responde")
```

192.0.2.1 es una IP de test que nunca responde.
