# Tarefas: Aplicativo de To-Do List Pessoal

**Scale note**: o repositório está vazio, então estas tarefas criam o app inteiro: cerca de 60 tarefas em 5 áreas (banco, domínio, telas, lembretes, tema). Observe a regra de propriedade: cada arquivo pertence a uma única fase. Onde várias histórias contribuem para a mesma tela (formulário, linha, barra da lista, repositório), a fundação cria um ponto de extensão por pasta e cada história só **acrescenta um arquivo novo** nela.

**Entrada**: `plan.md`, `todo-list.spec.md`, `data-model.md`, `contracts/ui-and-data.md`, `design-spec.md`, `research.md`, `prototipo.html`
**Stack**: Vite + React 18 + TypeScript, Dexie, Vitest + fake-indexeddb + Testing Library
**Formato**: `- [ ] **T###** [P?] [US#] Descrição · caminho`. `[P]` = independente dentro da onda. Os `data-testid` e rotas de `contracts/ui-and-data.md` valem literalmente.

**Pontos de extensão** (criados na Fase 2, preenchidos pelas histórias via `import.meta.glob` eager):

| Pasta | Contrato do arquivo | Quem lê |
|---|---|---|
| `src/db/extensions/*.ts` | registra ganchos `onSave`, `onDone`, `onDelete` de `src/db/hooks.ts` | `src/db/repo.ts` |
| `src/features/tasks/sections/*.tsx` | `{ order, Component, onSaved? }` | `TaskDialog.tsx` |
| `src/features/tasks/chips/*.tsx` | `{ order, Component }` | `TaskRow.tsx` |
| `src/features/tasks/toolbar/*.tsx` | `{ order, Component }` | `TaskList.tsx` |
| `src/domain/view/*.ts` | `{ order, apply(tasks, params) }` | `src/domain/view.ts` |
| `src/features/*/Page.tsx` | tela da rota (`tasks`→`/tarefas`, `dashboard`→`/`, `calendar`, `projects`, `history`, `stats`) | `src/routes.tsx` |
| `src/features/*/Provider.tsx` | provedor montado em volta do app | `src/App.tsx` |

---

## Fase 1: Preparação

**Wave 1 — única:**

