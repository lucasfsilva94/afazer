# Tasks: Publicar o app no Netlify a cada push na main

## Phase 1: Setup

Nenhum. O projeto, o site `afazer-app` e o deploy contínuo pelo GitHub já existem.

## Phase 2: Foundational

Nenhum. Os dois arquivos abaixo são independentes e cada história é dona do seu.

## Phase 3: User Story 1 - Subir na main e o site atualizar (P1, MVP)

Files: `netlify.toml`

### Implementation

- [ ] **T001** [US1] Criar `netlify.toml` com build `npm run build`, publish `dist` e `NODE_VERSION` fixa (FR-001, FR-004) · netlify.toml

**⟶ Wait for T001 to finish, then:**

- [ ] **T002** [US1] Rodar `npm run build` local e confirmar que `dist` é gerado (FR-003) · package.json
- [ ] **T003** [US1] Dar push na `main`, conferir o deploy de produção em `afazer-app.netlify.app` (FR-002, SC-001, SC-002) · netlify.toml

**Checkpoint**: a `main` publica em `afazer-app.netlify.app` só com a configuração do repositório.

## Phase 4: User Story 2 - Gerenciar o site pelo MCP do Netlify (P2)

Files: `.mcp.json`

### Implementation

- [ ] **T004** [P] [US2] Criar `.mcp.json` com o servidor `npx -y @netlify/mcp`, sem token (FR-005, FR-006) · .mcp.json

**⟶ Wait for T004 to finish, then:**

- [ ] **T005** [US2] Recarregar o projeto no Claude Code e pedir o último deploy de `afazer-app` pelo MCP (SC-005) · .mcp.json

**Checkpoint**: o assistente lista o último deploy do site pelo MCP.

## Final Phase: Polish

- [ ] **T006** Conferir que nenhum token entrou no repositório e que o build quebrado não derruba a versão publicada (FR-003, FR-006, SC-003, SC-004) · netlify.toml

## Dependencies & Execution Order

Phase 3 e Phase 4 não compartilham arquivos e podem andar em paralelo. T003 depende de T001 e T002; T005 depende de T004; Polish roda por último.
