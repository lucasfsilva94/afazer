# Feature Specification: Revisão visual e menu mobile sem sobreposição

**Feature Branch**: `005-revisao-visual-mobile`
**Created**: 2026-11-06
**Status**: Draft
**Input**: Revisar espaçamento e demais elementos visuais do aFazer com a skill `impeccable` e corrigir o menu inferior no celular, que em produção fica coberto pelo selo "Powered by Netlify" (selo que não pode ser removido no plano gratuito).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Menu inferior do celular sempre acessível (Priority: P1)

Quem abre o aFazer em produção no celular vê o selo "Powered by Netlify" flutuando sobre o menu inferior e cobrindo os itens "Calendário", "Projetos" e "Mais". O menu precisa continuar totalmente visível e tocável, convivendo com o selo, que continua na tela.

**Why this priority**: hoje parte da navegação fica inacessível em produção. É o único defeito que bloqueia o uso.

**Independent Test**: abrir o site publicado (ou uma simulação do selo) em largura de celular e tocar em cada item do menu, incluindo "Mais".

**Acceptance Scenarios**:

1. **Given** o site em produção em tela de celular, **When** a tela do Painel carrega, **Then** os cinco itens do menu inferior (Painel, Tarefas, Calendário, Projetos, Mais) ficam visíveis por inteiro, sem nenhuma parte coberta pelo selo.
2. **Given** o mesmo cenário, **When** a pessoa toca em "Calendário", "Projetos" e "Mais", **Then** cada toque abre a tela correspondente em vez de atingir o selo.
3. **Given** o selo presente, **When** a pessoa rola qualquer tela até o fim, **Then** o último conteúdo não fica escondido atrás do menu nem do selo.
4. **Given** o tema claro ou escuro, **When** o menu e o selo aparecem juntos, **Then** os dois são legíveis e não se sobrepõem.

---

### User Story 2 - Espaçamento e hierarquia visual revisados em todas as telas (Priority: P2)

O dono do app quer que o espaçamento, o ritmo vertical e os demais elementos visuais (títulos, cartões, listas vazias, botões, campos, contadores) sigam uma lógica consistente, apontada pela revisão com a skill `impeccable`. Nas capturas, por exemplo, o título "Hoje" está colado no campo de adicionar e o título "Pendentes" colado no cartão acima.

**Why this priority**: melhora a qualidade percebida em todas as telas, mas o app já é utilizável sem isso.

**Independent Test**: abrir cada tela (Painel, Tarefas, Calendário, Projetos, Histórico, Estatísticas) em desktop e celular e conferir o espaçamento contra a revisão registrada.

**Acceptance Scenarios**:

1. **Given** o Painel, **When** a pessoa vê o campo de adicionar e as seções "Hoje" e "Pendentes", **Then** há espaço claro entre o campo e "Hoje", e entre cada título de seção e o bloco acima e abaixo dele.
2. **Given** qualquer tela, **When** comparada em desktop e celular, **Then** margens laterais, espaços entre blocos e tamanhos de texto seguem a mesma escala em todas.
3. **Given** a revisão feita com `impeccable`, **When** a pessoa lê o registro dela, **Then** ele lista o que foi encontrado e o que foi alterado em cada tela.
4. **Given** os temas claro e escuro, **When** a pessoa percorre as telas, **Then** o contraste de texto e dos elementos interativos continua legível nos dois.

---

### User Story 3 - Layout de celular revisado além do menu (Priority: P3)

No celular, o resto da tela (cabeçalho, campo de adicionar com seu botão, cartões, diálogos) também deve ter espaço e tamanho de toque confortáveis, sem texto cortado nem rolagem horizontal.

**Why this priority**: refina a experiência no celular depois que a navegação está corrigida.

**Independent Test**: percorrer as telas em larguras de 360 px e 412 px.

**Acceptance Scenarios**:

