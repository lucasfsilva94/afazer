---
description: "Rich task list template for feature implementation and GitHub Issues sync"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, and project ADRs.

**Tests**: Test tasks are OPTIONAL - only include them if explicitly requested in the feature specification or Constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation, testing, and direct export to GitHub Issues.

## Task Structure & Format

Every task MUST follow this rich structure so AI agents and developers have full context without guessing requirements:

- [ ] **T###** [P?] [Story?] `[TYPE]` **Short Imperative Title**
  - **Context & Goal**: Why this task exists and what exact problem/requirement it solves.
  - **Target Files**: `exact/path/to/file.ext` (create / modify)
  - **Technical Constraints**: Specific patterns, ADR rules, caching rules, dependency restrictions, or edge cases to respect.
  - **Acceptance Criteria (DoD)**:
    - [ ] Verifiable outcome 1 (e.g., function signature/contract matches `contracts/`)
    - [ ] Verifiable outcome 2 (e.g., handles error/fallback case X)

### Legend & Metadata

- **[P]**: Can run in parallel (touches different files, has no unfinished blocking dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `[US1]`, `[US2]`, `[FOUNDATION]`, `[SETUP]`)
- **`[TYPE]`**: Semantic prefix (`[FEAT]`, `[FIX]`, `[REFACTOR]`, `[TEST]`, `[CHORE]`, `[DOCS]`)
- **Depends on**: Explicitly cite `T###` in Technical Constraints if a task is blocked by another.

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust all paths based on the exact structure defined in `plan.md`.

<!--
  ============================================================================
  IMPORTANT INSTRUCTIONS FOR THE /speckit-tasks AGENT:
  The tasks below are SAMPLE TASKS for illustration purposes only.

  You MUST replace these with actual tasks based on:
  - User stories & edge cases from spec.md (with their priorities P1, P2, P3...)
  - Architecture, tech stack, and ADRs from plan.md & constitution.md
  - Entities & validation rules from data-model.md
  - API/Module signatures from contracts/

  CRITICAL RULES FOR GENERATION:
  1. NEVER generate single-line vague tasks. Every task MUST include the 4 sub-bullets:
     Context & Goal, Target Files, Technical Constraints, and Acceptance Criteria (DoD).
  2. Explicitly state what NOT to do in Technical Constraints (e.g., "Do not add new
     external packages", "Reuse existing HTTP client in src/lib/").
  3. Tasks MUST be organized by user story so each story can be:
     - Implemented independently
     - Tested independently
     - Delivered as an MVP increment
  4. DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, configuration, and base structure

- [ ] **T001** [SETUP] `[CHORE]` **Create directory structure and base configuration**
  - **Context & Goal**: Establish the folder hierarchy required by `plan.md` so subsequent tasks have deterministic file paths.
  - **Target Files**: `src/`, `tests/`, `package.json` (or language equivalent)
  - **Technical Constraints**: Strictly follow the directory tree in `plan.md`. Do not install unapproved third-party libraries.
  - **Acceptance Criteria (DoD)**:
    - [ ] Directory tree matches `plan.md` specification.
    - [ ] Base build, typecheck, and lint scripts execute without configuration errors.

- [ ] **T002** [P] [SETUP] `[CHORE]` **Configure environment variables and schema validation**
  - **Context & Goal**: Ensure required API keys, timeouts, and paths are validated at startup.
  - **Target Files**: `src/config/env.ts`, `.env.example`
  - **Technical Constraints**: Fail fast on missing required variables; provide safe defaults for local cache paths.
  - **Acceptance Criteria (DoD)**:
    - [ ] `.env.example` documents all new variables required by `plan.md`.
    - [ ] Config loader throws a descriptive error when required vars are missing.

- [ ] **T003** [P] [SETUP] `[CHORE]` **Configure linting and formatting tools**
  - **Context & Goal**: Enforce consistent code style and static analysis across all generated modules.
  - **Target Files**: `.eslintrc` / `biome.json` / `pyproject.toml` (per language stack in `plan.md`)
  - **Technical Constraints**: Align rules with project Constitution standards.
  - **Acceptance Criteria (DoD)**:
    - [ ] Linter and formatter run cleanly via CLI command.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] **T004** [FOUNDATION] `[FEAT]` **Implement shared data models, entities, and interfaces**
  - **Context & Goal**: Define the core data types, schemas, and contracts shared across multiple user stories.
  - **Target Files**: `src/models/[entity].ts`, `src/types/contracts.ts`
  - **Technical Constraints**: Must match field types and validation rules from `data-model.md`. Zero external runtime dependencies if pure types suffice.
  - **Acceptance Criteria (DoD)**:
    - [ ] All entities from `data-model.md` are exported and strongly typed.
    - [ ] Type checker / compiler passes with zero errors.

