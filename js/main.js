/**
 * Retornar um elemento HTML.
 * 
 * @param {string} selector Seletor do elemento DOM.
 * 
 * @returns {HTMLElement | null}
 */
function getElement(selector) {
  return document.querySelector(selector);
}

/**
 * Adiciona evento de `hover` no elemento especificado.
 * 
 * @param {HTMLElement} element Elemento HTML
 * @param {Function} callback Função de callback
 * 
 * @returns {void}
 */
function addHoverEventToElement(element, callback) {
  if (typeof callback !== 'function') return;
  element.addEventListener('mouseenter', () => callback('mouseenter'));
  element.addEventListener('mouseleave', () => callback('mouseleave'));
}

/**
 * Adiciona evento de `click` no elemento e chama `callback` quando o elemento é clicado.
 * 
 * @param {HTMLElement} element Elemento HTML
 * @param {Function} callback Função de callback
 * 
 * @returns {void}
 */
function addClickEventToElement(element, callback) {
  if (typeof callback !== 'function') return;
  element.addEventListener('click', () => callback());
}

/**
 * Cria uma elemento HTML baseado no parâmetro `options.element`.
 * 
 * @param {object}    options           Opções do elemento
 * @param {string}    options.element   Nome do elemento HTML.
 * @param {string[]}  options.classes   Lista de classes do elemento.
 * @param {string}    options.text      Texto do elemento.
 * 
 * @returns {HTMLElement}
 */
function createElement({ element, classes = [], text = '' }) {
  const el = document.createElement(element);
  if (classes.length) el.classList.add(...classes);
  el.textContent = text;
  return el;
}

/**
 * Transforma o menu do formato vertical para o formato horizontal removendo
 * classe `btn-group-vertical` do elemento alvo.
 */
function transformMenuToHorizontal() {
  const menuElement = getElement('.btn-group-vertical');
  menuElement.classList.remove('btn-group-vertical');
}

/**
 * Estiliza a seção header para o formato desejado removendo e adicionado
 * classes adequadas.
 */
function transformHeaderSection() {
  const jumbotron = getElement('.jumbotron');
  const button = getElement('.jumbotron .btn.btn-primary');
  jumbotron.classList.add('bg-secondary', 'text-white', 'text-right');
  button.classList.remove('btn-primary');
  button.classList.add('btn-success');
}

/**
 * Altera comportamento de elementos dentro da seção de `.cards` adicionando
 * evento de `hover` aos botões bem como altera a ordem dos cards.
 */
function transformCardsSection() {
  const cardsContainer = document.querySelectorAll(".container > .row").item(2);
  for (const btn of cardsContainer.querySelectorAll(".btn").values()) {
    addHoverEventToElement(btn, () => btn.classList.toggle("btn-success"));
  }
  // [animais, tec, pessoas, natureza]
  const cards = Array.from(cardsContainer.querySelectorAll(".col-lg-3").values());

  // first: remove elements
  cards.forEach(el => el.remove());

  // second: add in correctly order
  [cards[3], cards[0], cards[2], cards[1]].forEach(el => cardsContainer.appendChild(el));
}

/**
 * Altera comportamento da seção `.list-group` adicionando eventos
 * de `click` e `hover` bem como uma lógica de renderização de elementos.
 * 
 * A renderização é baseado no estado (state) que ao clicar em algum elemento
 * da lista é disparada a renderização para que o novo elemento selecionado fique
 * ativo.
 */
function transformListGroup() {
  const context = getElement('.list-group');
  const state = { selectedItem: 0 };

  function renderListGroup() {
    for (const [i, li] of context.querySelectorAll('li').entries()) {
      li.classList.remove('active');
      if (state.selectedItem === i) li.classList.add('active');
    }
  }

  // add new items
  const liParams = { element: 'li', classes: ['list-group-item'] };
  context.appendChild(createElement({ ...liParams, text: 'Quarto item' }))
  context.appendChild(createElement({ ...liParams, text: 'Quinto item' }))

  // event handlers
  for (const [i, li] of context.querySelectorAll('li').entries()) {
    // add click handler
    addClickEventToElement(li, () => {
      state.selectedItem = i;
      renderListGroup();
    });

    // add hover handler
    addHoverEventToElement(li, (eventType) => {
      if (eventType === 'mouseenter') li.classList.add('active')
      else if (state.selectedItem !== i) li.classList.remove('active');
    });
  }

  // first render
  renderListGroup();
}

/**
 * Função para iniciar fluxo de alteração de comportamento e lógica das secões.
 */
function startup() {
  transformMenuToHorizontal();
  transformHeaderSection();
  transformCardsSection();
  transformListGroup();
} 

document.addEventListener('DOMContentLoaded', startup);