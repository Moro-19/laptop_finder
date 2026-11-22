import { fetchLaptops } from "./api.js";
import { getTheme, setTheme, getFavorites, removeFavorite, clearFavorites, toggleFavorite } from "./storage.js";
import { renderLaptopCards, attachFavoriteButtonListeners } from "./ui.js";

let allLaptops = [];

const favoritesContainer = document.getElementById("favorites-container");
const emptyMessage = document.getElementById("empty-message");
const errorMessage = document.getElementById("error-message");
const statTotalCount = document.getElementById("stat-total-count");
const statTotalPrice = document.getElementById("stat-total-price");
const statAvgPrice = document.getElementById("stat-avg-price");
const clearBtn = document.getElementById("clear-favorites-btn");

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

function getFavoriteLaptops() {
  const favoriteIds = getFavorites();
  return allLaptops.filter((laptop) => favoriteIds.includes(laptop.id));
}

function updateStats(favoriteLaptops) {
  statTotalCount.textContent = favoriteLaptops.length;

  if (favoriteLaptops.length === 0) {
    statTotalPrice.textContent = "$0";
    statAvgPrice.textContent = "$0";
    return;
  }

  const total = favoriteLaptops.reduce((sum, laptop) => sum + laptop.price, 0);
  const average = total / favoriteLaptops.length;

  statTotalPrice.textContent = `$${total.toFixed(0)}`;
  statAvgPrice.textContent = `$${average.toFixed(0)}`;
}

function renderFavorites() {
  const favoriteLaptops = getFavoriteLaptops();
  updateStats(favoriteLaptops);

  if (favoriteLaptops.length === 0) {
    favoritesContainer.innerHTML = "";
    emptyMessage.classList.remove("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");
  favoritesContainer.innerHTML = renderLaptopCards(favoriteLaptops);

  attachFavoriteButtonListeners(favoritesContainer, (id) => {
    toggleFavorite(id);
    renderFavorites();
  });

  favoritesContainer.querySelectorAll(".laptop-card").forEach((card) => {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn-action mt-2 w-full";
    removeBtn.addEventListener("click", () => {
      const id = card.dataset.id;
      removeFavorite(id);
      renderFavorites();
    });
    card.querySelector(".p-4").appendChild(removeBtn);
  });
}

function setupClearButton() {
  clearBtn.addEventListener("click", () => {
    clearFavorites();
    renderFavorites();
  });
}

async function init() {
  try {
    allLaptops = await fetchLaptops();
    renderFavorites();
    setupClearButton();
  } catch (error) {
    errorMessage.textContent = "Could not load favorites. Please try again.";
    errorMessage.classList.remove("hidden");
    console.error(error);
  }
}

setupThemeToggle();
setupMobileNav();
init();