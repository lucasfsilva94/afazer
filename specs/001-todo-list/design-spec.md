# Especificação de Design: Afazer (To-Do List Pessoal)

Documento derivado do protótipo `index.html`, para servir de entrada ao Spec Kit. Cobre as histórias US1–US7 e os requisitos FR-001–FR-028 de `specs/001-todo-list/todo-list.spec.md`.

> **Pendência:** a imagem de referência visual citada na spec não chegou ao design. A direção abaixo foi assumida. Revisar tokens (seção 3) quando a imagem estiver disponível.

## 1. Direção e princípios

- **Caráter:** minimalismo neutro de produtividade, alto contraste, um único acento azul-petróleo.
- **Simplicidade (FR-028):** só o título é obrigatório. Campos avançados ficam atrás de "Mais opções".
- **Sem cor como único sinal:** prioridade e atraso sempre combinam texto + ícone/forma.
- **Local e sem contas:** toda a UI assume dados no dispositivo (IndexedDB na implementação; `localStorage` no protótipo).
- **Idioma:** português (pt-BR). Datas formatadas com `Intl` pt-BR.

## 2. Mapa de navegação

| Tela | Rota (plan.md) | Propósito | Histórias |
|---|---|---|---|
| Painel | `/` | Hoje, atrasadas, pendentes, progresso; captura rápida | US5, US1 |
| Tarefas | `/tarefas` | Lista completa com busca, filtros, ordenação | US1, US3, US6 |
| Calendário | `/calendario` | Grade mensal por prazo | US6 |
| Projetos | `/projetos` | Tarefas por projeto + gestão de projetos/categorias/etiquetas | US4, US3 |
| Histórico | `/historico` | Linha do tempo de atividades | US7 |
| Estatísticas | `/estatisticas` | Produtividade | US7 |

Overlays (não são rotas): diálogo de tarefa (criar/editar), confirmação, nome (criar/renomear grupo), menu "Mais" (mobile), toasts.

**Navegação por viewport**
- ≥ 900px: barra lateral fixa (248px) com as 6 telas, contador de pendentes em "Tarefas".
- < 900px: barra inferior com 5 itens (Painel, Tarefas, Calendário, Projetos, Mais). "Mais" abre folha com Histórico e Estatísticas.
- Cabeçalho (todas as telas): título da tela, alternador de tema, botão "Nova tarefa" (só ícone abaixo de 560px).

## 3. Design tokens

### Cor (claro / escuro, definidos separadamente)

| Token | Claro | Escuro |
|---|---|---|
| `--bg` | `#F3F6F6` | `#0D1413` |
| `--surface` | `#FFFFFF` | `#152120` |
| `--surface-2` | `#F7F9F9` | `#1A2928` |
| `--line` | `#DDE4E3` | `#27393A` |
| `--line-strong` (bordas de campo) | `#7F908C` (era `#9AA9A6`, 2,44:1; ajustado para ≥ 3:1) | `#6E8682` |
| `--text` | `#14201F` | `#E7EFED` |
| `--muted` | `#51615E` | `#9FB4AF` |
| `--accent` | `#0F766E` | `#3CC4B4` |
| `--accent-hover` | `#0B5F58` | `#5FD6C8` |
| `--accent-fg` | `#FFFFFF` | `#04201C` |
| `--accent-soft` / `--accent-text` | `#DDF1EE` / `#0B5F58` | `#163532` / `#74E0D2` |
| `--danger` / `--danger-soft` | `#B42318` / `#FDECEA` | `#FF8F80` / `#33191A` |
| `--warn-soft` / `--warn-text` | `#FFF0D6` / `#85470A` | `#3A2A12` / `#F5B96A` |

Cores de categoria (ponto ao lado do nome): `#2F6FDE #B4487A #7A5BD8 #C27A12 #0F8A5F #C0392B`. O nome sempre acompanha o ponto.

### Tipografia
- Corpo: `Segoe UI Variable Text`, `Segoe UI`, system-ui. Títulos: `Segoe UI Variable Display`, `Avenir Next`, `Trebuchet MS`.
- Escala: título de tela 24px; saudação 28px; seção 18px; corpo 16px; apoio/metadados 13–15px; numerais de estatística 28px.
- Linha: 1,5 no corpo, 1,25 em títulos.

### Espaçamento, raio, movimento
- Espaço: 4 / 8 / 12 / 16 / 24 / 32 / 48px.
- Raio: 6 (chips), 10 (controles), 14 (cartões, diálogos).
- Movimento: 150ms (hover/estado), 250ms (diálogo, toast, anel de progresso). `ease-out` na entrada. `prefers-reduced-motion` desliga animações.
- Alvos de toque ≥ 44×44px; foco visível com contorno de 2px no acento.

