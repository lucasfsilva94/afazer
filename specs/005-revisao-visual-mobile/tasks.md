# Tasks: Revisão visual e menu mobile sem sobreposição

**Spec**: [revisao-visual-mobile.spec.md](revisao-visual-mobile.spec.md) · **Plano**: [plan.md](plan.md) · **Contrato**: [contracts/ui.md](contracts/ui.md)

Formato: `- [ ] **T###** [P?] [US#] Descrição + caminho`. `[P]` = pode rodar em paralelo (arquivos diferentes, sem dependência).

## Fase 1: Fundação (token do selo)

- [x] **T001** [US1] Definir `--badge-h: 0px` e a regra `html[data-badge]` (56 px abaixo de 900 px de largura e acima de 480 px de altura) + `src/theme/theme.css`
- [x] **T002** [P] [US1] Marcar `<html data-badge>` quando `import.meta.env.PROD` + `src/main.tsx`

## Fase 2: US1 — Menu inferior acessível (P1, MVP)

**Teste independente**: simular o selo (div fixo de 40 px no canto direito) em 360 e 412 px e tocar nos cinco itens.

- [x] **T003** [US1] `.bottomnav` com `padding-bottom: calc(var(--badge-h) + env(safe-area-inset-bottom))`, sem vão quando `--badge-h` é 0 (FR-002, FR-010) + `src/ui/ui.css`
- [x] **T004** [US1] `.main` e `.toasts` reservam `80px + var(--badge-h) + safe-area` no fim da rolagem (FR-004) + `src/ui/ui.css`
- [x] **T005** [P] [US1] Teste: `data-badge` presente em produção e ausente em dev; menu com `Painel`, `Tarefas`, `Calendário`, `Projetos`, `Mais` nessa ordem + `tests/features/us9-layout.test.tsx`
- [x] **T006** [US1] Verificar no navegador com selo simulado, 360 e 412 px, temas claro e escuro, e celular na horizontal; selo intocado (FR-003)

## Fase 3: US2 — Espaçamento e hierarquia (P2)

**Teste independente**: abrir as seis telas em desktop e celular e conferir contra `review.md`.

- [x] **T007** [US2] Rodar a skill `impeccable` (critique/audit) nas seis telas e nos diálogos, em 360, 412 e desktop, nos dois temas; registrar tabela por tela (achado, severidade, correção ou justificativa) + `specs/005-revisao-visual-mobile/review.md` (FR-001)
- [x] **T008** [US2] Trocar `.sec-head:first-child{margin-top:0}` por espaço entre blocos (`section + section`, `.capture + section`) usando só `--sp-*` (FR-005) + `src/ui/ui.css`
- [x] **T009** [US2] Aplicar os demais achados da revisão: margens, ritmo vertical e tamanhos de texto numa escala única entre telas e entre desktop e celular (FR-006) + `src/ui/ui.css`, `src/features/*/`
- [x] **T010** [US2] Conferir contraste ≥ 4,5:1 de texto e elementos interativos nos dois temas e corrigir tokens se preciso (FR-009, SC-006) + `src/theme/theme.css`

## Fase 4: US3 — Layout de celular (P3)

**Teste independente**: percorrer as telas em 360 px e 412 px.

- [x] **T011** [US3] Eliminar rolagem horizontal e texto cortado em 360 px nas seis telas (FR-007, SC-003) + `src/ui/ui.css`
- [x] **T012** [P] [US3] Alvos de toque ≥ 44 px: checar `.nav-ind`, `.cal-cell`, `.link-btn` e botão do campo de adicionar (FR-008) + `src/ui/ui.css`
- [x] **T013** [US3] Diálogos (nova tarefa, "Mais telas") com botões acessíveis com o selo presente + `src/ui/ui.css`

## Fase 5: Fechamento

- [x] **T014** Fechar `review.md`: todo achado corrigido ou justificado (SC-004) + `specs/005-revisao-visual-mobile/review.md`
- [x] **T015** Validar `npm test` e `npm run build` sem erros e funcionalidades inalteradas (FR-011, SC-005)

## Dependências

- T001 → T003, T004; T002 independente (T005 depende de T002).
- T003, T004 e T008–T013 editam `ui.css`: executar em sequência, não em paralelo.
- T007 antes de T009; T009 antes de T014.
- US1 (T001–T006) entrega o MVP e pode ser publicada antes de US2 e US3.
