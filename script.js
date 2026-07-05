let selectedCategory = "Todos";
let selectedPriority = "Todas";
let selectedStatus = "Todos";
let searchText = "";

const grid = document.getElementById("giftGrid");
const count = document.getElementById("count");
const totalCount = document.getElementById("totalCount");
const availableCount = document.getElementById("availableCount");
const reservedCount = document.getElementById("reservedCount");
const boughtCount = document.getElementById("boughtCount");
const search = document.getElementById("search");
const chips = document.getElementById("chips");
const priorityFilter = document.getElementById("priorityFilter");
const statusFilter = document.getElementById("statusFilter");

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function categories() {
  return ["Todos", ...new Set(window.GIFTS.map(gift => gift.categoria))];
}

function estado(gift) {
  return gift.estado || (gift.reservado ? "Reservado" : "Disponible");
}

function isBlocked(gift) {
  return ["Reservado", "Comprado"].includes(estado(gift));
}

function mercadoLibreUrl(gift) {
  const query = encodeURIComponent(gift.busqueda || gift.nombre).replaceAll("%20", "-");
  return MERCADO_LIBRE_BASE + query;
}

function buyUrl(gift) {
  return gift.linkCompra && gift.linkCompra.trim() ? gift.linkCompra : mercadoLibreUrl(gift);
}

function reserveUrl(gift) {
  const message = encodeURIComponent(`Hola Fede. Quiero regalarle a Martina: ${gift.nombre}. ¿Sigue disponible?`);
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${message}` : `https://wa.me/?text=${message}`;
}

function renderChips() {
  chips.innerHTML = categories().map(category => `
    <button class="chip ${category === selectedCategory ? "active" : ""}" data-category="${category}">${category}</button>
  `).join("");

  chips.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      selectedCategory = chip.dataset.category;
      render();
    });
  });
}

function giftMatches(gift) {
  const haystack = normalize(`${gift.nombre} ${gift.categoria} ${gift.descripcion} ${gift.edad} ${gift.prioridad} ${(gift.caracteristicas || []).join(" ")}`);
  return (selectedCategory === "Todos" || gift.categoria === selectedCategory)
    && (selectedPriority === "Todas" || gift.prioridad === selectedPriority)
    && (selectedStatus === "Todos" || estado(gift) === selectedStatus)
    && (!searchText || haystack.includes(normalize(searchText)));
}

function imageMarkup(gift) {
  if (gift.imagen && gift.imagen.trim()) {
    return `<img src="${gift.imagen}" alt="${gift.nombre}" loading="lazy" />`;
  }
  return `<div class="gift-icon" aria-hidden="true">${gift.icono || "🎁"}</div>`;
}

function statusClass(gift) {
  const e = normalize(estado(gift));
  if (e === "reservado") return "card--reserved";
  if (e === "comprado") return "card--bought";
  return "";
}

function priorityLabel(priority) {
  if (priority === "Alta") return "Muy deseado";
  if (priority === "Media") return "Buena idea";
  return "Opcional";
}

function updateSummary() {
  totalCount.textContent = window.GIFTS.length;
  availableCount.textContent = window.GIFTS.filter(g => estado(g) === "Disponible").length;
  reservedCount.textContent = window.GIFTS.filter(g => estado(g) === "Reservado").length;
  boughtCount.textContent = window.GIFTS.filter(g => estado(g) === "Comprado").length;
}

function render() {
  renderChips();
  updateSummary();
  const gifts = window.GIFTS.filter(giftMatches);
  count.textContent = gifts.length;

  if (!gifts.length) {
    grid.innerHTML = `<div class="empty">No encontramos regalos con esos filtros.</div>`;
    return;
  }

  grid.innerHTML = gifts.map(gift => {
    const blocked = isBlocked(gift);
    const giftStatus = estado(gift);
    return `
    <article class="card ${statusClass(gift)}" aria-label="${gift.nombre}: ${giftStatus}">
      ${blocked ? `<div class="reserved-ribbon">${giftStatus}</div>` : ""}
      <div class="card__image">${imageMarkup(gift)}</div>
      <div class="card__body">
        <div class="card__top">
          <span class="category">${gift.categoria}</span>
          <span class="status status--${normalize(giftStatus)}">${giftStatus}</span>
        </div>
        <h3>${gift.nombre}</h3>
        <p class="description">${gift.descripcion}</p>
        <div class="meta">
          <span class="badge badge--priority">${priorityLabel(gift.prioridad)}</span>
          <span class="badge">${gift.edad}</span>
          <span class="badge">${gift.precio}</span>
        </div>
        <details class="features" open>
          <summary>Características necesarias</summary>
          <ul>${(gift.caracteristicas || []).map(item => `<li>${item}</li>`).join("")}</ul>
        </details>
      </div>
      <div class="card__actions">
        <a class="searchlink" href="${buyUrl(gift)}" target="_blank" rel="noopener">Cómo comprar</a>
        ${blocked
          ? `<button class="reserve reserve--disabled" type="button" disabled>${giftStatus}</button>`
          : `<a class="reserve" href="${reserveUrl(gift)}" target="_blank" rel="noopener">Quiero regalar este</a>`}
      </div>
    </article>`;
  }).join("");
}

search.addEventListener("input", event => { searchText = event.target.value; render(); });
priorityFilter.addEventListener("change", event => { selectedPriority = event.target.value; render(); });
statusFilter.addEventListener("change", event => { selectedStatus = event.target.value; render(); });

render();
