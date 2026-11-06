# Feature Specification: README e organização do repositório

**Feature**: `004-readme-gitignore`
**Created**: 2026-11-06
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - README completo do projeto (Priority: P1)

Quem abre o repositório pela primeira vez entende em poucos minutos o que é o aFazer, como rodar o app e como contribuir. O README é gerado com a skill `create-readme`, a partir do que o projeto realmente tem.

**Why this priority**: é a porta de entrada do projeto e hoje o README é só uma frase.

**Independent Test**: abrir o README em um repositório limpo e conseguir instalar, rodar e testar o app seguindo apenas o que está escrito.

**Acceptance Scenarios**:

1. **Given** o repositório recém clonado, **When** a pessoa lê o README, **Then** encontra o que o app faz, as tecnologias usadas e a URL do deploy.
2. **Given** o README, **When** a pessoa segue as instruções de instalação e execução, **Then** o app abre localmente sem passos extras não documentados.
3. **Given** o README, **When** a pessoa procura os comandos de teste e build, **Then** eles estão listados e funcionam.

---

### User Story 2 - Pastas de ferramentas fora do Git (Priority: P1)

O repositório deixa de versionar as pastas de ferramentas de agente e de especificação, que não fazem parte do app. O `.gitignore` passa a ignorá-las, junto com outros arquivos que não fazem sentido no projeto.

**Why this priority**: evita ruído e arquivos desnecessários em cada commit e no GitHub.

**Independent Test**: criar um arquivo novo dentro de cada pasta ignorada e ver que o Git não o enxerga.

**Acceptance Scenarios**:

1. **Given** o `.gitignore` atualizado, **When** se cria ou altera um arquivo em `.agents`, `.claude` ou `.specify`, **Then** o Git o ignora.
2. **Given** arquivos temporários comuns (variáveis de ambiente locais, logs, cobertura, configurações de editor), **When** aparecem na pasta do projeto, **Then** o Git os ignora.
3. **Given** o `.gitignore` atualizado, **When** se roda o build e os testes, **Then** nada necessário ao app é ignorado por engano.

---

### User Story 3 - Remover do repositório o que já foi enviado (Priority: P2)

Os arquivos dessas pastas que já estão versionados saem do índice do Git, sem serem apagados do disco da pessoa. Assim o repositório fica limpo e o trabalho local continua funcionando.

**Why this priority**: ignorar só vale para arquivos novos; o que já subiu precisa ser removido explicitamente.

**Independent Test**: após o commit, listar os arquivos versionados e não achar nada das pastas ignoradas, enquanto elas continuam no disco.

**Acceptance Scenarios**:

1. **Given** arquivos de `.agents`, `.claude` e `.specify` já versionados, **When** a limpeza é feita, **Then** nenhum deles aparece na lista de arquivos versionados.
2. **Given** a limpeza feita, **When** se olha o disco, **Then** as pastas e seus arquivos continuam lá.
3. **Given** a limpeza feita, **When** se roda o build, os testes e o deploy, **Then** continuam funcionando.

### Edge Cases

- Um arquivo já versionado que entra no `.gitignore` continua sendo rastreado até sair do índice.
- O README não pode apontar para arquivos ou pastas que deixam de ser versionados (ex.: instruções que dependam de `.specify`).
- A pasta `specs`, os testes, os assets do logo e a configuração de deploy continuam versionados.
- O histórico antigo do Git não é reescrito; os arquivos removidos continuam acessíveis em commits anteriores.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O projeto MUST ter um README gerado com a skill `create-readme`.
- **FR-002**: O README MUST descrever o que é o aFazer, as tecnologias, como instalar, rodar, testar e fazer o build, e a URL do deploy.
- **FR-003**: O README MUST manter o logo atual no topo.
- **FR-004**: O `.gitignore` MUST ignorar `.agents`, `.claude` e `.specify`.
- **FR-005**: O `.gitignore` MUST ignorar também os arquivos de ferramentas de agente na raiz (`skills-lock.json`, `living-specs.yml`, `.mcp.json`) e arquivos locais comuns (`.env*` exceto exemplos, logs, `coverage`, `.netlify`, pastas de editor).
- **FR-006**: Os arquivos já versionados nas pastas e arquivos ignorados MUST sair do índice do Git sem serem apagados do disco.
- **FR-007**: O `.gitignore` MUST NOT ignorar nada que o app precisa para instalar, rodar, testar, buildar ou fazer deploy.
- **FR-008**: `specs`, `tests`, `src`, `public`, `assets`, `netlify.toml` e `package-lock.json` MUST continuar versionados.

### Key Entities

- **README**: documento de entrada do repositório, em português.
- **Regras de ignorar**: lista de pastas e arquivos que o Git não deve versionar.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Nenhum arquivo de `.agents`, `.claude` ou `.specify` aparece entre os arquivos versionados.
- **SC-002**: Uma pessoa nova instala e abre o app em menos de 5 minutos seguindo só o README.
- **SC-003**: Build e testes passam com 100% de sucesso depois da limpeza.
- **SC-004**: O status do Git fica limpo após rodar o app, os testes e os agentes localmente.

## Assumptions

- O README é escrito em português, como o resto do projeto.
- `skills-lock.json`, `living-specs.yml` e `.mcp.json` são ferramentas de agente e entram na lista de ignorados. A pasta `specs` continua versionada, porque documenta as decisões do projeto.
- A remoção usa apenas o índice do Git (os arquivos ficam no disco) e a mudança é entregue em um commit novo, sem reescrever o histórico.
- Os workflows apagados de `.github/workflows` não fazem parte desta mudança.

## Verbatim Constraints

- Skill a usar: `create-readme`
- Pastas a ignorar: `.agents`, `.claude`, `.specify`

## Approach

- `README.md`: reescrito com a skill `create-readme`, mantendo o logo no topo.
- `.gitignore`: adicionar `.agents`, `.claude`, `.specify`, `skills-lock.json`, `living-specs.yml`, `.mcp.json`, `.env*` (com `!.env.example`), `*.log`, `coverage`, `.netlify`, `.vscode`, `.idea`.
- Índice do Git: `git rm -r --cached` das pastas e arquivos ignorados que já estão versionados.
- Conferir com `git ls-files` e rodar `npm run build` e `npm test`.
