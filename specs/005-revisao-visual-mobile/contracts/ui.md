# Contrato de UI: spec 005

Identificadores que CSS, `src/main.tsx` e testes usam. Não renomear.

| Identificador | Onde | Regra |
|---|---|---|
| `data-badge` | atributo em `<html>` | presente só em build de produção |
| `--badge-h` | variável CSS | `0px` por padrão; `56px` com `html[data-badge]` abaixo de 900 px e altura acima de 480 px |
| `.bottomnav` | `Layout.tsx` | itens `Painel`, `Tarefas`, `Calendário`, `Projetos`, `Mais`, nessa ordem |
| `Powered by Netlify` | selo do Netlify | nunca removido nem alterado |
