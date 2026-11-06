# Feature Specification: Aplicativo de To-Do List Pessoal

**Feature Branch**: `001-todo-list`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Crie um aplicativo de To-Do List moderno e intuitivo para organização pessoal. Permita criar, editar, excluir e concluir tarefas, definir prazos, horários, prioridades, categorias, etiquetas e lembretes. Inclua subtarefas, tarefas recorrentes, projetos, calendário, filtros e pesquisa. Crie um painel com tarefas do dia, pendências, atrasos e progresso. Disponibilize histórico de atividades, estatísticas de produtividade e modos claro e escuro. Priorize simplicidade e facilidade de uso."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capturar e concluir tarefas (Priority: P1)

A pessoa abre o aplicativo, anota rapidamente uma tarefa, volta a ela mais tarde para ajustar o texto e, ao terminar, marca a tarefa como concluída. Quando algo deixa de ser necessário, ela exclui a tarefa. É o ciclo essencial de uma lista de afazeres.

**Why this priority**: É o núcleo do produto. Sem criar, editar, concluir e excluir tarefas não existe lista de afazeres. Entregue sozinha, esta história já é um aplicativo útil.

**Independent Test**: Criar uma tarefa, editar seu título, marcá-la como concluída e depois excluí-la, confirmando que cada mudança fica visível e persiste após recarregar o aplicativo.

**Acceptance Scenarios**:

1. **Given** a lista está vazia, **When** a pessoa digita um título e confirma, **Then** a tarefa aparece no topo da lista como não concluída.
2. **Given** uma tarefa existente, **When** a pessoa edita o título e salva, **Then** o novo título é exibido e mantido após recarregar.
3. **Given** uma tarefa não concluída, **When** a pessoa a marca como concluída, **Then** ela é exibida como concluída e sai da lista de pendentes sem ser apagada.
4. **Given** uma tarefa qualquer, **When** a pessoa a exclui e confirma, **Then** a tarefa some da lista e não reaparece após recarregar.

---

### User Story 2 - Agendar tarefas com prazo, horário e lembrete (Priority: P2)

A pessoa define quando cada tarefa precisa acontecer: uma data de prazo, opcionalmente um horário, e um lembrete para ser avisada antes. Assim ela para de depender da memória para não perder compromissos.

**Why this priority**: Transforma uma lista simples em uma ferramenta de compromisso com o tempo. Depende da US1, mas agrega o valor que faz a pessoa confiar no aplicativo.

**Independent Test**: Definir prazo e horário em uma tarefa, configurar um lembrete e verificar que a tarefa exibe seu prazo e que o lembrete é disparado no momento esperado.

**Acceptance Scenarios**:

1. **Given** uma tarefa sem prazo, **When** a pessoa define uma data (e opcionalmente um horário), **Then** a tarefa passa a exibir esse prazo.
2. **Given** uma tarefa com prazo no passado e não concluída, **When** a pessoa abre o aplicativo, **Then** a tarefa é sinalizada visualmente como atrasada.
3. **Given** uma tarefa com lembrete configurado, **When** chega o momento do lembrete, **Then** a pessoa recebe um aviso referente àquela tarefa.
4. **Given** uma tarefa com lembrete, **When** a pessoa remove o lembrete, **Then** nenhum aviso é disparado para ela.

---

### User Story 3 - Priorizar e classificar tarefas (Priority: P2)

A pessoa marca o que é mais importante com um nível de prioridade e agrupa tarefas por categoria e etiquetas, para enxergar com clareza onde focar e para separar contextos (trabalho, casa, estudos).

**Why this priority**: Organização é o motivo pelo qual as pessoas adotam um gerenciador de tarefas em vez de um papel. Importa logo após capturar e agendar.

**Independent Test**: Atribuir prioridade, uma categoria e etiquetas a tarefas diferentes e confirmar que é possível distinguir e ordenar as tarefas por esses atributos.

**Acceptance Scenarios**:

1. **Given** uma tarefa, **When** a pessoa define uma prioridade (por exemplo alta, média, baixa), **Then** a tarefa exibe essa prioridade e pode ser ordenada por ela.
2. **Given** uma tarefa, **When** a pessoa atribui uma categoria, **Then** a tarefa aparece associada a essa categoria.
3. **Given** uma tarefa, **When** a pessoa adiciona uma ou mais etiquetas, **Then** cada etiqueta fica visível e pode ser usada para agrupar tarefas.
4. **Given** um conjunto de tarefas com prioridades diferentes, **When** a pessoa ordena por prioridade, **Then** as mais importantes aparecem primeiro.

