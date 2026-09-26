import json, glob, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SHAPE_TYPES = {"rectangle", "ellipse", "diamond"}
LINE_TYPES = {"line", "arrow"}

def bbox(el):
    if "width" in el and "height" in el:
        return (el["x"], el["y"], el["x"] + el["width"], el["y"] + el["height"])
    pts = el.get("points") or [[0, 0]]
    xs = [el["x"] + p[0] for p in pts]
    ys = [el["y"] + p[1] for p in pts]
    return (min(xs), min(ys), max(xs), max(ys))

def etiq(t):
    return ("etiqueta-flecha" if t.get("containerId") else "texto") + f" '{t['text'][:32]}'"

def inter(a, b, pad=0.0):
    ax0, ay0, ax1, ay1 = a
    bx0, by0, bx1, by1 = b
    ax0 += pad; ay0 += pad; ax1 -= pad; ay1 -= pad
    bx0 += pad; by0 += pad; bx1 -= pad; by1 -= pad
    if ax1 <= ax0 or ay1 <= ay0 or bx1 <= bx0 or by1 <= by0:
        return None
    w = min(ax1, bx1) - max(ax0, bx0)
    h = min(ay1, by1) - max(ay0, by0)
    if w <= 0 or h <= 0:
        return None
    return w * h

for path in sorted(glob.glob("public/diagrams/*.excalidraw")):
    data = json.load(open(path, encoding="utf-8"))
    els = data["elements"]
    shapes, lines, texts = [], [], []
    for el in els:
        if el.get("isDeleted"):
            continue
        t = el.get("type")
        if t in SHAPE_TYPES:
            shapes.append(el)
        elif t in LINE_TYPES:
            lines.append(el)
        elif t == "text":
            texts.append(el)

    problems = []
    free = [t for t in texts if not t.get("containerId")]
    by_id = {el["id"]: el for el in els}
    # etiquetas de FLECHAS: se comportan como textos libres en el punto medio
    arrow_labels = [
        t for t in texts
        if t.get("containerId") and by_id.get(t["containerId"], {}).get("type") == "arrow"
    ]
    movable = free + arrow_labels
    for t in movable:
        tb = bbox(t)
        for s in shapes:
            if t.get("containerId") == s["id"]:
                continue  # etiqueta dentro de su propia caja: correcto
            a = inter(tb, bbox(s), pad=2)
            if a and a > 40:
                problems.append(f"  {etiq(t)} {tb} SOLAPA {a:.0f}px2 con {s['type']} id={s['id']} {bbox(s)}")
        for l in lines:
            if t.get("containerId") == l["id"]:
                continue  # la etiqueta pisa su propia flecha: correcto
            a = inter(tb, bbox(l), pad=2)
            if a and a > 40:
                problems.append(f"  {etiq(t)} {tb} SOLAPA {a:.0f}px2 con {l['type']} id={l['id']} {bbox(l)}")
        for o in movable:
            if o["id"] <= t["id"]:
                continue
            a = inter(tb, bbox(o), pad=2)
            if a and a > 40:
                problems.append(f"  {etiq(t)} {tb} SOLAPA {a:.0f}px2 con {etiq(o)} {bbox(o)}")

    if problems:
        print(f"\n== {path}")
        for p in problems:
            print(p)

print("\n--- fin ---")