### Breakpoints
375 (base mobile) · 560 (rótulo do botão "Nova tarefa") · 640 (calendário com chips, diálogo vira janela central) · 768 · 900 (barra lateral) · 1100 (duas colunas em Painel, Calendário, Projetos) · 1440 (conteúdo limitado a 1200px).

## 4. Componentes

| Componente | Anatomia e estados |
|---|---|
| **Linha de tarefa** | Caixa de conclusão (44px de área, quadro 24px) · título (máx. 2 linhas) · descrição (máx. 2 linhas) · chips · editar · excluir. Estados: pendente, concluída (título riscado), atrasada (borda de perigo + chip "Atrasada · data"). |
| **Chips de metadados** | Prazo (relógio), prioridade (barras 1–3 + texto), categoria (ponto + nome), projeto, etiquetas, progresso de subtarefas (n/m + barra), recorrência, lembrete. |
| **Prioridade** | Alta (3 barras, tom de perigo), Média (2 barras, tom de aviso), Baixa (1 barra, tom do acento), Sem prioridade (não exibe). |
| **Captura rápida** | Campo + botão "Adicionar" no Painel. Enter também envia. Erro inline com `role="alert"` se vazio. |
| **Diálogo de tarefa** | Sempre visível: título*, prazo, horário, prioridade. Em "Mais opções": descrição, lembrete, categoria, projeto, etiquetas (seleção múltipla), repetir (+ "até"), subtarefas com barra de progresso. Rodapé: Excluir (só na edição) · Cancelar · Salvar. No mobile vira folha inferior. |
| **Confirmação** | Título + mensagem + Cancelar / Excluir (botão de perigo). Foco inicial em Cancelar. |
| **Diálogo de nome** | Campo + validação de vazio e de nome duplicado. |
| **Filtros** | Busca sempre visível; "Filtros e ordenação" recolhível (aberto por padrão em telas largas). |
| **Anel de progresso** | SVG 120px, % no centro, texto de apoio ("3 de 5 tarefas de hoje concluídas"). |
| **Célula de calendário** | Número do dia, até 2 chips + "+N mais" (≥ 640px) ou contador (< 640px). Hoje = número preenchido; selecionado = contorno. |
| **Gráfico de barras** | SVG com grade, eixo Y, valor sobre a barra, rótulos X, título e `aria-label`. |
| **Toast** | Sucesso some em 5s. Lembrete fica até ser dispensado, com ação "Abrir". Região `aria-live`. |
| **Estado vazio** | Ícone + título + explicação + ação seguinte. Nunca tela em branco. |

## 5. Telas

### 5.1 Painel
Ordem: saudação + data → captura rápida → **Atrasadas** (só se houver) → **Hoje** → **Pendentes** (6 primeiras + link "Ver todas"). Coluna lateral (≥ 1100px, senão logo após): anel de progresso do dia e três contadores (Para hoje, Pendentes, Atrasadas).
Vazios: "Nada para hoje", "Tudo certo por hoje", "Sem pendências".
Regra: progresso = concluídas com prazo hoje ÷ tarefas com prazo hoje.

### 5.2 Tarefas
Busca (título + descrição) · filtros: estado, prazo (hoje, 7 dias, atrasadas, sem prazo), prioridade, categoria, etiqueta · ordenação: prazo, prioridade, mais recentes · linha de resultado ("N tarefas encontradas" + "Limpar filtros") · lista com paginação "Mostrar mais" a cada 50. Concluídas vão ao fim da lista.
Vazios distintos: lista vazia (CTA "Nova tarefa") e busca sem resultado (CTA "Limpar filtros").

### 5.3 Calendário
Cabeçalho com mês, anterior / Hoje / próximo. Grade 7×6 começando no domingo. Painel do dia selecionado com a lista e "Adicionar neste dia" (abre o diálogo com o prazo preenchido).

### 5.4 Projetos
Grupos por projeto com barra de progresso e "concluídas/total", mais "Sem projeto". Painel "Organizar": projetos, categorias e etiquetas com contagem de uso, renomear, excluir e criar.

### 5.5 Histórico
Agrupado por dia (Hoje, Ontem, data). Cada evento: ícone, tipo (Criada, Concluída, Reaberta, Editada, Excluída), título da tarefa e hora. "Mostrar mais" a cada 60 eventos.

### 5.6 Estatísticas
Três indicadores (concluídas em 7 dias, taxa de conclusão com "x de y", média diária em 14 dias) + gráfico alternável **Dia** (14 dias) / **Semana** (8 semanas). Sem dados: estado vazio honesto, sem barras nem percentuais inventados.

## 6. Fluxos principais

