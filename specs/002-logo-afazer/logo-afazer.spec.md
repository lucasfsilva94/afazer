# Feature Specification: Logo do aFazer

**Feature Branch**: `002-logo-afazer`
**Created**: 2026-11-06
**Status**: Draft
**Input**: "Crie o logo para esse projeto "aFazer" utilizando a skill "logo-generator""

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Logo oficial do aFazer (Priority: P1)

A pessoa que mantém o projeto quer um logo próprio para o aFazer, gerado com a skill `logo-generator`, que traduza a ideia de "lista de tarefas pessoal" de forma simples e reconhecível. O resultado são arquivos de logo prontos para uso: o símbolo, o logo com o nome e uma versão para fundo escuro.

**Why this priority**: sem o logo não há nada a aplicar. É a entrega mínima que já tem valor sozinha.

**Independent Test**: abrir os arquivos gerados num navegador, em fundo claro e escuro, e confirmar que o símbolo e o nome "aFazer" são legíveis e coerentes com o app.

**Acceptance Scenarios**:

1. **Given** a skill `logo-generator` e o nome "aFazer", **When** o logo é gerado, **Then** existe um arquivo SVG do símbolo e um do logo completo (símbolo + nome).
2. **Given** o logo completo em fundo claro, **When** é exibido, **Then** o símbolo e o nome "aFazer" são legíveis.
3. **Given** o logo em fundo escuro, **When** é exibido, **Then** existe uma versão que mantém o mesmo contraste e legibilidade.
4. **Given** o símbolo exibido em 16 px, **When** visto na aba do navegador, **Then** a forma principal ainda é reconhecível.

---

### User Story 2 - Logo aplicado no app (Priority: P2)

Quem usa o aFazer vê o logo no cabeçalho do app e como ícone da aba do navegador, no lugar do texto e do ícone padrão atuais, acompanhando o tema claro/escuro.

**Why this priority**: faz o logo aparecer onde a pessoa usa o produto, mas depende do P1.

**Independent Test**: abrir o app nos dois temas e conferir o logo no topo e o ícone na aba.

**Acceptance Scenarios**:

1. **Given** o app aberto no tema claro, **When** a tela carrega, **Then** o cabeçalho mostra o logo do aFazer.
2. **Given** o app aberto no tema escuro, **When** a tela carrega, **Then** o logo exibido é o da versão para fundo escuro.
3. **Given** o app aberto no navegador, **When** a aba é exibida, **Then** ela mostra o ícone do aFazer.
4. **Given** o logo no cabeçalho, **When** lido por leitor de tela, **Then** o nome "aFazer" é anunciado.

---

### User Story 3 - Logo em PNG e vitrine (Priority: P3)

A pessoa recebe também versões em PNG do logo e a imagem de vitrine que a skill produz, para usar no README e em redes ou apresentações.

**Why this priority**: útil para divulgar o projeto, mas o app funciona sem isso.

**Independent Test**: abrir os PNGs e a imagem de vitrine e conferir que correspondem ao SVG.

**Acceptance Scenarios**:

1. **Given** o logo em SVG, **When** a exportação é feita, **Then** existe um PNG do símbolo e um do logo completo.
2. **Given** o README do projeto, **When** é aberto, **Then** o logo aparece no topo.

---

### Edge Cases

- Tema escuro: o logo não pode sumir nem perder contraste sobre o fundo escuro.
- Tamanho mínimo: o símbolo precisa continuar legível em 16 px.
- Fontes: o nome "aFazer" não pode depender de uma fonte instalada na máquina de quem vê o logo.
- A geração de imagens de vitrine exige acesso externo (Gemini). Sem ele, os SVGs e PNGs ainda devem ser entregues.
- O nome é escrito "aFazer" no pedido e "Afazer" hoje no app; é preciso decidir uma grafia única.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O logo MUST ser gerado com a skill `logo-generator`.
- **FR-002**: O projeto MUST ter um SVG do símbolo e um SVG do logo completo (símbolo + nome "aFazer").
- **FR-003**: O projeto MUST ter uma versão do logo para fundo escuro.
- **FR-004**: O logo MUST usar a cor de destaque do app (verde-azulado, `#0F766E` no claro e `#3CC4B4` no escuro) como cor principal.
- **FR-005**: O texto do nome nos arquivos finais MUST ser independente de fonte instalada.
- **FR-006**: O símbolo MUST ser reconhecível em 16 px.
- **FR-007**: O app MUST mostrar o logo no cabeçalho, trocando a versão conforme o tema ativo.
- **FR-008**: O app MUST usar o símbolo como ícone da aba do navegador.
- **FR-009**: O logo no cabeçalho MUST ter texto alternativo "aFazer".
- **FR-010**: O projeto SHOULD incluir PNGs do símbolo e do logo completo.
- **FR-011**: O README do projeto SHOULD mostrar o logo no topo.
- **FR-012**: O nome do produto MUST aparecer escrito "aFazer" em todos os pontos onde o logo ou o nome são exibidos.

### Key Entities

- **Símbolo**: a marca gráfica sozinha, usada em tamanhos pequenos e como ícone da aba.
- **Logo completo**: símbolo mais o nome "aFazer", em versão para fundo claro e para fundo escuro.
- **Imagem de vitrine**: apresentação do logo sobre fundos variados, gerada pela skill.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Todos os arquivos de logo obrigatórios (símbolo, logo completo, versão escura) existem e abrem sem erro em um navegador.
- **SC-002**: O contraste entre o logo e seu fundo atende ao mínimo de 3:1 nos temas claro e escuro.
- **SC-003**: Em 16 px o símbolo continua distinguível de um quadrado liso, verificado por inspeção visual.
- **SC-004**: Em 100% das telas do app, o cabeçalho e a aba mostram o logo nos dois temas.
- **SC-005**: Nenhuma tela do app apresenta o nome com grafia diferente de "aFazer".

## Assumptions

- O conceito visual é livre: a skill propõe o estilo, com ideia de lista/tarefa concluída, e a pessoa aprova.
- A paleta segue a cor de destaque atual do app.
- A grafia oficial passa a ser "aFazer", como no pedido. O título da página e o cabeçalho hoje dizem "Afazer" e serão ajustados.
- As imagens de vitrine dependem de chave de API externa. Se ela não estiver disponível, a vitrine fica fora e os demais arquivos são entregues.
- Os arquivos finais ficam em uma pasta de assets do projeto, fora de `src/`.

## Verbatim Constraints

- Nome do produto: `aFazer`
- Skill a usar: `logo-generator`