---

### User Story 4 - Estruturar trabalho com subtarefas, projetos e recorrência (Priority: P3)

A pessoa quebra tarefas grandes em subtarefas, agrupa tarefas relacionadas dentro de um projeto, e define tarefas que se repetem (diária, semanal, mensal) sem precisar recriá-las toda vez.

**Why this priority**: Atende quem usa o aplicativo para trabalhos maiores e rotinas. É valioso, mas o produto já é útil sem isso, então vem depois do básico de organização.

**Independent Test**: Criar um projeto com algumas tarefas, adicionar subtarefas a uma delas, criar uma tarefa recorrente e confirmar que, ao concluir uma ocorrência, a próxima é gerada conforme a regra.

**Acceptance Scenarios**:

1. **Given** uma tarefa, **When** a pessoa adiciona subtarefas, **Then** o progresso da tarefa reflete quantas subtarefas estão concluídas.
2. **Given** um projeto, **When** a pessoa associa tarefas a ele, **Then** as tarefas aparecem agrupadas sob esse projeto.
3. **Given** uma tarefa recorrente, **When** a pessoa conclui a ocorrência atual, **Then** uma nova ocorrência é criada automaticamente na próxima data da regra.
4. **Given** uma tarefa com subtarefas pendentes, **When** todas as subtarefas são concluídas, **Then** a tarefa pode ser concluída e, se já estava marcada, permanece coerente.

---

### User Story 5 - Painel com a visão do dia (Priority: P3)

Ao abrir o aplicativo, a pessoa vê de imediato um painel com as tarefas de hoje, o que está pendente, o que está atrasado e uma noção do seu progresso. É o ponto de partida para decidir o que fazer agora.

**Why this priority**: Dá foco e reduz a sobrecarga de ver a lista inteira. Depende de prazos (US2) para separar hoje/atrasado, por isso vem depois.

**Independent Test**: Com tarefas em estados variados (hoje, futuras, atrasadas, concluídas), abrir o painel e confirmar que cada grupo mostra exatamente as tarefas certas e que o progresso do dia é calculado corretamente.

**Acceptance Scenarios**:

1. **Given** tarefas com prazos variados, **When** a pessoa abre o painel, **Then** ela vê seções distintas para tarefas de hoje, pendentes e atrasadas.
2. **Given** tarefas de hoje parcialmente concluídas, **When** a pessoa marca mais uma como concluída, **Then** o indicador de progresso do dia é atualizado em tempo real.
3. **Given** nenhuma tarefa para hoje, **When** a pessoa abre o painel, **Then** uma mensagem clara de "nada para hoje" é exibida em vez de uma área vazia.

---

### User Story 6 - Encontrar tarefas por pesquisa, filtros e calendário (Priority: P3)

A pessoa localiza rapidamente uma tarefa digitando parte do texto, estreita a lista com filtros (por categoria, etiqueta, prioridade, estado ou prazo) e visualiza suas tarefas distribuídas em um calendário.

**Why this priority**: À medida que a lista cresce, encontrar e visualizar no tempo vira necessidade. Depende dos atributos criados nas histórias anteriores.

**Independent Test**: Com dezenas de tarefas, pesquisar por um termo, aplicar um filtro combinado e abrir a visão de calendário, confirmando que cada mecanismo mostra apenas as tarefas correspondentes.

**Acceptance Scenarios**:

1. **Given** várias tarefas, **When** a pessoa digita um termo na pesquisa, **Then** apenas as tarefas cujo título ou descrição contêm o termo são exibidas.
2. **Given** várias tarefas, **When** a pessoa aplica filtros combinados (por exemplo categoria + prioridade), **Then** somente as tarefas que satisfazem todos os filtros permanecem visíveis.
3. **Given** tarefas com prazos, **When** a pessoa abre o calendário, **Then** cada tarefa aparece no dia do seu prazo e é possível navegar entre meses.
4. **Given** um filtro aplicado, **When** a pessoa limpa os filtros, **Then** a lista completa volta a ser exibida.

---

### User Story 7 - Acompanhar produtividade e personalizar a aparência (Priority: P4)

A pessoa consulta um histórico das suas atividades (o que criou, concluiu e alterou) e vê estatísticas de produtividade (tarefas concluídas por período, taxa de conclusão). Também alterna entre modo claro e escuro conforme o ambiente e a preferência.

**Why this priority**: São aprimoramentos de engajamento e conforto. Agradam e fidelizam, mas não são essenciais para gerenciar tarefas.

