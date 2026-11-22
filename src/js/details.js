import { fetchLaptops, getLaptopById } from "./api.js";
import { getTheme, setTheme, isFavorite, toggleFavorite, addFavorite, addPendingCompare } from "./storage.js";

const detailsContainer = document.getElementById("details-container");
const notFoundMessage = document.getElementById("not-found-message");

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

function renderSpecRow(label, value) {
  return `
    <tr class="border-b">
      <td class="py-2 font-medium">${label}</td>
      <td class="py-2">${value}</td>
    </tr>
  `;
}

function renderDetails(laptop) {
  const favorited = isFavorite(laptop.id);

  detailsContainer.innerHTML = `
    <div class="laptop-card p-6">
      <div class="flex flex-col sm:flex-row gap-6">
        <img src="${laptop.image}" alt="${laptop.name}" class="w-full sm:w-64 h-48 object-cover rounded-lg" />
        <div class="flex-1">
          <h2 class="text-2xl font-bold">${laptop.name}</h2>
          <p class="text-sm text-gray-500">${laptop.brand} • ${laptop.category}</p>
          <p class="font-semibold text-xl mt-2">$${laptop.price}</p>
          <p class="mt-3">${laptop.description}</p>

          <div class="flex gap-3 mt-4">
            <button id="favorite-btn" class="btn-action">
              ${favorited ? "❤️ Remove Favorite" : "🤍 Add to Favorites"}
            </button>
            <button id="compare-btn" class="btn-action">
              ➕ Add to Compare
            </button>
          </div>
        </div>
      </div>

      <table class="w-full mt-6 text-left">
        <tbody>
          ${renderSpecRow("CPU", laptop.cpu)}
          ${renderSpecRow("RAM", laptop.ramGB + " GB")}
          ${renderSpecRow("Storage", laptop.storageGB + " GB")}
          ${renderSpecRow("Battery Life", laptop.batteryHours + " hours")}
          ${renderSpecRow("Weight", laptop.weightKg + " kg")}
          ${renderSpecRow("Screen Size", laptop.screenInches + " inches")}
        </tbody>
      </table>
    </div>
  `;

  const favoriteBtn = document.getElementById("favorite-btn");
  favoriteBtn.addEventListener("click", () => {
    const nowFavorited = toggleFavorite(laptop.id);
    favoriteBtn.innerHTML = nowFavorited ? "❤️ Remove Favorite" : "🤍 Add to Favorites";
  });

  const compareBtn = document.getElementById("compare-btn");
  compareBtn.addEventListener("click", () => {
    addFavorite(laptop.id);
    addPendingCompare(laptop.id);
    favoriteBtn.innerHTML = "❤️ Remove Favorite";
    compareBtn.textContent = "✓ Ready on Compare page";
  });
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const laptops = await fetchLaptops();
    const laptop = getLaptopById(laptops, id);

    if (!laptop) {
      notFoundMessage.textContent = "Laptop not found. It may have been removed or the link is incorrect.";
      notFoundMessage.classList.remove("hidden");
      return;
    }

    renderDetails(laptop);
  } catch (error) {
    notFoundMessage.textContent = "Could not load laptop details. Please try again.";
    notFoundMessage.classList.remove("hidden");
    console.error(error);
  }
}

setupThemeToggle();
setupMobileNav();
init();