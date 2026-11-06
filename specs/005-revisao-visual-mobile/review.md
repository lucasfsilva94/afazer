# Revisão visual — spec 005

**Método**: critique/audit nas seis telas e nos diálogos, no `vite preview` do build de produção (selo reservado por `data-badge`). Capturas com Chrome headless em 360 px, tema escuro, com um selo simulado de 150×40 px no canto inferior direito. Contraste calculado a partir dos tokens de `theme.css`. Limite: sem dados cadastrados (só estados vazios), e o tema claro e a largura de 412 px não foram capturados (o Chrome headless ignorou a preferência de tema); a Estatísticas saiu em branco na captura e não foi avaliada.

## Menu inferior / selo (US1)

| Achado | Severidade | Correção |
|---|---|---|
| Selo "Powered by Netlify" cobria os itens do menu | Alta | `--badge-h` (56 px) reservado no `padding-bottom` do `.bottomnav`; verificado: cinco itens acima do selo, sem vão, selo intocado |
| "Mais" (`button`) com fonte maior e sem negrito, diferente dos links | Média | Regras de `.bottomnav a` estendidas a `.bottomnav button` |
| Fim da rolagem e avisos (`.toasts`) ficavam atrás do menu + selo | Alta | `80px + --badge-h + safe-area` em `.main` e `.toasts` |
| Diálogo em folha inferior: botões da direita ficariam sob o selo | Alta | `padding-bottom: var(--badge-h)` e `max-height` descontando o selo em `dialog.dlg` |

## Por tela

| Tela | Achado | Severidade | Correção / justificativa |
|---|---|---|---|
| Painel | Títulos "Hoje" e "Pendentes" colados ao bloco anterior (`.sec-head:first-child{margin-top:0}` zerava todos) | Média | Regra removida; espaço vem de `.content section+section` e `.capture+section` (`--sp-5`) |
| Calendário | "Novembro De 2026" e "Sexta-Feira, 6 De Novembro": `text-transform:capitalize` põe "De" e "Feira" em maiúscula | Média | `::first-letter` em maiúscula (`.cap-first`, `.cal-head h2`) |
| Calendário | Células com ~43 px de largura em 360 px (< 44 px) | Baixa | `gap:2px` abaixo de 420 px: células de 45 px |
| Projetos | "Novo categoria" / "Nenhum categoria ainda" (concordância) | Baixa | `Nova`/`Nenhuma` quando o rótulo termina em "a" |
| Tarefas | Sem achados (campo de adicionar e filtros ok com lista vazia) | — | Justificado: nada a corrigir |
| Histórico | Sem achados | — | Justificado |
| Estatísticas | Não avaliada visualmente (captura em branco) | — | Pendente de conferência manual |

## Transversais

| Critério | Resultado |
|---|---|
| Contraste (FR-009) | Texto ≥ 5,47:1 e bordas de controles ≥ 3,35:1, nos dois temas: sem mudança de tokens |
| Alvos de toque (FR-008) | `.btn`, `.icon-btn`, `.link-btn`, `.nav a`, itens do menu ≥ 44 px; `.nav-ind` é só indicador (o alvo é o link de 64 px); calendário corrigido |
| Rolagem horizontal em 360 px (FR-007) | Não observada nas cinco telas capturadas |
| Espaçamento (FR-005/006) | Só `--sp-*` nos ajustes novos; sem valores soltos além de `2px` do calendário |
