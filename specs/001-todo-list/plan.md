# Plano de Implementação: Aplicativo de To-Do List Pessoal

**Spec**: `specs/001-todo-list/todo-list.spec.md` | **Tamanho**: oversized

**Nota de escala**: o projeto está vazio, então o plano cria o app inteiro: cerca de 36 arquivos em cinco áreas (banco, regras de domínio, telas, lembretes, tema). Observe a ordem das histórias: US1 sozinha já entrega um app útil, e cada história seguinte só acrescenta campos e telas por cima do mesmo banco.

## Resumo

Um app web de página única, local e sem backend, para uma pessoa organizar tarefas: criar, agendar, classificar, agrupar, acompanhar e concluir. Usa Vite, React e TypeScript, com IndexedDB via Dexie como única fonte de dados. As telas leem o banco por consultas reativas, e as regras (recorrência, atraso, progresso, estatísticas) ficam em funções puras testáveis fora da interface. Lembretes são avisos dentro do app, verificados por um agendador leve.

## Constitution Check

`.specify/memory/constitution.md` ainda é o modelo em branco, sem princípios ratificados. Não há portão a violar. Como substituto, o plano é checado contra as restrições da própria spec.

| Princípio (da spec) | Avaliação |
|---|---|
| Simplicidade e facilidade de uso (FR-028) | PASS. Só o título é obrigatório; sem estado global extra, sem backend |
| Uso pessoal, dados locais, sem contas | PASS. Tudo em IndexedDB, nenhuma chamada de rede |
| Nenhuma perda de dados (FR-006, SC-002) | PASS. Gravação transacional antes de atualizar a tela |
| Desempenho com 500 tarefas (SC-004, SC-008) | PASS. Índices no banco, filtro em memória; ponto de revisão registrado em `research.md` |

Recomenda-se rodar `speckit-constitution` antes de implementar, para a constituição valer nas próximas features.

## Estrutura do Projeto

```text
index.html                     # script inline de tema
package.json, vite.config.ts, tsconfig.json
src/
  main.tsx, App.tsx, routes.tsx
  db/
    schema.ts                  # tabelas e índices Dexie
    repo.ts                    # tarefas, subtarefas, grupos, atividade
  domain/                      # funções puras
    recurrence.ts              # próxima ocorrência
    status.ts                  # atraso, progresso de subtarefas
    filters.ts                 # busca e filtros combinados
    stats.ts                   # estatísticas e progresso do dia
  features/
    tasks/                     # lista, captura rápida, formulário, linha
    dashboard/                 # painel
    calendar/                  # calendário mensal
    projects/                  # projetos, categorias, etiquetas
    history/                   # histórico de atividades
    stats/                     # estatísticas
    reminders/                 # agendador e toasts
  ui/                          # botão, modal de confirmação, estado vazio, toast
  theme/theme.ts, theme.css
tests/
  domain/                      # recurrence, status, filters, stats
  features/                    # fluxos das histórias com fake-indexeddb
```

**Decisão de estrutura**: um único pacote de front-end, organizado por funcionalidade, com regras puras em `domain/` separadas da interface e do banco.

## Fluxo de chamadas

Toda escrita passa por `repo.ts`, que grava a mudança e o registro de atividade na mesma transação. A interface nunca escreve direto no banco.

1. Captura rápida em `features/tasks` chama `repo.createTask(title)`. O repositório valida o título (FR-002), grava a tarefa e a atividade `criada`.
2. Concluir chama `repo.setDone(id, done)`. Se a tarefa tem recorrência e vigora, o repositório chama `domain/recurrence.nextOccurrence` e cria a próxima ocorrência na mesma transação (FR-017). Marca lembretes pendentes como encerrados (FR-010).
3. Excluir chama `repo.deleteTask(id)` depois da confirmação. Remove subtarefas e lembretes junto (FR-005).
4. Excluir categoria, etiqueta ou projeto chama `repo.deleteGroup(kind, id)`, que desassocia as tarefas e devolve a contagem afetada para o aviso (FR-014).
5. As telas assinam consultas com `useLiveQuery`. Painel, calendário e estatísticas chamam funções de `domain/` sobre o resultado.
6. O agendador em `features/reminders` consulta lembretes vencidos de tarefas pendentes, mostra o toast e grava `firedAt`.

