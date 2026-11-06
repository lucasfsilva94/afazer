# Plano: Logo do aFazer

**Spec**: [logo-afazer.spec.md](logo-afazer.spec.md)

## Summary

Gerar o logo com a skill `logo-generator` (símbolo, logo completo, versão escura, PNGs) em `assets/logo/`, com o texto "aFazer" convertido em curvas para não depender de fonte. O app passa a usar esses SVGs: o cabeçalho troca a versão pelo `data-theme`, a aba usa o símbolo como favicon e a grafia "Afazer" vira "aFazer". O README ganha o logo no topo. Não há dependência nova no app; a skill usa Python (`cairosvg`) só para gerar os arquivos.

## Project Structure

```text
assets/logo/            # fonte da verdade, gerada pela skill
  afazer-symbol.svg
  afazer-logo.svg       # claro
  afazer-logo-dark.svg  # escuro
  afazer-symbol.png
  afazer-logo.png
public/favicon.svg      # cópia do símbolo, servida na raiz pelo Vite
src/ui/Layout.tsx       # troca <Logo> inline por imagens; grafia
src/ui/ui.css           # alterna versão clara/escura por data-theme
index.html              # <link rel="icon">, <title>
README.md               # logo no topo
tests/                  # teste da grafia e do alt do logo
```

**Structure Decision**: `assets/logo/` guarda os originais (fora de `src/`, conforme a spec). O Vite importa os SVGs de lá no `Layout.tsx`; só o favicon fica em `public/` porque o `index.html` precisa de uma URL fixa.

## Constitution Check

A constituição do projeto ainda é o modelo em branco, sem princípios. Nada a verificar; sem violações.

## Notas de design

- **Tema**: duas tags `<img>` no cabeçalho (clara e escura). O CSS esconde uma pela regra `[data-theme='escuro']`. A escondida usa `display:none`, então só uma é anunciada. A visível tem `alt="aFazer"` e a outra `alt=""`.
- **Cabeçalho mobile**: `.brand-mini` mostra só o símbolo; o `h1` já traz o título da tela. Hoje ele é `aria-hidden`, e o símbolo continua assim.
- **Cor**: o símbolo claro usa `#0F766E` e o escuro `#3CC4B4`, os valores de `--accent` em `src/theme/theme.css`.
- **Vitrine** (Gemini, chave externa): opcional. Sem chave, tudo o mais é entregue (FR-010 é SHOULD).
