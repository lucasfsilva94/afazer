# Contrato de UI

Identificadores que o código e os testes usam. Grafia sempre `aFazer`.

- **Cabeçalho (sidebar)**: duas imagens dentro de `.brand`, `img.logo-light` e `img.logo-dark`. A visível para o tema ativo tem `alt="aFazer"`; a outra tem `alt=""`.
- **Cabeçalho mobile**: `.brand-mini` com o símbolo, `aria-hidden`.
- **Aba**: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` em `index.html`.
- **Título**: `<title>aFazer — sua lista de tarefas</title>`; o fallback do `h1` no `Layout.tsx` é `aFazer`.
- **Arquivos**: nomes de `assets/logo/` conforme o `data-model.md`.
