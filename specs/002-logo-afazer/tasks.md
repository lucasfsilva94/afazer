# Tarefas: Logo do aFazer

**Spec**: [logo-afazer.spec.md](logo-afazer.spec.md) · **Plano**: [plan.md](plan.md)

Formato: `- [ ] **T###** [P?] [US#] Descrição · caminho/do/arquivo`. `[P]` = independente dentro da onda.

## Phase 1: Setup

**Wave 1 — independent (different files):**

- [x] **T001** [P] Instalar as dependências Python da skill (`pip install -r .claude/skills/logo-generator/requirements.txt`); se a Cairo faltar no Windows, anotar que o PNG sai pelo navegador (T004) · .claude/skills/logo-generator/requirements.txt
- [x] **T002** [P] Criar a pasta dos originais · assets/logo/.gitkeep

## Phase 2: Foundational

Nada bloqueia as histórias além do Setup. Sem tarefas.

## Phase 3: User Story 1 — Logo oficial do aFazer (P1, MVP)

Files: `assets/logo/afazer-symbol.svg`, `assets/logo/afazer-logo.svg`, `assets/logo/afazer-logo-dark.svg`

### Implementation

**Wave 1 — independent (different files):**

- [x] **T003** [US1] Gerar com a skill `logo-generator` as variantes do símbolo (ideia de lista/tarefa concluída, cor `#0F766E`), escolher uma com a pessoa e salvar o símbolo, legível em 16 px (FR-001, FR-002, FR-004, FR-006) · assets/logo/afazer-symbol.svg

**⟶ Wait for Wave 1 to finish, then:**

**Wave 2 — independent (different files):**

- [x] **T004** [P] [US1] Montar o logo completo (símbolo + "aFazer" em `<path>`, sem `<text>`) para fundo claro (FR-002, FR-005) · assets/logo/afazer-logo.svg
- [x] **T005** [P] [US1] Montar a versão escura com `#3CC4B4` e o nome legível sobre fundo escuro (FR-003, FR-004, FR-005) · assets/logo/afazer-logo-dark.svg

**⟶ Wait for Wave 2 to finish, then:**

- [x] **T006** [US1] Conferir os três SVGs no navegador em fundo claro e escuro: sem `<text>`, contraste mínimo 3:1, símbolo reconhecível em 16 px (SC-001, SC-002, SC-003) · assets/logo/

**Checkpoint**: os três SVGs existem e abrem; US1 é testável sozinha.

## Phase 4: User Story 2 — Logo aplicado no app (P2)

Files: `public/favicon.svg`, `index.html`, `src/ui/Layout.tsx`, `src/ui/ui.css`, `tests/features/us8-logo.test.tsx`

### Tests

- [x] **T007** [US2] Teste que falha primeiro: o cabeçalho tem `img.logo-light` e `img.logo-dark`, só uma com `alt="aFazer"`; nenhum texto "Afazer" na tela; o fallback do `h1` é `aFazer` (FR-009, FR-012, SC-005) · tests/features/us8-logo.test.tsx

### Implementation

**Wave 1 — independent (different files):**

- [x] **T008** [P] [US2] Copiar o símbolo para `public/favicon.svg` (FR-008) · public/favicon.svg
- [x] **T009** [P] [US2] Trocar `<link rel="icon">` e o `<title>` para `aFazer — sua lista de tarefas` (FR-008, FR-012) · index.html
- [x] **T010** [P] [US2] Em `.brand`, esconder `logo-dark` no tema claro e `logo-light` no escuro por `[data-theme]`; ajustar o tamanho das imagens (FR-007) · src/ui/ui.css

**⟶ Wait for Wave 1 to finish, then:**

- [x] **T011** [US2] Trocar o `<Logo>` inline por duas `<img>` importadas de `assets/logo/` (`alt="aFazer"` na visível, `alt=""` na outra); manter `.brand-mini` com o símbolo e `aria-hidden`; fallback do título `aFazer` (FR-007, FR-009, FR-012) · src/ui/Layout.tsx

**⟶ Wait for T011, then:**

- [x] **T012** [US2] Rodar `npm test` e ver T007 passar; abrir o app nos dois temas e conferir cabeçalho e aba (SC-004) · tests/features/us8-logo.test.tsx

**Checkpoint**: o app mostra o logo certo em cada tema e na aba; US2 é testável sozinha.

## Phase 5: User Story 3 — PNG e vitrine (P3)

Files: `assets/logo/afazer-symbol.png`, `assets/logo/afazer-logo.png`, `README.md`, `assets/logo/showcase/`

### Implementation

**Wave 1 — independent (different files):**

- [x] **T013** [P] [US3] Exportar o PNG do símbolo com `scripts/svg_to_png.py` (1024 px, fundo transparente) (FR-010) · assets/logo/afazer-symbol.png
- [x] **T014** [P] [US3] Exportar o PNG do logo completo (FR-010) · assets/logo/afazer-logo.png
- [x] **T015** [P] [US3] Gerar a vitrine com a skill (4 estilos de fundo). Sem chave Gemini, pular e avisar; o resto segue entregue · assets/logo/showcase/ — pulada: sem Python nem chave Gemini nesta máquina

**⟶ Wait for Wave 1 to finish, then:**

- [x] **T016** [US3] Mostrar o logo no topo do README com `<img>` de `assets/logo/afazer-logo.png` e `alt="aFazer"` (FR-011) · README.md

**Checkpoint**: PNGs, README (e vitrine, se houve chave) prontos.

## Phase 6: Polish

- [x] **T017** Validar contra os critérios de sucesso: rodar `npm test` e `npm run lint`, e conferir SC-001 a SC-005 · specs/002-logo-afazer/logo-afazer.spec.md — testes ok (106); o projeto não tem script de lint

## Dependencies & Execution Order

- Setup → US1 → US2 → Polish. US3 depende só de US1 e pode rodar em paralelo com US2.
- US1: T003 → (T004, T005) → T006.
- US2: T007 primeiro; (T008, T009, T010) → T011 → T012. T008 precisa do símbolo de T003.
- US3: (T013, T014, T015) → T016. T013 a T015 precisam dos SVGs de US1.
