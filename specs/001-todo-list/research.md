# Pesquisa: Aplicativo de To-Do List Pessoal

O repositório não tem código ainda. Todas as escolhas abaixo partem das restrições da spec: uso pessoal, um usuário, dados locais, simplicidade, 500+ tarefas fluidas, lembretes em 1 minuto.

## Plataforma e stack

**Decisão**: SPA no navegador com Vite, React 18 e TypeScript. Sem backend.
**Justificativa**: dados locais e sem contas dispensam servidor. A spec fala em "recarregar", "abas" e interface em português, o que descreve um app web. Vite dá build e testes rápidos com pouca configuração.
**Alternativas**: app desktop (Electron/Tauri) pesa mais e só traria notificações do sistema, que estão fora da v1. App móvel nativo exige toolchain que a spec não pede.

## Persistência

**Decisão**: IndexedDB acessado via Dexie.
**Justificativa**: o histórico de atividades cresce sem limite, e a consulta por prazo, estado e projeto precisa de índices para ficar abaixo de 1 s com 500 tarefas (SC-004). Dexie `liveQuery` atualiza a interface sozinho, inclusive entre abas do mesmo navegador, o que cobre o caso de duas abas editando a mesma tarefa.
**Alternativas**: `localStorage` tem limite de cerca de 5 MB, é síncrono e não tem índices. SQLite em WASM é exagero para este volume.

## Estado da interface

**Decisão**: sem biblioteca de estado global. Os dados vêm de `useLiveQuery`; o estado de UI (filtros, busca, modal aberto) fica em `useState` e na URL.
**Justificativa**: o banco já é a fonte única da verdade. Uma segunda cópia em Redux/Zustand criaria o risco de divergir.
**Alternativas**: Redux Toolkit e Zustand foram descartados por duplicarem o que o Dexie já entrega.

## Navegação

**Decisão**: React Router com `HashRouter`.
**Justificativa**: funciona em qualquer hospedagem estática e até abrindo o `index.html` publicado, sem regra de reescrita no servidor.
**Alternativas**: `BrowserRouter` exige configuração de servidor para rotas profundas.

## Datas e recorrência

**Decisão**: `date-fns` com datas guardadas como texto local: `dueDate` em `YYYY-MM-DD` e `dueTime` em `HH:mm` opcional. A recorrência (diária, semanal, mensal, com intervalo e fim opcional) é uma função pura própria de cerca de 30 linhas.
**Justificativa**: prazo é um dia no calendário da pessoa, não um instante. Guardar texto local evita deslocamento por fuso e horário de verão. A recorrência pedida é simples demais para justificar uma biblioteca de RRULE.
**Alternativas**: timestamps UTC deslocam o dia em viagens e mudanças de horário. `rrule` cobre padrões que a spec exclui da v1.

## Lembretes

**Decisão**: aviso dentro do app. Um agendador verifica a cada 15 s e ao voltar o foco para a aba, e dispara um toast para lembretes vencidos ainda não avisados. Cada lembrete guarda `firedAt` para não repetir.
**Justificativa**: a spec define entrega dentro do app e tolerância de 1 minuto (SC-005). Verificar ao ganhar foco cobre abas em segundo plano, onde navegadores atrasam timers. Tarefas concluídas ou excluídas são ignoradas na verificação (FR-010).
**Alternativas**: Notification API e Service Worker ficam para versão futura, conforme a spec.

## Desempenho com centenas de tarefas

**Decisão**: lista simples, filtro e busca em memória sobre o resultado já carregado, linhas com `React.memo`. Sem virtualização na v1.
**Justificativa**: 500 linhas simples renderizam bem. Filtrar 500 objetos em memória leva milissegundos. Virtualização adiciona complexidade e quebra acessibilidade e busca nativa do navegador.
**Quando mudar**: se a medição passar de 16 ms por quadro ao rolar, adotar `react-window` apenas na lista principal.

## Tema

**Decisão**: variáveis CSS com `data-theme` no `<html>`. A preferência fica em `localStorage` e é aplicada por um script inline antes da primeira pintura. Sem preferência salva, segue `prefers-color-scheme`.
**Justificativa**: evita o flash de tema errado e troca instantânea (SC-007).
**Alternativas**: biblioteca de tema e CSS-in-JS foram descartadas por não agregarem nada aqui.

## Estatísticas

**Decisão**: números e barras em CSS e SVG simples, calculados dos registros de tarefas e atividades.
**Justificativa**: três indicadores não justificam uma biblioteca de gráficos.

## Testes

**Decisão**: Vitest, Testing Library e `fake-indexeddb`. Testes de unidade para recorrência, atraso e progresso; testes de componente para os fluxos das histórias.
**Alternativas**: Playwright de ponta a ponta ficou de fora da v1 por custo de manutenção; pode entrar depois para o teste de usabilidade SC-006.

## Conflito de edição entre abas

**Decisão**: cada tarefa tem `updatedAt`. Ao salvar uma edição, se o `updatedAt` no banco for diferente do que o formulário carregou, o app avisa e oferece recarregar em vez de sobrescrever.
**Justificativa**: cobre o caso de borda da spec com uma comparação, sem CRDT.

## Referência visual

A spec cita uma imagem de design anexada, que agora está no repositório em `specs/001-todo-list/protoipo.png`. Ela guia os estilos e o layout da implementação, junto com o que a spec descreve.
