# -*- coding: utf-8 -*-
"""Exporta los apuntes a DOCX: un DOCX de apuntes y otro de boletines por unidad.

Salida:

    docx_out/
    ├── UD 1 - Python basico/
    │   ├── UD 1 - Apuntes.docx      ← índice + 9 capítulos de la unidad
    │   └── UD 1 - Boletines.docx    ← los 4 boletines (inicial/avanzado ± resueltos)
    ├── ...
    └── INDICE.docx                  ← índice general de todas las carpetas

Igual que generate-epub.ps1: reescribe las rutas de los diagramas para que
apunten a los PNG locales (DOCX no admite SVG), previamente generados en
docx_out/pngs/ con scripts/svg2png.mjs (Chromium respeta el Excalifont
embebido; librsvg no).
"""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "content" / "docs"
OUT = ROOT / "docx_out"
PNGS = OUT / "pngs"

UNIDADES = [
    "00-python-basico",
    "01-gestion-de-procesos",
    "02-hilos-y-concurrencia",
    "03-sincronizacion",
    "04-sockets-tcp-y-udp",
    "05-servidores-concurrentes",
    "06-http-y-apis-rest",
    "07-apis-comerciales",
    "08-seguridad-y-cifrado",
    "09-alta-disponibilidad",
    "10-anexo-spring-boot",
]

# Etiqueta "UD n" (el Anexo no lleva número).
UD_NUM = {
    "00-python-basico": "UD 1",
    "01-gestion-de-procesos": "UD 2",
    "02-hilos-y-concurrencia": "UD 3",
    "03-sincronizacion": "UD 4",
    "04-sockets-tcp-y-udp": "UD 5",
    "05-servidores-concurrentes": "UD 6",
    "06-http-y-apis-rest": "UD 7",
    "07-apis-comerciales": "UD 8",
    "08-seguridad-y-cifrado": "UD 9",
    "09-alta-disponibilidad": "UD 10",
    "10-anexo-spring-boot": "Anexo",
}

# Nombre corto de carpeta por unidad (es-ES, sin tildes en disco).
NOMBRES_UNIDAD = {
    "00-python-basico": "Python 3 basico",
    "01-gestion-de-procesos": "Gestion de procesos",
    "02-hilos-y-concurrencia": "Hilos y concurrencia",
    "03-sincronizacion": "Sincronizacion",
    "04-sockets-tcp-y-udp": "Sockets TCP y UDP",
    "05-servidores-concurrentes": "Servidores concurrentes",
    "06-http-y-apis-rest": "HTTP y APIs REST",
    "07-apis-comerciales": "APIs comerciales",
    "08-seguridad-y-cifrado": "Seguridad y cifrado",
    "09-alta-disponibilidad": "Alta disponibilidad",
    "10-anexo-spring-boot": "Spring Boot",
}

# Códigos U00..U09 que tienen boletines (el Anexo no tiene).
BOLETINES_CODIGOS = {"00", "01", "02", "03", "04", "05",
                     "06", "07", "08", "09"}
# Orden didáctico dentro del DOCX de boletines.
BOLETINES_SECCIONES = ["inicial", "inicial-resuelto",
                       "avanzado", "avanzado-resuelto"]

IMG_RE = re.compile(
    r"!\[([^\]]*)\]\((?:/ApuntesPSP)?/diagrams/([^)/]+)\.svg\)")

AVISO_NO_PNG = "DIAGRAMA_NO_DISPONIBLE"


# ---------- utilidades MD ----------

def build_mapa_png():
    return {p.stem: p for p in PNGS.glob("*.png")}


def reescribe_imagenes(md, mapa):
    def sust(m):
        alt, nombre = m.group(1), m.group(2)
        png = mapa.get(nombre)
        if png is None:
            print(f"  AVISO: sin PNG para {nombre}")
            return f"`[{AVISO_NO_PNG}: {nombre}]`"
        return f"![{alt}]({png.as_posix()})"
    return IMG_RE.sub(sust, md)


def quita_frontmatter(md):
    return re.sub(r"\A---\s*\n.*?\n---\s*\n?", "", md, count=1, flags=re.S)


def titulo(md, fallback):
    m = re.search(r'(?m)^title:\s*"?([^"\r\n]+)"?\s*$', md)
    return m.group(1).strip() if m else fallback


def pandoc(md_path, docx_path):
    cmd = [
        "pandoc", md_path.as_posix(),
        "--from", "markdown",
        "--to", "docx",
        "--toc",
        "--toc-depth=2",
        "--resource-path", OUT.as_posix(),
        "-o", docx_path.as_posix(),
    ]
    r = subprocess.run(cmd, cwd=ROOT)
    return r.returncode == 0