- [ ] **T005** [P] [FOUNDATION] `[FEAT]` **Setup base error handling, logging, and local cache utilities**
  - **Context & Goal**: Provide standardized error wrappers and local persistence/caching before building feature services.
  - **Target Files**: `src/lib/errors.ts`, `src/lib/cache.ts`, `src/lib/logger.ts`
  - **Technical Constraints**: Respect project ADRs regarding disk caching and cost/rate limits. Avoid heavy logging frameworks if structured standard output suffices.
  - **Acceptance Criteria (DoD)**:
    - [ ] Custom error classes distinguish between retryable and fatal errors.
    - [ ] Cache utility supports deterministic key generation and TTL/invalidation.

- [ ] **T006** [P] [FOUNDATION] `[FEAT]` **Setup core routing, middleware, or pipeline runner structure**
  - **Context & Goal**: Create the base execution harness or API router that individual user stories will plug into.
  - **Target Files**: `src/index.ts`, `src/pipeline/runner.ts` (or `src/api/router.ts`)
  - **Technical Constraints**: Depends on `T004`, `T005`. Keep decoupled from story-specific business logic.
  - **Acceptance Criteria (DoD)**:
    - [ ] Base runner/router initializes cleanly and wires up global error handling from `T005`.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [Exact command or workflow to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] **T007** [P] [US1] `[TEST]` **Contract test for [US1 endpoint/module]**
  - **Context & Goal**: Validate input/output schemas for [US1] against the formal specification in `contracts/`.
  - **Target Files**: `tests/contract/test_[name].ts`
  - **Technical Constraints**: Do not make live external network calls; validate strictly against contract schemas.
  - **Acceptance Criteria (DoD)**:
    - [ ] Valid payloads pass and invalid payloads are rejected with expected error codes.
    - [ ] Test fails prior to `T009`/`T010` implementation.

- [ ] **T008** [P] [US1] `[TEST]` **Integration test for [US1 user journey]**
  - **Context & Goal**: Verify end-to-end execution of User Story 1 including primary edge cases and fallback behavior.
  - **Target Files**: `tests/integration/test_[name].ts`
  - **Technical Constraints**: Mock external APIs using deterministic local fixtures; never hit paid or rate-limited external APIs during automated tests.
  - **Acceptance Criteria (DoD)**:
    - [ ] Covers happy path and main failure/fallback scenarios defined in `spec.md`.
    - [ ] Test fails prior to `T010`/`T011` implementation.

### Implementation for User Story 1

- [ ] **T009** [P] [US1] `[FEAT]` **Create [Entity1] and [Entity2] domain models/adapters**
  - **Context & Goal**: Implement specific data structures and transformation logic required exclusively by User Story 1.
  - **Target Files**: `src/models/[entity1].ts`, `src/models/[entity2].ts`
  - **Technical Constraints**: Depends on `T004`. Must enforce all validation constraints listed in `data-model.md`.
  - **Acceptance Criteria (DoD)**:
    - [ ] Models serialize/deserialize accurately without data loss.
    - [ ] Invalid states throw structured validation errors.

- [ ] **T010** [US1] `[FEAT]` **Implement [Service/Provider] core business logic**
  - **Context & Goal**: Execute the primary functional workflow for User Story 1 according to `plan.md`.
  - **Target Files**: `src/services/[service].ts`
  - **Technical Constraints**: Depends on `T005`, `T009`. Implement retry/fallback rules and local caching as specified in `research.md` and project ADRs.
  - **Acceptance Criteria (DoD)**:
    - [ ] Service methods match signatures in `contracts/`.
    - [ ] Edge cases (empty responses, timeouts, malformed input) are handled gracefully.

