/* =====================================
   COSMIC ATLAS — SISTEMA INTERATIVO
===================================== */

// Banco de dados dos objetos espaciais

const objects = [

  {
    id: "sun",
    name: "Sol",
    category: "Estrela",
    type: "Estrela anã amarela",
    distance: "0 UA",
    art: "sun",
    glow: "rgba(255,190,60,.35)",
    description: "Nossa estrela é o centro gravitacional do Sistema Solar. Sua energia sustenta grande parte dos processos que tornam a vida na Terra possível.",
    fact: "IDADE APROX.: 4,6 BILHÕES DE ANOS"
  },

  {
    id: "earth",
    name: "Terra",
    category: "Planeta",
    type: "Planeta rochoso",
    distance: "1 UA",
    art: "earth",
    glow: "rgba(50,150,255,.4)",
    description: "O único mundo conhecido até agora que abriga vida. Oceanos líquidos, uma atmosfera protetora e uma variedade impressionante de ambientes fazem deste planeta nosso lar.",
    fact: "DIÂMETRO: 12.742 KM"
  },

  {
    id: "mars",
    name: "Marte",
    category: "Planeta",
    type: "Planeta rochoso",
    distance: "1,52 UA",
    art: "mars",
    glow: "rgba(220,100,60,.35)",
    description: "O planeta vermelho tem vulcões gigantes, antigos vales e sinais de que água líquida já correu por sua superfície. É um dos principais alvos da exploração espacial.",
    fact: "DIA MARCIANO: 24 H 37 MIN"
  },

  {
    id: "saturn",
    name: "Saturno",
    category: "Planeta",
    type: "Gigante gasoso",
    distance: "9,58 UA",
    art: "saturn ringed",
    glow: "rgba(220,180,100,.35)",
    description: "Saturno é famoso por seu sistema de anéis, formado principalmente por partículas de gelo e rocha. É tão pouco denso, em média, que sua densidade é menor que a da água.",
    fact: "UM DOS MAIS IMPRESSIONANTES SISTEMAS DE ANÉIS"
  },

  {
    id: "nebula",
    name: "Nebulosa de Órion",
    category: "Nebulosa",
    type: "Nebulosa de emissão",
    distance: "~1.344 anos-luz",
    art: "nebula",
    glow: "rgba(180,80,255,.4)",
    description: "Uma região de gás e poeira onde novas estrelas estão nascendo. Pode ser observada a olho nu em condições favoráveis, como uma mancha difusa na constelação de Órion.",
    fact: "TAMBÉM CONHECIDA COMO M42"
  },

  {
    id: "andromeda",
    name: "Andrômeda",
    category: "Galáxia",
    type: "Galáxia espiral",
    distance: "~2,5 milhões de anos-luz",
    art: "andromeda",
    glow: "rgba(180,100,255,.4)",
    description: "A grande galáxia espiral mais próxima da Via Láctea. Ela contém centenas de bilhões de estrelas e, ao longo de bilhões de anos, deve interagir com nossa galáxia.",
    fact: "CATÁLOGO: M31"
  },

  {
    id: "pulsar",
    name: "Pulsar",
    category: "Estrela",
    type: "Estrela de nêutrons",
    distance: "Distância variável",
    art: "pulsar",
    glow: "rgba(100,200,255,.5)",
    description: "Um pulsar é uma estrela de nêutrons que emite feixes de radiação. Quando esses feixes apontam na direção da Terra, podem ser detectados como pulsos regulares.",
    fact: "ROTAÇÃO EXTREMAMENTE REGULAR"
  },

  {
    id: "moon",
    name: "Lua",
    category: "Planeta",
    type: "Satélite natural",
    distance: "384.400 km",
    art: "moon",
    glow: "rgba(200,200,200,.3)",
    description: "A companheira natural da Terra influencia as marés e apresenta fases que mudam conforme sua posição em relação ao planeta e ao Sol. Sua superfície guarda marcas de impactos antigos.",
    fact: "DISTÂNCIA MÉDIA: 384.400 KM"
  }

];

// =====================================
// SELEÇÃO DOS ELEMENTOS HTML
// =====================================