1. **Given** uma tela de 360 px de largura, **When** a pessoa percorre cada tela, **Then** não há rolagem horizontal nem texto cortado.
2. **Given** um diálogo aberto no celular (nova tarefa, "Mais telas"), **When** o selo está presente, **Then** os botões do diálogo ficam acessíveis.

### Edge Cases

- O selo some ou muda de tamanho (ou de lado) numa futura mudança do Netlify: o menu não pode quebrar nem deixar um vão estranho.
- Telas muito baixas (celular na horizontal): o menu e o selo não podem ocupar a tela inteira.
- Celulares com barra de gestos ou área segura inferior.
- Tela do Painel vazia e tela com muitas tarefas: o espaço extra no fim da rolagem não pode parecer um defeito.
- Fora de produção (desenvolvimento local), onde não existe selo: o menu não deve ficar com um vão sem motivo.
- Escolha de tema claro ou escuro, e preferência por menos movimento, continuam respeitadas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A revisão visual MUST ser conduzida com a skill `impeccable`; seu uso é obrigatório e MUST ficar registrado (achados e mudanças por tela).
- **FR-002**: No celular, o menu inferior MUST ficar inteiro visível e tocável quando o selo "Powered by Netlify" estiver presente.
- **FR-003**: O selo "Powered by Netlify" MUST NOT ser removido, escondido nem alterado; a solução MUST funcionar com ele na tela.
- **FR-004**: O conteúdo de cada tela MUST poder ser rolado até o último item sem ficar atrás do menu ou do selo.
- **FR-005**: O espaçamento entre campo de adicionar, títulos de seção e cartões MUST seguir uma escala única e visível, sem títulos colados no bloco vizinho.
- **FR-006**: Margens, espaços entre blocos e tamanhos de texto MUST ser consistentes entre as seis telas e entre desktop e celular.
- **FR-007**: Em 360 px de largura, nenhuma tela MUST ter rolagem horizontal ou texto cortado.
- **FR-008**: Alvos de toque do menu e botões principais no celular SHOULD ter pelo menos 44 px de altura e largura.
- **FR-009**: Contraste de texto e de elementos interativos MUST continuar adequado nos temas claro e escuro.
- **FR-010**: A correção do menu MUST não deixar vão visível quando o selo não existe (ambiente local).
- **FR-011**: Funcionalidades existentes (tarefas, calendário, lembretes, temas, dados locais) MUST continuar funcionando sem mudança de comportamento.

### Key Entities

Nenhuma entidade de dados nova. A feature só altera a apresentação.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em produção, em celular, 100% dos cinco itens do menu inferior ficam visíveis e tocáveis com o selo presente.
- **SC-002**: As seis telas rolam até o último item sem conteúdo coberto, em 360 px e 412 px de largura.
- **SC-003**: Zero ocorrências de rolagem horizontal nas seis telas em 360 px.
- **SC-004**: A revisão com `impeccable` cobre as seis telas e todos os achados estão corrigidos ou justificados no registro.
- **SC-005**: Os testes existentes do app continuam passando e o build de produção continua gerando sem erros.
- **SC-006**: O contraste de texto fica em pelo menos 4,5:1 nos dois temas.

## Assumptions

- O selo fica fixo no canto inferior direito da tela e tem cerca de 40 px de altura; o plano gratuito do Netlify não permite removê-lo.
- Para contornar, o menu pode reservar espaço para o selo ou subir acima dele, desde que fique igual com e sem selo.
- Desktop não tem problema com o selo (ele fica fora da área útil); a revisão visual vale para desktop e celular.
- O idioma e o texto da interface não mudam.
- O estado atual dos temas, cores e logo (spec 002) é mantido, salvo ajustes de contraste.

## Verbatim Constraints

- Skill obrigatória: `impeccable`
- Texto do selo que não pode ser removido: `Powered by Netlify`
- Itens do menu inferior: `Painel`, `Tarefas`, `Calendário`, `Projetos`, `Mais`
