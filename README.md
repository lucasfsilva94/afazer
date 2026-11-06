<p align="center">
  <img src="assets/logo/afazer-logo.png" alt="aFazer" width="320">
</p>

# aFazer

Lista de tarefas pessoal, simples e rápida. Seus dados ficam só no seu dispositivo: não há conta, servidor nem sincronização.

**Acesse:** [afazer-app.netlify.app](https://afazer-app.netlify.app)

## Recursos

- Criar, editar, concluir e excluir tarefas, com adição rápida
- Prazo, horário, prioridade, categorias, etiquetas e lembretes
- Subtarefas e tarefas recorrentes
- Projetos e grupos para organizar o trabalho
- Calendário, filtros, ordenação e pesquisa
- Painel com tarefas do dia, pendências, atrasos e progresso
- Histórico de atividades e estatísticas de produtividade
- Modo claro e escuro

> [!NOTE]
> Os dados são guardados no IndexedDB do navegador. Limpar os dados do site apaga as tarefas.

## Tecnologias

- [React 18](https://react.dev) e [React Router](https://reactrouter.com)
- [TypeScript](https://www.typescriptlang.org) e [Vite](https://vite.dev)
- [Dexie](https://dexie.org) (IndexedDB) para persistência local
- [Vitest](https://vitest.dev) e Testing Library para testes
- [Netlify](https://www.netlify.com) para o deploy

## Começando

Pré-requisito: [Node.js](https://nodejs.org) 22 ou superior.

```bash
git clone https://github.com/lucasfsilva94/todo-poc.git
cd todo-poc
npm install
npm run dev
```

O app abre em `http://localhost:5173`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Roda os testes |
| `npm run typecheck` | Verifica os tipos |
| `npm run build` | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente o build de produção |

## Deploy

Todo push na `main` dispara o build no Netlify e publica em [afazer-app.netlify.app](https://afazer-app.netlify.app). A configuração está em [`netlify.toml`](netlify.toml).

## Estrutura

```text
src/
  db/         persistência (Dexie) e acesso aos dados
  domain/     regras puras: datas, recorrência, progresso, filtros
  features/   telas e fluxos: tarefas, projetos, calendário, painel, histórico, estatísticas
  theme/      tema claro e escuro
  ui/         componentes de interface reutilizáveis
tests/        testes automatizados
specs/        especificações das funcionalidades
```
