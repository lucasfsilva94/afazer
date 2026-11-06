# Pesquisa: spec 005

## Onde o selo fica

- **Decisão**: tratar o selo como um elemento fixo no canto inferior direito, de cerca de 40 px, fora do nosso controle.
- **Razão**: o Netlify injeta o selo no plano gratuito e não dá para removê-lo (FR-003). Não há API para medir o selo, então reservamos um valor fixo.
- **Alternativas**: medir o selo com `MutationObserver` (frágil, depende do DOM do Netlify); esconder com CSS (proibido pelo FR-003); mover o menu para o topo (muda a navegação).

## Faixa embaixo do menu

- **Decisão**: o menu cresce para baixo com padding e o selo fica sobre o fundo do menu.
- **Razão**: sem vão visível e sem sobreposição; os itens ficam acima do selo.
- **Alternativas**: subir o menu com `bottom` (deixa uma fresta de conteúdo por baixo dele); selo à esquerda (não controlamos).

## Ligar a reserva só em produção

- **Decisão**: `document.documentElement.dataset.badge` em `src/main.tsx` quando `import.meta.env.PROD`.
- **Razão**: em desenvolvimento não há selo e o menu não deve ter vão (FR-010).
- **Alternativas**: sempre reservar (vão no dev); detectar o selo no DOM (frágil).

## Títulos colados

- **Decisão**: trocar a regra `.sec-head:first-child{margin-top:0}` por espaço entre blocos (`section + section` e `.capture + section`).
- **Razão**: a regra zera a margem de todo título de seção, pois cada um é o primeiro filho do seu `<section>`.
- **Alternativas**: padding em cada página (repete em seis telas).