**Independent Test**: Concluir algumas tarefas ao longo de datas diferentes, abrir as estatísticas e o histórico para conferir os números, e alternar o tema confirmando que a escolha persiste entre sessões.

**Acceptance Scenarios**:

1. **Given** tarefas criadas e concluídas, **When** a pessoa abre o histórico de atividades, **Then** ela vê os eventos em ordem cronológica com data e tipo de ação.
2. **Given** tarefas concluídas em dias diferentes, **When** a pessoa abre as estatísticas, **Then** vê indicadores de produtividade (como concluídas por dia/semana e taxa de conclusão).
3. **Given** o aplicativo no modo claro, **When** a pessoa alterna para o modo escuro, **Then** a interface muda de tema imediatamente e a preferência é mantida na próxima abertura.

---

### Edge Cases

- Criação de tarefa com título vazio ou só com espaços: deve ser impedida com aviso claro.
- Prazo definido para uma data/horário no passado: permitido, mas a tarefa é tratada como atrasada.
- Exclusão de uma categoria, etiqueta ou projeto que ainda tem tarefas associadas: o sistema precisa decidir o destino das tarefas (desassociar, não apagá-las) e avisar a pessoa.
- Exclusão de uma tarefa que tem subtarefas: as subtarefas são removidas junto, com confirmação.
- Conclusão da ocorrência de uma tarefa recorrente sem data final definida versus com fim de recorrência: a próxima ocorrência só é gerada enquanto a regra ainda vigora.
- Lembrete configurado para uma tarefa já concluída ou excluída: não deve disparar.
- Pesquisa ou filtro que não retorna nenhum resultado: mostrar estado vazio explicativo, não uma tela em branco.
- Grande volume de tarefas (centenas): a lista, a pesquisa e o calendário devem continuar responsivos.
- Fechar e reabrir o aplicativo, ou perder conexão: os dados já inseridos não podem ser perdidos.
- Dois dispositivos ou abas alterando a mesma tarefa (quando aplicável): evitar que uma edição sobrescreva silenciosamente a outra sem aviso.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir criar uma tarefa informando ao menos um título.
- **FR-002**: O sistema MUST impedir a criação de tarefa sem título válido (vazio ou apenas espaços), exibindo mensagem de erro.
- **FR-003**: O sistema MUST permitir editar o título e a descrição de uma tarefa existente.
- **FR-004**: O sistema MUST permitir marcar e desmarcar uma tarefa como concluída, preservando a tarefa em ambos os estados.
- **FR-005**: O sistema MUST permitir excluir uma tarefa, solicitando confirmação antes de remover.
- **FR-006**: O sistema MUST persistir todas as tarefas e seus atributos entre sessões, sem perda de dados ao recarregar ou reabrir.
- **FR-007**: Usuários MUST poder definir um prazo (data) e, opcionalmente, um horário para uma tarefa.
- **FR-008**: O sistema MUST sinalizar visualmente tarefas não concluídas cujo prazo já passou como atrasadas.
- **FR-009**: Usuários MUST poder configurar lembretes para uma tarefa e receber um aviso no momento definido.
- **FR-010**: O sistema MUST NOT disparar lembretes de tarefas já concluídas ou excluídas.
- **FR-011**: Usuários MUST poder atribuir a uma tarefa um nível de prioridade entre opções pré-definidas.
- **FR-012**: Usuários MUST poder organizar tarefas em categorias e aplicar uma ou mais etiquetas a cada tarefa.
- **FR-013**: Usuários MUST poder criar, renomear e excluir categorias, etiquetas e projetos.
- **FR-014**: Ao excluir uma categoria, etiqueta ou projeto em uso, o sistema MUST preservar as tarefas associadas, apenas desassociando-as, e informar a pessoa.
- **FR-015**: Usuários MUST poder adicionar subtarefas a uma tarefa, e o sistema MUST refletir o progresso com base nas subtarefas concluídas.
- **FR-016**: Usuários MUST poder agrupar tarefas em projetos e visualizá-las agrupadas por projeto.
- **FR-017**: Usuários MUST poder definir tarefas recorrentes (por exemplo diária, semanal, mensal), e o sistema MUST gerar a próxima ocorrência ao concluir a atual, enquanto a regra vigorar.
- **FR-018**: O sistema MUST apresentar um painel inicial com, no mínimo, tarefas de hoje, pendências, tarefas atrasadas e um indicador de progresso.
- **FR-019**: O sistema MUST atualizar o indicador de progresso do painel conforme tarefas são concluídas ou reabertas.
- **FR-020**: Usuários MUST poder pesquisar tarefas por texto do título e da descrição.
- **FR-021**: Usuários MUST poder filtrar tarefas por categoria, etiqueta, prioridade, estado (concluída/pendente) e prazo, inclusive de forma combinada, e limpar os filtros.
- **FR-022**: O sistema MUST oferecer uma visão de calendário posicionando as tarefas na data do seu prazo, com navegação entre períodos.
- **FR-023**: O sistema MUST registrar um histórico de atividades (criação, conclusão, edição e exclusão de tarefas) consultável em ordem cronológica.
- **FR-024**: O sistema MUST apresentar estatísticas de produtividade, como tarefas concluídas por período e taxa de conclusão.
- **FR-025**: O sistema MUST oferecer modos de exibição claro e escuro e MUST preservar a preferência de tema entre sessões.
- **FR-026**: O sistema MUST apresentar estados vazios explicativos quando uma lista, pesquisa ou filtro não tiver resultados.
- **FR-027**: O sistema MUST manter-se responsivo e utilizável com centenas de tarefas cadastradas.
- **FR-028**: O sistema MUST priorizar simplicidade, permitindo que a pessoa capture uma tarefa em poucos passos sem preencher campos obrigatórios além do título.