const grid = document.getElementById("objectGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("categoryFilters");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

const favoritesToggle = document.getElementById("favoritesToggle");
const favoritesCount = document.getElementById("favoritesCount");

const dialog = document.getElementById("objectDialog");
const dialogContent = document.getElementById("dialogContent");
const closeDialog = document.getElementById("closeDialog");

// =====================================
// ESTADOS DA APLICAÇÃO
// =====================================

let selectedCategory = "Todos";
let showingFavorites = false;

// Recupera favoritos salvos no navegador
let favorites = JSON.parse(
  localStorage.getItem("cosmicFavorites") || "[]"
);

// =====================================
// ATUALIZA CONTADOR DE FAVORITOS
// =====================================

function updateFavoriteCount() {

  favoritesCount.textContent = favorites.length;

  favoritesToggle.classList.toggle(
    "active",
    showingFavorites
  );

  favoritesToggle.setAttribute(
    "aria-pressed",
    String(showingFavorites)
  );

}

// =====================================
// SALVA FAVORITOS
// =====================================

function saveFavorites() {

  localStorage.setItem(
    "cosmicFavorites",
    JSON.stringify(favorites)
  );

  updateFavoriteCount();

}

// =====================================
// CRIA OS CARDS DO CATÁLOGO
// =====================================

function createCard(item) {

  const isSaved = favorites.includes(item.id);

  return `
    <article
      class="object-card"
      data-id="${item.id}"
      tabindex="0"
      aria-label="Ver detalhes de ${item.name}"
    >

      <div class="object-art">

        <div class="card-top">

          <span>ARQUIVO / ${item.id.toUpperCase()}</span>

          <button
            class="favorite ${isSaved ? "saved" : ""}"
            data-favorite="${item.id}"
            aria-label="${isSaved ? "Remover dos favoritos" : "Salvar nos favoritos"}"
          >
            ${isSaved ? "♥" : "♡"}
          </button>

        </div>

        <div
          class="celestial ${item.art}"
          style="--glow: ${item.glow}"
        ></div>

      </div>

      <div class="card-info">

        <div class="card-category">
          ${item.category.toUpperCase()}
        </div>

        <h3>${item.name}</h3>

        <p>${item.type}</p>

        <div class="card-bottom">

          <span>${item.distance}</span>
          <span class="arrow">↗</span>

        </div>

      </div>

    </article>
  `;

}

// =====================================
// RENDERIZA E FILTRA OS OBJETOS
// =====================================

function render() {

  const query = searchInput.value.trim().toLowerCase();

  // Aplica categoria, busca e favoritos simultaneamente
  let visible = objects.filter(item => {

    const matchesCategory =
      selectedCategory === "Todos" ||
      item.category === selectedCategory;

    const matchesSearch =
      `${item.name} ${item.category} ${item.type} ${item.description}`
      .toLowerCase()
      .includes(query);

    const matchesFavorite =
      !showingFavorites ||
      favorites.includes(item.id);

    return matchesCategory && matchesSearch && matchesFavorite;

  });

  // Atualiza o conteúdo do grid
  grid.innerHTML = visible.map(createCard).join("");

  // Atualiza contador
  resultCount.textContent =
    `${String(visible.length).padStart(2, "0")} OBJETO${visible.length === 1 ? "" : "S"} ENCONTRADO${visible.length === 1 ? "" : "S"}`;

  // Exibe mensagem caso nenhum objeto seja encontrado
  emptyState.hidden = visible.length !== 0;

}

// =====================================
// ADICIONA OU REMOVE FAVORITOS
// =====================================

function toggleFavorite(id) {

  if (favorites.includes(id)) {

    favorites = favorites.filter(
      favorite => favorite !== id
    );

  } else {

    favorites.push(id);

  }

  saveFavorites();
  render();

}

// =====================================
// ABRE A JANELA DE DETALHES
// =====================================

function showDetails(id) {

  const item = objects.find(
    object => object.id === id
  );

  if (!item) return;

  dialogContent.innerHTML = `

    <div class="dialog-art">

      <div
        class="celestial ${item.art}"
        style="--glow: ${item.glow}"
      ></div>

    </div>

    <div class="card-category">
      ${item.category.toUpperCase()} · ${item.type.toUpperCase()}
    </div>

    <h2>${item.name}</h2>

    <p>${item.description}</p>

    <div class="dialog-fact">
      ${item.fact}
    </div>

  `;

  dialog.showModal();

}

// =====================================
// EVENTO DE CLIQUE NOS CARDS
// =====================================

grid.addEventListener("click", function(event) {

  // Verifica se clicou no botão de favorito
  const favoriteButton = event.target.closest("[data-favorite]");

  if (favoriteButton) {

    event.stopPropagation();

    toggleFavorite(favoriteButton.dataset.favorite);

    return;

  }

  // Verifica se clicou em um card
  const card = event.target.closest(".object-card");

  if (card) {

    showDetails(card.dataset.id);

  }

});

// =====================================
// ACESSIBILIDADE: ENTER E ESPAÇO NOS CARDS
// =====================================

grid.addEventListener("keydown", function(event) {

  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target.classList.contains("object-card")
  ) {

    event.preventDefault();

    showDetails(event.target.dataset.id);

  }

});

// =====================================
// FILTROS DE CATEGORIA
// =====================================

filters.addEventListener("click", function(event) {

  const button = event.target.closest("[data-category]");

  if (!button) return;

  selectedCategory = button.dataset.category;

  // Atualiza o botão selecionado
  filters.querySelectorAll(".filter").forEach(filter => {

    filter.classList.toggle(
      "active",
      filter === button
    );

  });

  render();

});

// =====================================
// BUSCA EM TEMPO REAL
// =====================================

searchInput.addEventListener("input", render);

// =====================================
// MOSTRAR / ESCONDER FAVORITOS
// =====================================

favoritesToggle.addEventListener("click", function() {

  showingFavorites = !showingFavorites;

  updateFavoriteCount();
  render();

});

// =====================================
// FECHAR MODAL
// =====================================

closeDialog.addEventListener("click", function() {

  dialog.close();

});

// Fecha ao clicar fora da janela
dialog.addEventListener("click", function(event) {

  if (event.target === dialog) {

    dialog.close();

  }

});

// =====================================
// ATALHO DE TECLADO CTRL + K
// =====================================

document.addEventListener("keydown", function(event) {

  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k"
  ) {

    event.preventDefault();

    searchInput.focus();

  }

});

// =====================================
// INICIALIZAÇÃO
// =====================================

updateFavoriteCount();
render();