1. **Capturar:** digitar título → Enter ou "Adicionar" → tarefa no topo do Painel + toast. Título vazio → erro ao lado do campo.
2. **Editar:** clicar no título ou no lápis → diálogo → Salvar (evento "Editada").
3. **Concluir / reabrir:** caixa de conclusão alterna. O foco volta ao mesmo controle após atualizar a lista.
4. **Excluir:** lixeira → confirmação (menciona subtarefas) → remoção definitiva; histórico mantém o título.
5. **Agendar:** prazo (+ horário opcional) → lembrete (no horário, 15 min, 1 h, 1 dia antes). Lembrete sem prazo → erro no campo.
6. **Recorrer:** escolher frequência (diária, semanal, mensal) e fim opcional; exige prazo. Ao concluir, cria a próxima ocorrência uma única vez, salvo se passou da data final (avisa "Recorrência encerrada"). Se o próximo prazo já passou, avança para a próxima data futura.
7. **Organizar:** criar/renomear/excluir grupos em Projetos. Excluir grupo em uso avisa quantas tarefas serão desassociadas (não apagadas).
8. **Encontrar:** busca e filtros combinam com E lógico; "Limpar filtros" restaura tudo.
9. **Tema:** botão no cabeçalho alterna claro/escuro e persiste.

## 7. Regras de domínio refletidas na UI

- **Atrasada** é derivada: pendente com prazo anterior a agora. Sem horário, vale até 23:59 do dia.
- **Lembrete** usa 09:00 quando não há horário; não dispara para tarefas concluídas ou excluídas; dispara uma vez (`firedAt`). Verificação a cada 15s (SC-005: até 1 min).
- **Subtarefas:** o progresso da tarefa mostra n/m; concluir a tarefa não depende delas.
- **Rótulos de prazo:** Hoje / Amanhã / Ontem / "5 nov", com horário quando existe.

## 8. Acessibilidade

- Contraste de texto ≥ 4,5:1 nos dois temas (verificado por escolha de cores, não por ferramenta).
- Controles com nome acessível (ex.: "Concluir: título"), `aria-pressed` nas caixas, `aria-current="page"` na navegação.
- Erros com `role="alert"` junto ao campo; rótulos sempre visíveis nos formulários.
- Diálogos nativos `<dialog>`; foco inicial coerente e retorno ao controle de origem (ou ao botão "Nova tarefa").
- Nenhuma informação só por cor. Suporta `prefers-reduced-motion`.

## 9. Dados de exemplo (protótipo)

16 tarefas ativas + 12 concluídas em dias passados (alimentam estatísticas e histórico), 4 categorias (Trabalho, Pessoal, Estudos, Casa), 5 etiquetas, 3 projetos, uma tarefa com lembrete em poucos minutos, uma recorrente de cada frequência.

## 10. Rastreabilidade

| Requisito | Onde aparece |
|---|---|
| FR-001/002/028 | Captura rápida, diálogo (título obrigatório) |
| FR-003/004/005 | Linha de tarefa, diálogo, confirmação |
| FR-006 | Persistência local |
| FR-007/008 | Chips de prazo e "Atrasada" |
| FR-009/010 | Lembrete no diálogo, toast, regra de não disparo |
| FR-011/012/013/014 | Prioridade, categorias, etiquetas, painel Organizar, aviso de desassociação |
| FR-015/016/017 | Subtarefas, Projetos, recorrência |
| FR-018/019 | Painel e anel de progresso |
| FR-020/021/022 | Busca, filtros, Calendário |
| FR-023/024/025 | Histórico, Estatísticas, tema |
| FR-026/027 | Estados vazios, paginação em lotes |

## 11. Decisões das pendências (resolvidas na implementação)

- **Imagem de referência:** `protoipo.png` é a captura do Painel de `prototipo.html` (mesmos tokens, barra lateral, chips e anel). Fica confirmada como a referência visual. Divergência encontrada na comparação: o contraste da borda de campo no tema claro (ver seção 3, `--line-strong`), corrigido para ≥ 3:1.
- **Edição em duas abas:** o formulário guarda o `updatedAt` carregado e `updateTask` lança `StaleEditError` se o banco mudou. O diálogo mostra a mensagem no rodapé do formulário e não sobrescreve. Não há tela de comparação nem mesclagem.
- **Desfazer exclusão:** fora da v1. A exclusão pede confirmação e é definitiva; o histórico guarda o título.
- **Fora da v1:** notificações do sistema operacional e sincronização.
- **Virtualização:** não adotada. "Mostrar mais" a cada 50 tarefas (60 eventos) mantém 500 tarefas dentro do orçamento medido em `tests/perf/large-list.test.ts`.
