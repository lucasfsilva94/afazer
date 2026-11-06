# Contrato de UI e Dados

A spec não traz seção de restrições literais. Os identificadores abaixo são definidos por este plano e passam a valer como contrato: testes e telas usam exatamente estas strings, sem renomear nem mudar a caixa.

## Rotas (HashRouter)

| Rota | Tela |
|---|---|
| `/` | Painel |
| `/tarefas` | Lista de tarefas |
| `/calendario` | Calendário |
| `/projetos` | Projetos, categorias e etiquetas |
| `/historico` | Histórico de atividades |
| `/estatisticas` | Estatísticas |

## Identificadores de teste (`data-testid`)

| Identificador | Elemento |
|---|---|
| `quick-add-input` | campo de captura rápida |
| `quick-add-submit` | botão de adicionar |
| `quick-add-error` | mensagem de título inválido |
| `task-row` | linha de tarefa (atributo `data-task-id`) |
| `task-toggle` | caixa de concluir |
| `task-edit` | abrir edição |
| `task-delete` | excluir |
| `confirm-delete` | confirmar exclusão no modal |
| `task-overdue-badge` | sinal de atraso |
| `task-form-title`, `task-form-description`, `task-form-due-date`, `task-form-due-time`, `task-form-priority`, `task-form-category`, `task-form-project`, `task-form-reminder`, `task-form-recurrence`, `task-form-save` | campos do formulário |
| `subtask-input`, `subtask-row`, `subtask-toggle`, `task-progress` | subtarefas e progresso |
| `dashboard-today`, `dashboard-pending`, `dashboard-overdue`, `dashboard-progress` | seções do painel |
| `search-input` | pesquisa |
| `filter-category`, `filter-tag`, `filter-priority`, `filter-status`, `filter-due`, `filter-clear` | filtros |
| `sort-select` | ordenação |
| `empty-state` | estado vazio explicativo |
| `calendar-prev`, `calendar-next`, `calendar-day` (atributo `data-date`) | calendário |
| `activity-item` | evento do histórico |
| `stat-completed-day`, `stat-completed-week`, `stat-completion-rate` | estatísticas |
| `theme-toggle` | alternar tema |
| `toast` | aviso, incluindo lembretes |

## Valores fechados

- Prioridade: `"alta"`, `"media"`, `"baixa"`.
- Estado do filtro: `"todas"`, `"pendentes"`, `"concluidas"`.
- Recorrência: `"diaria"`, `"semanal"`, `"mensal"`.
- Tipo de atividade: `"criada"`, `"concluida"`, `"reaberta"`, `"editada"`, `"excluida"`.
- Tema: `"claro"`, `"escuro"`, aplicado em `document.documentElement.dataset.theme`.

## Tabelas Dexie

Nome do banco `todo-app`. Tabelas e índices:

```text
tasks:       id, dueDate, done, projectId, categoryId, *tagIds, completedAt
subtasks:    id, taskId
reminders:   id, taskId, at
projects:    id, name
categories:  id, name
tags:        id, name
activity:    id, at
```

Formato dos campos em `data-model.md`.

## Repositório (`src/db/repo.ts`)

```ts
createTask(input: { title: string } & Partial<TaskFields>): Promise<Task>   // rejeita título vazio
updateTask(id: string, patch: Partial<TaskFields>, loadedUpdatedAt: number): Promise<Task> // rejeita se updatedAt mudou
setDone(id: string, done: boolean): Promise<void>        // cria próxima ocorrência se recorrente
deleteTask(id: string): Promise<void>                    // remove subtarefas e lembretes
addSubtask(taskId: string, title: string): Promise<Subtask>
setSubtaskDone(id: string, done: boolean): Promise<void>
createGroup(kind: "project" | "category" | "tag", name: string): Promise<Group>
renameGroup(kind: GroupKind, id: string, name: string): Promise<void>
deleteGroup(kind: GroupKind, id: string): Promise<{ detachedTasks: number }>
```

Erros tipados: `InvalidTitleError`, `DuplicateNameError`, `StaleEditError`.

## Funções de domínio (`src/domain`)

```ts
nextOccurrence(dueDate: string, r: Recurrence): string | null      // null ao passar de until
isOverdue(task: Task, now: Date): boolean
subtaskProgress(subtasks: Subtask[]): { done: number; total: number }
applyFilters(tasks: Task[], f: Filters, query: string): Task[]     // todos os filtros em AND
dayProgress(tasks: Task[], today: string): { done: number; total: number }
completionStats(tasks: Task[], now: Date): { perDay: ...; perWeek: ...; rate: number }
```
