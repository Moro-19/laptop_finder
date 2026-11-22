import { fetchLaptops } from "./api.js";
import { getFavorites, getTheme, setTheme } from "./storage.js";

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
}

function setupThemeToggle() {
  const current = getTheme();
  applyTheme(current);

  const toggleButtons = [
    document.getElementById("theme-toggle"),
    document.getElementById("theme-toggle-mobile"),
  ];

  toggleButtons.forEach((btn) => {
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

async function loadStats() {
  try {
    const laptops = await fetchLaptops();
    const favorites = getFavorites();

    const minPrice = laptops.reduce(
      (min, laptop) => (laptop.price < min ? laptop.price : min),
      laptops[0].price
    );

    document.getElementById("stat-count").textContent = laptops.length;
    document.getElementById("stat-min-price").textContent = `$${minPrice}`;
    document.getElementById("stat-favorites").textContent = favorites.length;
  } catch (error) {
    document.getElementById("stat-count").textContent = "Error";
    console.error(error);
  }
}

setupThemeToggle();
setupMobileNav();
loadStats();