## Ciclo de vida da tarefa

- **Pendente**: estado inicial. Sai para Concluída ao marcar, ou para Excluída.
- **Atrasada**: não é um estado gravado. É derivada: pendente com prazo anterior ao momento atual (FR-008).
- **Concluída**: guarda `completedAt`. Desmarcar volta a Pendente e limpa `completedAt`. Se tinha recorrência, a próxima ocorrência já criada permanece.
- **Excluída**: remoção definitiva, depois de confirmar. O histórico guarda o título para continuar legível.

## Telas

| Tela | Rota | Conteúdo |
|---|---|---|
| Painel | `/` | hoje, pendências, atrasadas, progresso do dia; captura rápida no topo |
| Tarefas | `/tarefas` | lista com busca, filtros e ordenação por prioridade |
| Calendário | `/calendario` | grade mensal por prazo, navegação entre meses |
| Projetos | `/projetos` | tarefas agrupadas por projeto; gestão de categorias e etiquetas |
| Histórico | `/historico` | eventos em ordem cronológica |
| Estatísticas | `/estatisticas` | concluídas por dia e semana, taxa de conclusão |

O tema alterna por um botão no cabeçalho, em todas as telas. Toda lista tem estado vazio explicativo (FR-026).

## Design e interface

Fonte: `specs/001-todo-list/design-spec.md` (derivado do protótipo `prototipo.html`). O plano adota o design como contrato de UI; divergências devem ser resolvidas no design-spec, não aqui.

- **Tokens**: cores claro/escuro, tipografia, espaçamento, raio e movimento vão para `theme/theme.css` como variáveis CSS (`--bg`, `--surface`, `--accent` etc.), conforme a seção 3 do design-spec. Acento único azul-petróleo.
- **Navegação**: barra lateral fixa de 248px a partir de 900px; abaixo disso, barra inferior com 5 itens e folha "Mais" (Histórico, Estatísticas). Breakpoints: 375, 560, 640, 768, 900, 1100, 1440 (conteúdo limitado a 1200px).
- **Componentes em `ui/`**: linha de tarefa, chips de metadados e prioridade, diálogo de tarefa (folha inferior no mobile), confirmação, diálogo de nome, anel de progresso, gráfico de barras em SVG, toast com `aria-live`, estado vazio. Diálogos usam `<dialog>` nativo.
- **Simplicidade (FR-028)**: no diálogo, só título, prazo, horário e prioridade ficam visíveis; o resto fica em "Mais opções".
- **Paginação em lotes (FR-027)**: "Mostrar mais" a cada 50 tarefas e 60 eventos de histórico.
- **Lembretes**: verificação a cada 15s (SC-005); sem horário, vale 09:00.
- **Acessibilidade**: contraste ≥ 4,5:1, alvos ≥ 44px, foco visível de 2px, nenhuma informação só por cor, `prefers-reduced-motion`.
- **Pendências do design**: imagem de referência visual (confirmar se `protoipo.png` é ela e revisar os tokens), alerta de edição em duas abas e desfazer exclusão, não desenhados.

## Ordem de entrega por história

1. **US1**: banco, repositório, captura, edição, concluir, excluir, lista, estados vazios.
2. **US2**: prazo, horário, atraso, lembretes e agendador.
3. **US3**: prioridade, categorias, etiquetas, ordenação.
4. **US4**: subtarefas, projetos, recorrência.
5. **US5**: painel.
6. **US6**: busca, filtros, calendário.
7. **US7**: histórico, estatísticas, tema.

O registro de atividade é gravado desde a US1 para o histórico da US7 já ter dados.

## Fora do plano

Sincronização, contas, notificações do sistema e recorrência complexa, como a spec define.
