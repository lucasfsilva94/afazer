# Modelo de Dados

Banco IndexedDB `todo-app` (Dexie). Ids são strings UUID geradas no cliente. Datas de prazo são texto local; instantes (`createdAt`, `completedAt`, `at`) são milissegundos desde 1970.

## task (Tarefa)

| Campo | Tipo | Regra |
|---|---|---|
| `id` | string | chave primária |
| `title` | string | obrigatório; após `trim()` não pode ser vazio (FR-002) |
| `description` | string | opcional, padrão `""` |
| `done` | boolean | padrão `false` |
| `priority` | `"alta" \| "media" \| "baixa" \| null` | opcional; conjunto fechado (FR-011) |
| `dueDate` | `YYYY-MM-DD \| null` | opcional; passado é permitido |
| `dueTime` | `HH:mm \| null` | só vale se `dueDate` existir |
| `categoryId` | string \| null | no máximo uma categoria |
| `tagIds` | string[] | zero ou mais etiquetas |
| `projectId` | string \| null | no máximo um projeto |
| `recurrence` | Recurrence \| null | ver abaixo |
| `createdAt` | number | definido na criação |
| `completedAt` | number \| null | definido ao concluir, limpo ao reabrir |
| `updatedAt` | number | atualizado em toda escrita; base da detecção de conflito |

Índices: `dueDate`, `done`, `projectId`, `categoryId`, `*tagIds`, `completedAt`.

**Derivados, nunca gravados**: `overdue` = `!done` e prazo (data + horário, ou fim do dia sem horário) anterior ao momento atual. `progress` = subtarefas concluídas / total, ou vazio se não há subtarefas.

**Transições**: pendente → concluída grava `completedAt`; concluída → pendente limpa `completedAt`. Excluir apaga a tarefa, suas subtarefas e seus lembretes.

## subtask (Subtarefa)

| Campo | Tipo | Regra |
|---|---|---|
| `id` | string | chave primária |
| `taskId` | string | obrigatório; índice |
| `title` | string | obrigatório, não vazio após `trim()` |
| `done` | boolean | padrão `false` |
| `order` | number | posição dentro da tarefa |

Concluir todas as subtarefas não conclui a tarefa sozinho; a pessoa decide (US4, cenário 4).

## recurrence (embutida em task)

| Campo | Tipo | Regra |
|---|---|---|
| `freq` | `"diaria" \| "semanal" \| "mensal"` | conjunto fechado |
| `interval` | number | inteiro ≥ 1, padrão 1 |
| `until` | `YYYY-MM-DD \| null` | fim opcional |

Exige `dueDate` na tarefa. Ao concluir, a próxima data é `dueDate` somada de `interval` unidades de `freq`. Se passar de `until`, nenhuma ocorrência nova é criada. Mensal em dia 29 a 31 usa o último dia do mês quando o mês é mais curto. A nova ocorrência copia título, descrição, prioridade, grupos, subtarefas (reabertas) e recorrência, com `done = false`.

## reminder (Lembrete)

| Campo | Tipo | Regra |
|---|---|---|
| `id` | string | chave primária |
| `taskId` | string | índice |
| `at` | number | instante do aviso; índice |
| `firedAt` | number \| null | preenchido após o aviso; impede repetir |

Um lembrete exige prazo na tarefa. Pode ser definido como minutos antes do prazo, e `at` é calculado ao salvar e recalculado se o prazo mudar. Tarefas concluídas ou excluídas não disparam (FR-010).

## project, category, tag

Mesma forma para as três tabelas:

| Campo | Tipo | Regra |
|---|---|---|
| `id` | string | chave primária |
| `name` | string | obrigatório, único sem diferenciar maiúsculas dentro da tabela |
| `color` | string \| null | opcional |

Renomear atualiza o nome em um só lugar, pois as tarefas guardam só o id. Excluir remove o grupo e põe `null` (ou retira o id de `tagIds`) nas tarefas que o usavam; as tarefas permanecem (FR-014).

## activity (Registro de Atividade)

| Campo | Tipo | Regra |
|---|---|---|
| `id` | string | chave primária |
| `at` | number | índice; define a ordem do histórico |
| `type` | `"criada" \| "concluida" \| "reaberta" \| "editada" \| "excluida"` | conjunto fechado |
| `taskId` | string | referência, pode apontar para tarefa já excluída |
| `taskTitle` | string | cópia do título no momento do evento |

Gravado na mesma transação da mudança. Somente leitura para a pessoa; não há desfazer na v1.

## Preferências

Tema em `localStorage` sob a chave `theme`, com valor `"claro"` ou `"escuro"`. Ausente significa seguir o sistema.