- [ ] **T011** [US1] `[FEAT]` **Implement [Endpoint / CLI Command / Pipeline Step] for User Story 1**
  - **Context & Goal**: Expose `src/services/[service].ts` through the application interface and wire logging/validation.
  - **Target Files**: `src/[location]/[file].ts`
  - **Technical Constraints**: Depends on `T006`, `T010`. Validate all inputs at the boundary before invoking the service layer.
  - **Acceptance Criteria (DoD)**:
    - [ ] End-to-end execution of US1 passes the Independent Test criteria.
    - [ ] Structured logs record operation start, key outcomes, and error states.
    - [ ] All tests in `T007` and `T008` (if included) pass.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [Exact command or workflow to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] **T012** [P] [US2] `[TEST]` **Contract & integration tests for [US2 workflow]**
  - **Context & Goal**: Verify User Story 2 contract compliance and independent user journey execution.
  - **Target Files**: `tests/contract/test_[us2_name].ts`, `tests/integration/test_[us2_name].ts`
  - **Technical Constraints**: Use local mocks/fixtures; ensure test isolation from US1 state.
  - **Acceptance Criteria (DoD)**:
    - [ ] Tests cover US2 acceptance scenarios from `spec.md` and fail before implementation.

### Implementation for User Story 2

- [ ] **T013** [P] [US2] `[FEAT]` **Create [Entity] model for User Story 2**
  - **Context & Goal**: Add data structures required to support User Story 2 operations.
  - **Target Files**: `src/models/[us2_entity].ts`
  - **Technical Constraints**: Follow `data-model.md` specifications. Do not introduce breaking changes to US1 models.
  - **Acceptance Criteria (DoD)**:
    - [ ] Entity validations and types match `data-model.md`.

- [ ] **T014** [US2] `[FEAT]` **Implement [Service] for User Story 2**
  - **Context & Goal**: Build the core logic for User Story 2 and integrate with shared foundational utilities.
  - **Target Files**: `src/services/[us2_service].ts`
  - **Technical Constraints**: Depends on `T013`. Reuse caching and error handling from Phase 2 (`T005`).
  - **Acceptance Criteria (DoD)**:
    - [ ] Service fulfills US2 functional requirements without breaking US1 standalone functionality.

- [ ] **T015** [US2] `[FEAT]` **Implement [Endpoint / Feature] and integrate with User Story 1 (if needed)**
  - **Context & Goal**: Expose User Story 2 functionality and connect with US1 components where specified in `plan.md`.
  - **Target Files**: `src/[location]/[us2_file].ts`
  - **Technical Constraints**: Depends on `T014`. Maintain loose coupling so US1 and US2 remain independently testable.
  - **Acceptance Criteria (DoD)**:
    - [ ] User Story 2 passes its Independent Test criteria.
    - [ ] User Story 1 regression check continues to pass.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [Exact command or workflow to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] **T016** [P] [US3] `[TEST]` **Contract & integration tests for [US3 workflow]**
  - **Context & Goal**: Validate User Story 3 contract and end-to-end behavior.
  - **Target Files**: `tests/integration/test_[us3_name].ts`
  - **Technical Constraints**: Mock external dependencies; test edge cases defined in `spec.md`.
  - **Acceptance Criteria (DoD)**:
    - [ ] Tests verify all US3 acceptance criteria and fail prior to implementation.

### Implementation for User Story 3

- [ ] **T017** [P] [US3] `[FEAT]` **Create [Entity] model for User Story 3**
  - **Context & Goal**: Define data models needed for User Story 3.
  - **Target Files**: `src/models/[us3_entity].ts`
  - **Technical Constraints**: Adhere to `data-model.md`.
  - **Acceptance Criteria (DoD)**:
    - [ ] Model types and validations are complete and exported.

