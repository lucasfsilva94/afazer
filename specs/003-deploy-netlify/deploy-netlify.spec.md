# Feature Specification: Publicar o app no Netlify a cada push na main

**Feature Branch**: `003-deploy-netlify`
**Created**: 2026-11-05
**Status**: Specified
**Input**: "Conectar com o MCP do Netlify para publicar meu projeto. O site já existe e aponta para afazer-app.netlify.app. Quero subir na main e ele ser atualizado nessa URL."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Subir na main e o site atualizar (Priority: P1)

Quem mantém o app dá push na `main` e, sem nenhum passo manual, a versão nova aparece em `afazer-app.netlify.app`. O build roda com a mesma configuração sempre, definida no próprio repositório.

**Why this priority**: é o pedido central. Hoje o site já publica a partir do GitHub, mas a configuração de build vive só no painel do Netlify e pode divergir do projeto.

**Independent Test**: dar push de uma mudança visível na `main` e conferir que a URL mostra a mudança e que o deploy aparece como publicado.

**Acceptance Scenarios**:

1. **Given** uma mudança commitada, **When** ela é enviada para a `main`, **Then** o Netlify roda o build e publica em `afazer-app.netlify.app`.
2. **Given** um build que falha (erro de tipo ou de compilação), **When** o push chega na `main`, **Then** o deploy falha e a versão anterior continua no ar.
3. **Given** o repositório recém-clonado, **When** o build do Netlify roda, **Then** ele usa só a configuração versionada no repositório, sem depender de ajustes no painel.

### User Story 2 - Gerenciar o site pelo MCP do Netlify (Priority: P2)

Quem mantém o app consegue, a partir do Claude Code neste projeto, usar o MCP do Netlify para ver o site, os deploys e o estado da publicação.

**Why this priority**: o usuário pediu a conexão, mas o fluxo principal funciona sem ela.

**Independent Test**: abrir o projeto no Claude Code e pedir ao assistente o último deploy de `afazer-app`; ele responde com dados reais.

**Acceptance Scenarios**:

1. **Given** o projeto aberto no Claude Code, **When** o MCP do Netlify é carregado, **Then** o assistente enxerga o site `afazer-app`.
2. **Given** o MCP conectado, **When** o usuário pede o status do último deploy, **Then** o assistente informa o commit publicado e se está no ar.

### Edge Cases

- Rotas profundas: o app usa rotas com `#`, então recarregar qualquer tela não gera erro 404.
- Push em outra branch não altera a URL de produção.
- Credenciais do Netlify nunca entram no repositório.
- O site hoje está privado ("Private" no painel): a visibilidade pública é uma decisão do dono, fora deste escopo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O repositório MUST declarar como o app é construído e qual pasta é publicada, para o Netlify não depender de configuração manual no painel.
- **FR-002**: Um push na `main` MUST gerar um deploy de produção em `afazer-app.netlify.app`.
- **FR-003**: Um build com falha MUST NOT substituir a versão publicada.
- **FR-004**: A versão de Node usada no build MUST ser fixada no repositório.
- **FR-005**: O projeto MUST trazer a conexão com o MCP do Netlify configurada para o Claude Code.
- **FR-006**: Nenhum token ou credencial do Netlify MUST ser versionado.

### Key Entities

- **Site**: `afazer-app` no Netlify, ligado ao repositório GitHub, com a `main` como branch de produção.
- **Deploy**: uma publicação ligada a um commit, com estado (publicado ou falhou).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Do push na `main` até a mudança visível na URL, em até 5 minutos.
- **SC-002**: 100% dos pushes na `main` geram um deploy de produção registrado.
- **SC-003**: Um build quebrado deixa a versão anterior acessível (0 minutos fora do ar).
- **SC-004**: Zero credenciais no repositório.
- **SC-005**: O assistente lista o último deploy de `afazer-app` pelo MCP na primeira tentativa.

## Assumptions

- O site `afazer-app` já está ligado ao repositório `lucasfsilva94/todo-poc` com deploy contínuo pela `main`, como o painel mostra.
- A autenticação do MCP é feita pela conta do usuário no primeiro uso, sem token no repositório.
- O domínio continua `afazer-app.netlify.app`.

## Verbatim Constraints

- URL de produção: `afazer-app.netlify.app`
- Site: `afazer-app`
- Branch de produção: `main`

## Approach

- Criar `netlify.toml` com build `npm run build`, publish `dist` e `NODE_VERSION`.
- Criar `.mcp.json` com o servidor do Netlify (`npx -y @netlify/mcp`), sem token.
- Verificar com um push na `main` e checar o deploy pelo MCP.
