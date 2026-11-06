# Pesquisa

## Onde ficam os arquivos

**Decision**: originais em `assets/logo/`; só `favicon.svg` copiado para `public/`.
**Rationale**: a spec pede pasta fora de `src/`; o favicon precisa de URL estática no `index.html`.
**Alternatives considered**: tudo em `public/` (mistura fonte do logo com arquivos servidos); tudo em `src/assets` (viola a spec).

## Troca claro/escuro

**Decision**: duas `<img>` alternadas por CSS com `[data-theme]`.
**Rationale**: o app já define o tema por `data-theme` (script no `index.html`), não por `prefers-color-scheme`, então `<picture>` não serve. Sem JS extra e sem piscar no carregamento.
**Alternatives considered**: SVG inline com `var(--accent)` (sem arquivo oficial no app, foge do FR-003); troca por estado React (flash e mais código).

## Texto independente de fonte

**Decision**: pedir à skill o nome em `<path>` (curvas), não `<text>`.
**Rationale**: FR-005. Se a skill gerar `<text>`, converter com `inkscape --export-text-to-path` ou outra ferramenta antes de salvar.
**Alternatives considered**: embutir a fonte em base64 (pesado e some ao rasterizar).

## PNGs

**Decision**: usar `scripts/svg_to_png.py` da skill (`cairosvg`).
**Rationale**: a skill já traz o conversor. Exige `pip install -r requirements.txt` e a lib Cairo, que pode faltar no Windows; se falhar, exportar pelo navegador.
**Alternatives considered**: `sharp` no npm (dependência nova no app só para um passo único).