### Key Entities *(include if feature involves data)*

- **Tarefa**: unidade central de trabalho. Atributos: título, descrição, estado (pendente/concluída), prioridade, prazo (data e horário opcional), lembrete, data de criação e de conclusão. Relaciona-se com categoria, etiquetas, projeto, subtarefas e regra de recorrência.
- **Subtarefa**: item menor pertencente a uma tarefa; tem título e estado próprios e contribui para o progresso da tarefa pai.
- **Projeto**: agrupamento nomeado de tarefas relacionadas.
- **Categoria**: classificação única de uma tarefa (por exemplo trabalho, pessoal, estudos).
- **Etiqueta**: marcador reutilizável; uma tarefa pode ter várias etiquetas.
- **Lembrete**: aviso associado a uma tarefa em um momento definido.
- **Regra de Recorrência**: padrão de repetição de uma tarefa (frequência, intervalo e término opcional).
- **Registro de Atividade**: evento histórico com data, tipo de ação e referência à tarefa afetada.
- **Preferência do Usuário**: escolhas pessoais que persistem, como o tema (claro/escuro).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A pessoa consegue criar uma nova tarefa em até 3 ações (abrir entrada, digitar título, confirmar) e em menos de 10 segundos.
- **SC-002**: 100% das tarefas e atributos criados permanecem íntegros após fechar e reabrir o aplicativo.
- **SC-003**: A partir da tela inicial, a pessoa identifica o que precisa ser feito hoje em até 5 segundos, sem aplicar filtros.
- **SC-004**: Pesquisa e filtros retornam resultados em até 1 segundo para uma base de 500 tarefas.
- **SC-005**: Lembretes são disparados dentro de 1 minuto em relação ao horário configurado.
- **SC-006**: Em teste de usabilidade, pelo menos 90% das pessoas concluem as tarefas essenciais (criar, agendar, concluir, encontrar) na primeira tentativa, sem ajuda.
- **SC-007**: A troca entre modo claro e escuro ocorre imediatamente e a preferência é respeitada em 100% das reaberturas.
- **SC-008**: A lista continua rolando de forma fluida (sem travamentos perceptíveis) com pelo menos 500 tarefas cadastradas.

## Assumptions

- O aplicativo é de uso pessoal e de um único usuário por instalação; não há contas, login nem compartilhamento entre pessoas na primeira versão.
- Os dados são armazenados localmente no dispositivo da pessoa, com persistência confiável; sincronização entre dispositivos está fora do escopo da v1.
- A interface é em português e segue a referência visual anexada à solicitação (imagem de design), priorizando clareza e simplicidade.
- Os lembretes são entregues enquanto o aplicativo está acessível à pessoa (aviso dentro do aplicativo); notificações push do sistema operacional podem ser consideradas em versões futuras.
- Os níveis de prioridade são um conjunto pequeno e pré-definido (por exemplo alta, média, baixa), não valores numéricos livres.
- A recorrência cobre padrões comuns (diário, semanal, mensal); padrões altamente complexos (por exemplo "a cada segunda terça-feira") ficam fora do escopo da v1.
- "Progresso" no painel refere-se à proporção de tarefas concluídas sobre as previstas no período exibido.
- O histórico de atividades é informativo; não há exigência de desfazer ações a partir dele na v1.