- [ ] **T018** [US3] `[FEAT]` **Implement [Service] and [Endpoint/Feature] for User Story 3**
  - **Context & Goal**: Deliver the complete User Story 3 capability and wire into the main application.
  - **Target Files**: `src/services/[us3_service].ts`, `src/[location]/[us3_file].ts`
  - **Technical Constraints**: Depends on `T017`. Must respect all project ADRs and performance constraints.
  - **Acceptance Criteria (DoD)**:
    - [ ] User Story 3 passes its Independent Test criteria.
    - [ ] Previous user stories (US1, US2) remain unaffected.

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] **TXXX** [P] [POLISH] `[DOCS]` **Update documentation and ADRs**
  - **Context & Goal**: Synchronize project documentation with final implementation details, environment variables, and architectural decisions.
  - **Target Files**: `README.md`, `docs/adr/`
  - **Technical Constraints**: Keep examples copy-pasteable and aligned with `quickstart.md`.
  - **Acceptance Criteria (DoD)**:
    - [ ] All new configuration options and commands are documented.

- [ ] **TXXX** [POLISH] `[REFACTOR]` **Code cleanup, dead-code removal, and performance optimization**
  - **Context & Goal**: Eliminate duplication across stories, optimize hot paths, and ensure strict adherence to linting rules.
  - **Target Files**: `src/`
  - **Technical Constraints**: Do not alter public API contracts or break existing tests.
  - **Acceptance Criteria (DoD)**:
    - [ ] Linter, typechecker, and full test suite pass with zero warnings/errors.

- [ ] **TXXX** [P] [POLISH] `[TEST]` **Additional unit tests for edge cases and security hardening**
  - **Context & Goal**: Increase coverage on complex utility functions, input sanitization, and boundary conditions.
  - **Target Files**: `tests/unit/`
  - **Technical Constraints**: Fast execution (<1s per test file), zero I/O or network calls.
  - **Acceptance Criteria (DoD)**:
    - [ ] All edge cases listed in `spec.md` have corresponding unit assertions.

- [ ] **TXXX** [POLISH] `[CHORE]` **Run quickstart.md end-to-end validation**
  - **Context & Goal**: Verify that a developer or agent following `quickstart.md` from scratch achieves the expected result.
  - **Target Files**: `specs/[###-feature-name]/quickstart.md`
  - **Technical Constraints**: Run in a clean environment state.
  - **Acceptance Criteria (DoD)**:
    - [ ] Every command in `quickstart.md` executes cleanly and produces the documented output.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked `[P]` can run in parallel
- All Foundational tasks marked `[P]` can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked `[P]` can run in parallel
- Models within a story marked `[P]` can run in parallel
- Different user stories can be worked on in parallel by different team members or sub-agents

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task T007: "Contract test for [US1 endpoint/module] in tests/contract/test_[name].ts"
Task T008: "Integration test for [US1 user journey] in tests/integration/test_[name].ts"

# Launch parallel model creation for User Story 1:
Task T009: "Create [Entity1] and [Entity2] domain models/adapters in src/models/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers or parallel AI agents:

1. Complete Setup + Foundational together
2. Once Foundational is done:
   - Developer / Agent A: User Story 1
   - Developer / Agent B: User Story 2
   - Developer / Agent C: User Story 3
3. Stories complete and integrate independently

---

## GitHub Issues Export Guide (Optional)

Each task block (`- [ ] **T###** ...`) is formatted to map 1:1 to a GitHub Issue via `gh issue create`:

- **Issue Title**: `[T###] [Story] [TYPE] Short Imperative Title`
- **Issue Body**: The 4 sub-bullets (`Context & Goal`, `Target Files`, `Technical Constraints`, `Acceptance Criteria (DoD)`).
- **Labels**: Map from `[TYPE]` (`feat`, `bug`, `chore`, `test`, `docs`, `refactor`) and `[Story]` (`US1`, `P1`, etc.).

---

## Notes

- `[P]` tasks = different files, no unfinished blocking dependencies
- `[Story]` label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group (referencing `T###` or `#issue_id`)
- Stop at any checkpoint to validate story independently
- Avoid: single-line vague tasks, same file conflicts in parallel tasks, cross-story dependencies that break independence