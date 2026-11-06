# Implementation Plan: Revisão visual e menu mobile sem sobreposição

**Branch**: `005-revisao-visual-mobile` | **Date**: 2026-11-06 | **Spec**: [revisao-visual-mobile.spec.md](revisao-visual-mobile.spec.md)

## Summary

Em produção, o selo "Powered by Netlify" (fixo no canto inferior direito, injetado pelo Netlify) cobre o menu inferior do celular. A correção é só de CSS e de um atributo no `<html>`: em produção, o `.bottomnav` ganha uma faixa extra embaixo, com o mesmo fundo do menu, onde o selo fica. Os cinco itens sobem acima do selo, sem vão e sem mexer no selo. O mesmo valor reserva espaço no fim da rolagem (`.main`) e posiciona os avisos (`.toasts`).

A revisão visual roda a skill `impeccable` nas seis telas, em 360, 412 e desktop, e registra achados e mudanças em `review.md`. Um defeito de espaçamento já está identificado: `.sec-head:first-child{margin-top:0}` zera a margem de todo título de seção do Painel, porque cada título é o primeiro filho do seu `<section>`. Por isso "Hoje" e "Pendentes" ficam colados. A correção troca a margem por um espaço entre as seções, em escala única de `--sp-*`.

## Constitution Check

A constituição do projeto ainda é o modelo vazio, sem princípios a avaliar. Nenhuma violação.

## Project Structure

```text
index.html               # sem mudança (o atributo vem de src/main.tsx)
src/main.tsx             # marca <html data-badge> quando import.meta.env.PROD
src/theme/theme.css      # token --badge-h
src/ui/ui.css            # bottomnav, .main, .toasts, ritmo vertical, alvos de toque
src/ui/Layout.tsx        # só se a revisão pedir ajuste de marcação
src/features/*/          # só ajustes de classe apontados pela revisão
tests/features/us9-layout.test.tsx   # atributo data-badge e itens do menu
specs/005-revisao-visual-mobile/review.md   # registro da impeccable
```

**Structure Decision**: sem componentes novos. A reserva do selo é um token CSS ligado por um atributo no `<html>`, para o menu ficar igual com e sem selo (FR-010).

## Key design

- `--badge-h: 0px` por padrão. Com `html[data-badge]` e largura menor que 900 px, `--badge-h: 56px`. O selo tem cerca de 40 px; os 16 px a mais dão folga se ele crescer.
- `.bottomnav{padding-bottom:calc(var(--badge-h) + env(safe-area-inset-bottom))}`: o fundo do menu vai até a borda da tela e o selo flutua sobre a faixa.
- `.main{padding-bottom:calc(80px + var(--badge-h) + env(safe-area-inset-bottom))}` e `.toasts{bottom:calc(80px + var(--badge-h) + ...)}`.
- Celular na horizontal (altura baixa): em `max-height:480px` o `--badge-h` cai para 0 e a faixa some, porque o selo ali já fica ao lado dos itens. Ceiling: se ele ainda cobrir um item, reduzir o menu a ícones.
- `simplified: o atributo vale em qualquer build de produção, inclusive vite preview local; se isso incomodar, ligar só no domínio netlify.app.`

## Revisão com impeccable (FR-001)

1. Rodar `impeccable` (critique/audit) em Painel, Tarefas, Calendário, Projetos, Histórico, Estatísticas e nos diálogos, em 360, 412 e desktop, nos dois temas.
2. Registrar em `review.md` uma tabela por tela: achado, severidade, correção ou justificativa.
3. Corrigir em `ui.css` usando só `--sp-*` (4/8/12/16/24/32/48), sem valores soltos.
4. Conferir contraste ≥ 4,5:1 e alvos ≥ 44 px (já são 44 px nos botões; checar `.nav-ind`, `.cal-cell` e `.link-btn`).

## Verificação

`npm test` e `npm run build` passam (SC-005). Conferência visual no navegador com um selo simulado (um `div` fixo de 40 px no canto) em 360 e 412 px, nos dois temas.