- [x] **T001** Criar projeto Vite + React + TS com `dexie`, `dexie-react-hooks`, `react-router-dom`, `vitest`, `fake-indexeddb`, `@testing-library/react`, `jsdom`; configurar Vitest; incluir no `<head>` o script inline que aplica o tema antes de pintar · `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — independent (different files):**

- [x] **T002** [P] Tokens de cor claro/escuro, tipografia, espaçamento, raio, movimento, foco de 2px e `prefers-reduced-motion` (seção 3 do design-spec) · `src/theme/theme.css`
- [x] **T003** [P] Ler/gravar `theme` no `localStorage` (ausente = seguir o sistema) e setup de testes com `fake-indexeddb` · `src/theme/theme.ts`, `tests/setup.ts`

---

## Fase 2: Fundacional (bloqueia todas as histórias)

Files: tipos, schema, hooks e repositório base, utilitários de data, primitivos de `ui/`, tema, casca do app e carregadores dos pontos de extensão.

**Wave 1 — independent (different files):**

- [x] **T004** [P] Tipos `Task`, `Subtask`, `Recurrence`, `Reminder`, `Group`, `Activity` conforme `data-model.md` · `src/db/types.ts`
- [x] **T005** [P] Registro de ganchos `onSave`, `onDone`, `onDelete` · `src/db/hooks.ts`
- [x] **T006** [P] Utilitários de data local `YYYY-MM-DD`/`HH:mm`, fim do dia, soma de meses com último dia · `src/domain/dates.ts`
- [x] **T007** [P] Botão, estado vazio (`empty-state`), toast com `aria-live` (`toast`) · `src/ui/Button.tsx`, `src/ui/EmptyState.tsx`, `src/ui/Toast.tsx`
- [x] **T008** [P] Confirmação (`confirm-delete`) e diálogo de nome, ambos com `<dialog>` nativo · `src/ui/ConfirmDialog.tsx`, `src/ui/NameDialog.tsx`
- [x] **T009** [P] Chip de metadados/prioridade e anel de progresso · `src/ui/Chip.tsx`, `src/ui/ProgressRing.tsx`
- [x] **T010** [P] Botão de tema (`theme-toggle`, FR-025) · `src/theme/ThemeToggle.tsx`
- [x] **T011** [P] Carregador do pipeline de visão (ordena por `order`, aplica `apply` em sequência) · `src/domain/view.ts`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — única:**

- [x] **T012** Schema Dexie e índices (`dueDate`, `done`, `projectId`, `categoryId`, `*tagIds`, `completedAt`; subtask, reminder, activity, groups) · `src/db/schema.ts`

**⟶ Wait for Wave 2 to finish, then:**

**Wave 3 — única:**

- [x] **T013** Repositório base: transação que grava a mudança e a atividade juntas, `updatedAt` em toda escrita, execução dos ganchos, carga eager de `./extensions/*.ts` · `src/db/repo.ts`

**⟶ Wait for Wave 3 to finish, then:**

**Wave 4 — independent (different files):**

- [x] **T014** [P] Layout: barra lateral de 248px ≥900px, barra inferior com 5 itens e folha "Mais" abaixo, cabeçalho com `theme-toggle` · `src/ui/Layout.tsx`
- [x] **T015** [P] Entrada, rotas com HashRouter (6 rotas, carga por `features/*/Page.tsx`, tela vazia se faltar) e provedores por `features/*/Provider.tsx` · `src/main.tsx`, `src/App.tsx`, `src/routes.tsx`

**Checkpoint**: app abre, navega entre as rotas e alterna o tema.

---

## Fase 3: US1 — Capturar e concluir tarefas (P1) 🎯 MVP

**Objetivo**: ciclo completo criar, editar, concluir, excluir, persistente.
**Teste independente**: criar, editar, concluir e excluir; recarregar e conferir.
Files: `src/db/tasks.ts`, `src/features/tasks/QuickAdd.tsx`, `TaskRow.tsx`, `TaskDialog.tsx`, `TaskList.tsx`, `Page.tsx`

### Tests

Files: `tests/features/us1-tasks.test.ts`

- [x] **T016** [US1] Escrever primeiro (devem falhar): título vazio/espaços rejeitado (FR-002); criar grava atividade `criada`; editar; `setDone` alterna `completedAt`; excluir remove; dados sobrevivem a reabrir o banco · `tests/features/us1-tasks.test.ts`

### Implementation

**Wave 1 — única:**

- [x] **T017** [US1] `createTask`, `updateTask`, `setDone`, `deleteTask` sobre `repo.ts`, acionando os ganchos (FR-001 a FR-006) · `src/db/tasks.ts`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — independent (different files):**

- [x] **T018** [P] [US1] Captura rápida só com título, erro inline (`quick-add-input`, `quick-add-submit`, `quick-add-error`; FR-028, SC-001) · `src/features/tasks/QuickAdd.tsx`
- [x] **T019** [P] [US1] Linha com `task-toggle`, `task-edit`, `task-delete`, confirmação de exclusão, e carga eager de `chips/*.tsx` · `src/features/tasks/TaskRow.tsx`
- [x] **T020** [P] [US1] Diálogo (folha inferior no mobile): título e descrição visíveis, "Mais opções" com carga eager de `sections/*.tsx`, `task-form-title`, `task-form-description`, `task-form-save` · `src/features/tasks/TaskDialog.tsx`

**⟶ Wait for Wave 2 to finish, then:**

**Wave 3 — independent (different files):**

- [x] **T021** [P] [US1] Lista com `useLiveQuery`, pipeline de visão, carga eager de `toolbar/*.tsx`, concluídas separadas, estado vazio e "Mostrar mais" a cada 50 (FR-026, FR-027) · `src/features/tasks/TaskList.tsx`
- [x] **T022** [P] [US1] Tela `/tarefas` com captura rápida e lista · `src/features/tasks/Page.tsx`

**Checkpoint**: US1 é um app utilizável e testável sozinha.

---

## Fase 4: US2 — Prazo, horário e lembrete (P2)

**Objetivo**: prazo com horário opcional, atraso visível, aviso no momento certo.
**Teste independente**: definir prazo e lembrete, ver o atraso, receber o toast em até 1 min.
Files: `src/domain/status.ts`, `src/db/schedule.ts`, `src/db/extensions/reminders.ts`, `src/features/tasks/sections/DueSection.tsx`, `src/features/tasks/chips/DueChip.tsx`, `src/features/reminders/scheduler.ts`, `src/features/reminders/Provider.tsx`

### Tests

Files: `tests/domain/status.test.ts`, `tests/features/us2-schedule.test.ts`

**Wave 1 — independent (different files):**

- [x] **T023** [P] [US2] `isOverdue`: sem horário vale fim do dia; concluída nunca atrasa · `tests/domain/status.test.ts`
- [x] **T024** [P] [US2] Lembrete dispara uma vez; não dispara se concluída, excluída ou removido (FR-010); `at` recalculado ao mudar o prazo · `tests/features/us2-schedule.test.ts`

### Implementation

**Wave 1 — independent (different files):**

- [x] **T025** [P] [US2] `isOverdue` · `src/domain/status.ts`
- [x] **T026** [P] [US2] `setDue`, `setReminder`/`clearReminder` (minutos antes, exige prazo) · `src/db/schedule.ts`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — independent (different files):**

- [x] **T027** [P] [US2] Ganchos: concluir encerra lembretes, excluir apaga, salvar recalcula `at` · `src/db/extensions/reminders.ts`
- [x] **T028** [P] [US2] Seção de prazo, horário e lembrete (`task-form-due-date`, `task-form-due-time`, `task-form-reminder`) · `src/features/tasks/sections/DueSection.tsx`
- [x] **T029** [P] [US2] Chip de prazo e sinal de atraso com ícone e texto (`task-overdue-badge`, FR-008) · `src/features/tasks/chips/DueChip.tsx`
- [x] **T030** [P] [US2] Agendador: verificação a cada 15s e ao ganhar foco, 09:00 sem horário, grava `firedAt` (FR-009, SC-005) · `src/features/reminders/scheduler.ts`

**⟶ Wait for Wave 2 to finish, then:**

**Wave 3 — única:**

- [x] **T031** [US2] Provedor que roda o agendador e mostra o toast · `src/features/reminders/Provider.tsx`

**Checkpoint**: prazos, atraso e lembretes funcionam sobre a US1.

---

## Fase 5: US3 — Prioridade, categorias e etiquetas (P2)

**Objetivo**: priorizar e classificar, ordenar por prioridade.
**Teste independente**: atribuir os três atributos e ordenar.
Files: `src/db/groups.ts`, `src/domain/view/sort.ts`, `src/features/tasks/sections/OrganizeSection.tsx`, `src/features/tasks/chips/OrganizeChips.tsx`, `src/features/tasks/toolbar/SortSelect.tsx`, `src/features/projects/ManageGroups.tsx`

### Tests

Files: `tests/features/us3-organize.test.ts`

- [x] **T032** [US3] Prioridade altera e ordena; nome único sem diferenciar caixa; `deleteGroup` desassocia sem apagar tarefas e devolve a contagem (FR-014) · `tests/features/us3-organize.test.ts`

### Implementation

**Wave 1 — independent (different files):**

- [x] **T033** [P] [US3] CRUD de categoria, etiqueta e projeto, `deleteGroup(kind, id)` (FR-012, FR-013) · `src/db/groups.ts`
- [x] **T034** [P] [US3] Passo de visão que ordena por prioridade · `src/domain/view/sort.ts`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — independent (different files):**

- [x] **T035** [P] [US3] Seção de prioridade, categoria e etiquetas (`task-form-priority`, `task-form-category`) · `src/features/tasks/sections/OrganizeSection.tsx`
- [x] **T036** [P] [US3] Chips de prioridade, categoria e etiquetas na linha · `src/features/tasks/chips/OrganizeChips.tsx`
- [x] **T037** [P] [US3] Seletor de ordenação (`sort-select`) · `src/features/tasks/toolbar/SortSelect.tsx`
- [x] **T038** [P] [US3] Criar, renomear e excluir grupos, com aviso da contagem afetada · `src/features/projects/ManageGroups.tsx`

**Checkpoint**: tarefas classificáveis e ordenáveis.

---

## Fase 6: US4 — Subtarefas, projetos e recorrência (P3)

**Objetivo**: quebrar, agrupar e repetir trabalho.
**Teste independente**: projeto com tarefas, subtarefas com progresso, recorrência gera a próxima.
Files: `src/domain/recurrence.ts`, `src/domain/progress.ts`, `src/db/structure.ts`, `src/db/extensions/recurrence.ts`, `src/db/extensions/subtasks.ts`, `src/features/tasks/sections/StructureSection.tsx`, `src/features/tasks/chips/ProgressChip.tsx`, `src/features/projects/Page.tsx`

### Tests

Files: `tests/domain/recurrence.test.ts`, `tests/features/us4-structure.test.ts`

**Wave 1 — independent (different files):**

- [x] **T039** [P] [US4] `nextOccurrence`: diária, semanal, mensal dia 31, `until`, intervalo > 1 · `tests/domain/recurrence.test.ts`
- [x] **T040** [P] [US4] Concluir recorrente cria a próxima na mesma transação e copia subtarefas reabertas; reabrir não apaga a criada; excluir tarefa remove subtarefas; progresso reflete subtarefas · `tests/features/us4-structure.test.ts`

### Implementation

**Wave 1 — independent (different files):**

- [x] **T041** [P] [US4] `nextOccurrence` (FR-017) · `src/domain/recurrence.ts`
- [x] **T042** [P] [US4] `progress` de subtarefas, vazio sem subtarefas (FR-015) · `src/domain/progress.ts`
- [x] **T043** [P] [US4] CRUD de subtarefas (criar, alternar, ordenar, excluir) · `src/db/structure.ts`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — independent (different files):**

- [x] **T044** [P] [US4] Ganchos: concluir recorrente cria a próxima ocorrência; excluir tarefa remove subtarefas · `src/db/extensions/recurrence.ts`, `src/db/extensions/subtasks.ts`
- [x] **T045** [P] [US4] Seção de subtarefas, recorrência e projeto (`subtask-input`, `subtask-row`, `subtask-toggle`, `task-form-recurrence`, `task-form-project`) · `src/features/tasks/sections/StructureSection.tsx`
- [x] **T046** [P] [US4] Chip de progresso (`task-progress`) · `src/features/tasks/chips/ProgressChip.tsx`
- [x] **T047** [P] [US4] Tela `/projetos`: tarefas agrupadas por projeto, mais `ManageGroups` (FR-016) · `src/features/projects/Page.tsx`

**Checkpoint**: estrutura e recorrência funcionam.

---

## Fase 7: US5 — Painel (P3)

**Objetivo**: visão do dia ao abrir o app.
**Teste independente**: tarefas em estados variados caem no grupo certo; progresso atualiza.
Files: `src/domain/dashboard.ts`, `src/features/dashboard/Page.tsx`, `tests/domain/dashboard.test.ts`

### Tests

- [x] **T048** [US5] Agrupamento hoje/pendentes/atrasadas e `todayProgress` (concluídas sobre previstas; FR-019) · `tests/domain/dashboard.test.ts`

### Implementation

**Wave 1 — única:**

- [x] **T049** [US5] `groupForDashboard` e `todayProgress` (usa `isOverdue` da US2) · `src/domain/dashboard.ts`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — única:**

- [x] **T050** [US5] Painel em `/`: `dashboard-today`, `dashboard-pending`, `dashboard-overdue`, `dashboard-progress`, anel de progresso, captura rápida no topo, mensagem "nada para hoje" (FR-018, SC-003) · `src/features/dashboard/Page.tsx`

**Checkpoint**: painel funcional.

---

## Fase 8: US6 — Pesquisa, filtros e calendário (P3)

**Objetivo**: achar e ver tarefas no tempo.
**Teste independente**: pesquisar, combinar filtros, limpar, navegar meses.
Files: `src/domain/view/filter.ts`, `src/features/tasks/toolbar/SearchBar.tsx`, `src/features/tasks/toolbar/FilterBar.tsx`, `src/features/calendar/Page.tsx`, `tests/domain/filters.test.ts`

### Tests

- [x] **T051** [US6] Busca em título e descrição, filtros combinados por categoria, etiqueta, prioridade, estado e prazo, limpar; 500 tarefas em menos de 1s (SC-004) · `tests/domain/filters.test.ts`

### Implementation

**Wave 1 — única:**

- [x] **T052** [US6] Passo de visão com busca e filtros, parâmetros lidos da URL (FR-020, FR-021) · `src/domain/view/filter.ts`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — independent (different files):**

- [x] **T053** [P] [US6] Campo de pesquisa (`search-input`) · `src/features/tasks/toolbar/SearchBar.tsx`
- [x] **T054** [P] [US6] Filtros e limpar (`filter-category`, `filter-tag`, `filter-priority`, `filter-status`, `filter-due`, `filter-clear`), estado vazio de resultado · `src/features/tasks/toolbar/FilterBar.tsx`
- [x] **T055** [P] [US6] Calendário mensal (`calendar-prev`, `calendar-next`, `calendar-day` com `data-date`; FR-022) · `src/features/calendar/Page.tsx`

**Checkpoint**: encontrar e visualizar funcionam.

---

## Fase 9: US7 — Histórico, estatísticas e tema (P4)

**Objetivo**: acompanhar produtividade e confirmar o tema.
**Teste independente**: eventos em ordem, números corretos, tema persistente.
Files: `src/domain/stats.ts`, `src/ui/BarChart.tsx`, `src/features/history/Page.tsx`, `src/features/stats/Page.tsx`, `tests/domain/stats.test.ts`, `tests/features/us7-history.test.ts`, `tests/features/theme.test.ts`

### Tests

**Wave 1 — independent (different files):**

- [x] **T056** [P] [US7] Concluídas por dia e semana, taxa de conclusão · `tests/domain/stats.test.ts`
- [x] **T057** [P] [US7] Histórico em ordem cronológica, título preservado após exclusão · `tests/features/us7-history.test.ts`
- [x] **T058** [P] [US7] Tema alterna na hora e persiste entre sessões (SC-007) · `tests/features/theme.test.ts`

### Implementation

**Wave 1 — independent (different files):**

- [x] **T059** [P] [US7] `completedPerDay`, `completedPerWeek`, `completionRate` (FR-024) · `src/domain/stats.ts`
- [x] **T060** [P] [US7] Gráfico de barras em SVG · `src/ui/BarChart.tsx`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — independent (different files):**

- [x] **T061** [P] [US7] Tela `/historico` (`activity-item`, "Mostrar mais" a cada 60; FR-023) · `src/features/history/Page.tsx`
- [x] **T062** [P] [US7] Tela `/estatisticas` (`stat-completed-day`, `stat-completed-week`, `stat-completion-rate`) · `src/features/stats/Page.tsx`

**Checkpoint**: histórico, estatísticas e tema verificados.

---

## Fase 10: Acabamento

Todos os arquivos já têm dono; ajustes aqui rodam depois das histórias.

**Wave 1 — independent:**

- [x] **T063** [P] Auditoria de acessibilidade: contraste ≥ 4,5:1, alvos ≥ 44px, foco visível, teclado nos diálogos, nada só por cor · `src/theme/theme.css`
- [x] **T064** [P] Conferir responsividade nos breakpoints 375, 560, 640, 768, 900, 1100, 1440 contra `prototipo.html` · `src/ui/Layout.tsx`
- [x] **T065** [P] Teste de desempenho com 500 tarefas: lista, busca e calendário (SC-004, SC-008) · `tests/perf/large-list.test.ts`
- [x] **T066** [P] Decidir as pendências do design: confirmar `protoipo.png` como referência, aviso de edição em duas abas, desfazer exclusão · `specs/001-todo-list/design-spec.md`

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — única:**

- [x] **T067** Rodar testes, lint e build e validar contra os Success Criteria SC-001 a SC-008 (sem hook de validação marcado em `companion.yml`, Polish é o único dono) · `package.json`

---

## Dependências e ordem de execução

- Preparação → Fundacional → histórias → Acabamento. A Fundacional bloqueia todas as histórias.
- US1 é o MVP. US2 a US7 só acrescentam arquivos nos pontos de extensão, então tocam arquivos disjuntos da US1 e entre si.
- Dependências de leitura entre histórias: US5 usa `isOverdue` (US2); US6 filtra atributos de US3/US4; US4 `ProjectsPage` usa `ManageGroups` (US3); US7 lê a atividade gravada desde a US1.
- Ondas: cada fase lista as suas; uma onda só começa depois da anterior terminar. Testes de cada história são escritos antes e devem falhar.

## Cobertura

FR-001 a FR-006: T016–T022 · FR-007 a FR-010: T023–T031 · FR-011 a FR-014: T032–T038 · FR-015 a FR-017: T039–T047 · FR-018, FR-019: T048–T050 · FR-020 a FR-022: T051–T055 · FR-023, FR-024: T056–T062 · FR-025: T003, T010, T058 · FR-026: T007, T021, T054 · FR-027: T021, T065 · FR-028: T018, T020