def convierte(contenido, docx_path):
    """Escribe el MD en un temporal y lo convierte a DOCX (con TOC)."""
    temp = OUT / ".tmp_docx.md"
    temp.write_text(contenido, encoding="utf-8")
    ok = pandoc(temp, docx_path)
    if ok:
        print(f"  OK: {docx_path.relative_to(OUT).as_posix()} "
              f"({docx_path.stat().st_size:,} bytes)")
    else:
        print(f"  FAIL: {docx_path.name}")
    return ok


def limpia_nombre(nombre):
    """Nombre de fichero DOCX: sin tildes, rayas tipográficas ni ilegales."""
    tabla = str.maketrans("áéíóúñÁÉÍÓÚÑ—–·", "aeiounAEIOUN---")
    nombre = nombre.translate(tabla)
    nombre = re.sub(r'[<>:"/\\|?*]', "-", nombre)
    nombre = re.sub(r"\s*-\s*", " - ", nombre)
    return re.sub(r"\s+", " ", nombre).strip(" -")


# ---------- composición de documentos ----------

def docx_apuntes(unidad, ud, mapa):
    """Une índice + 9 capítulos en un único MD (H1 por documento)."""
    partes = []
    indice = SRC / f"{unidad}.md"
    if indice.exists():
        md = indice.read_text(encoding="utf-8")
        partes.append(f"# {titulo(md, ud)}\n\n"
                      + reescribe_imagenes(quita_frontmatter(md), mapa))
    for cap in sorted((SRC / unidad).glob("*.md")):
        md = cap.read_text(encoding="utf-8")
        partes.append(f"# {titulo(md, cap.stem)}\n\n"
                      + reescribe_imagenes(quita_frontmatter(md), mapa))
    return "\n\n".join(partes) + "\n"


def docx_boletines(unidad, codigo, mapa):
    """Une los 4 boletines de la unidad en un único MD (H1 por boletín)."""
    partes = []
    for sec in BOLETINES_SECCIONES:
        b = SRC / "boletines" / f"boletin-U{codigo}-{sec}.md"
        if not b.exists():
            print(f"  AVISO: falta {b.name}")
            continue
        md = b.read_text(encoding="utf-8")
        # Los boletines traen su propio H1; se respeta tal cual.
        partes.append(reescribe_imagenes(quita_frontmatter(md), mapa))
    return "\n\n".join(partes) + "\n"


# ---------- main ----------

def main():
    mapa = build_mapa_png()
    print(f"PNGs disponibles: {len(mapa)}\n")

    indice_md = [
        "% Índice — Apuntes PSP",
        "% Sergi Garcia Barea",
        "% 26 de septiembre de 2026",
        "",
        "Apuntes de Programación de Servicios y Procesos exportados a DOCX: "
        "una carpeta por unidad con el DOCX de apuntes (índice + capítulos) "
        "y el DOCX de boletines (inicial y avanzado, sin resolver y "
        "resueltos).",
        "",
    ]
    ok_total = True

    for unidad in UNIDADES:
        ud = UD_NUM[unidad]
        carpeta = OUT / limpia_nombre(f"{ud} - {NOMBRES_UNIDAD[unidad]}")
        carpeta.mkdir(parents=True, exist_ok=True)
        print(f"== {carpeta.name} ==")

        # --- apuntes ---
        contenido = docx_apuntes(unidad, ud, mapa)
        if not convierte(contenido, carpeta / f"{ud} - Apuntes.docx"):
            ok_total = False

        # --- boletines ---
        codigo = unidad.split("-")[0]
        if codigo in BOLETINES_CODIGOS:
            contenido = docx_boletines(unidad, codigo, mapa)
            if not convierte(contenido, carpeta / f"{ud} - Boletines.docx"):
                ok_total = False

        indice_md.append(f"- **{carpeta.name}** — "
                         f"`{ud} - Apuntes.docx`"
                         + (f" + `{ud} - Boletines.docx`"
                            if codigo in BOLETINES_CODIGOS else ""))
        print()

    # --- índice general ---
    temp = OUT / ".tmp_docx.md"
    temp.write_text("\n".join(indice_md) + "\n", encoding="utf-8")
    print("== INDICE.docx ==")
    if not pandoc(temp, OUT / "INDICE.docx"):
        ok_total = False
        print("  FAIL: INDICE.docx")

    temp.unlink(missing_ok=True)
    print("\nListo." if ok_total else "\nTerminado con errores.")


if __name__ == "__main__":
    main()
