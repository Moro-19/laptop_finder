import { fetchLaptops } from "./api.js";
import { getTheme, setTheme, toggleFavorite } from "./storage.js";
import { renderLaptopCards, renderSkeletonCards, attachFavoriteButtonListeners } from "./ui.js";

let allLaptops = [];

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const maxPriceFilter = document.getElementById("max-price-filter");
const minRamFilter = document.getElementById("min-ram-filter");
const sortSelect = document.getElementById("sort-select");
const cardsContainer = document.getElementById("cards-container");
const resultCount = document.getElementById("result-count");
const noResults = document.getElementById("no-results");
const errorMessage = document.getElementById("error-message");

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
}

function setupThemeToggle() {
  applyTheme(getTheme());
  [document.getElementById("theme-toggle"), document.getElementById("theme-toggle-mobile")].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const newTheme = getTheme() === "performance" ? "battery-saver" : "performance";
      setTheme(newTheme);
      applyTheme(newTheme);
    });
  });
}

function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  toggle.addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");
    mobileNav.classList.toggle("flex");
  });
}

function parseNumberOrNull(rawValue) {
  const trimmed = rawValue.trim();
  if (trimmed === "") return null;
  const num = Number(trimmed);
  return Number.isNaN(num) ? null : num;
}

function getFilteredLaptops() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const maxPrice = parseNumberOrNull(maxPriceFilter.value);
  const minRam = parseNumberOrNull(minRamFilter.value);

  return allLaptops.filter((laptop) => {
    const matchesSearch =
      !searchTerm ||
      laptop.name.toLowerCase().includes(searchTerm) ||
      laptop.brand.toLowerCase().includes(searchTerm);

    const matchesCategory = !category || laptop.category === category;
    const matchesMaxPrice = maxPrice === null || laptop.price <= maxPrice;
    const matchesMinRam = minRam === null || laptop.ramGB >= minRam;

    return matchesSearch && matchesCategory && matchesMaxPrice && matchesMinRam;
  });
}

function getSortedLaptops(laptops) {
  const sortValue = sortSelect.value;
  if (!sortValue) return laptops;

  const sorted = [...laptops];
  const [field, direction] = sortValue.split("-");

  const fieldMap = {
    price: "price",
    battery: "batteryHours",
    weight: "weightKg",
  };

  const key = fieldMap[field];

  sorted.sort((a, b) => (direction === "asc" ? a[key] - b[key] : b[key] - a[key]));

  return sorted;
}

function renderResults() {
  const filtered = getFilteredLaptops();
  const sorted = getSortedLaptops(filtered);

  resultCount.textContent = `${sorted.length} laptop${sorted.length !== 1 ? "s" : ""} found`;

  if (sorted.length === 0) {
    cardsContainer.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");
  cardsContainer.innerHTML = renderLaptopCards(sorted);

  attachFavoriteButtonListeners(cardsContainer, (id, btn) => {
    const nowFavorited = toggleFavorite(id);
    btn.textContent = nowFavorited ? "❤️" : "🤍";
  });
}

function setupFilterListeners() {
  [searchInput, categoryFilter, maxPriceFilter, minRamFilter, sortSelect].forEach((el) => {
    el.addEventListener("input", renderResults);
    el.addEventListener("change", renderResults);
  });
}

async function init() {
  cardsContainer.innerHTML = renderSkeletonCards(6);

  try {
    allLaptops = await fetchLaptops();
    renderResults();
    setupFilterListeners();
  } catch (error) {
    cardsContainer.innerHTML = "";
    errorMessage.textContent = "Could not load laptops. Please check your connection and try again.";
    errorMessage.classList.remove("hidden");
    console.error(error);
  }
}

setupThemeToggle();
setupMobileNav();
init();