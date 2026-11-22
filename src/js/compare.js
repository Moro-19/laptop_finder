import { fetchLaptops } from "./api.js";
import { getTheme, setTheme, getFavorites } from "./storage.js";

let favoriteLaptops = [];
let selectedIds = [];

const pickerContainer = document.getElementById("picker-container");
const selectMessage = document.getElementById("select-message");
const noFavoritesMessage = document.getElementById("no-favorites-message");
const tableWrapper = document.getElementById("compare-table-wrapper");

const MAX_SELECTED = 4;
const MIN_SELECTED = 2;

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

function renderPicker() {
  pickerContainer.innerHTML = favoriteLaptops
    .map((laptop) => {
      const isSelected = selectedIds.includes(laptop.id);
      return `
        <button
          class="picker-btn px-3 py-2 rounded-md border transition-colors ${
            isSelected ? "bg-battery-accent text-white" : "bg-white"
          }"
          data-id="${laptop.id}"
        >
          ${laptop.name}
        </button>
      `;
    })
    .join("");

  pickerContainer.querySelectorAll(".picker-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      toggleSelection(id);
    });
  });
}

function toggleSelection(id) {
  if (selectedIds.includes(id)) {
    selectedIds = selectedIds.filter((selectedId) => selectedId !== id);
    selectMessage.classList.add("hidden");
  } else {
    if (selectedIds.length >= MAX_SELECTED) {
      selectMessage.textContent = `You can only compare up to ${MAX_SELECTED} laptops. Remove one first.`;
      selectMessage.classList.remove("hidden");
      return;
    }
    selectedIds.push(id);
    selectMessage.classList.add("hidden");
  }

  renderPicker();
  renderComparisonTable();
}

function getBestValueMap(laptopsToCompare) {
  const best = {};

  best.price = Math.min(...laptopsToCompare.map((l) => l.price));
  best.weightKg = Math.min(...laptopsToCompare.map((l) => l.weightKg));
  best.ramGB = Math.max(...laptopsToCompare.map((l) => l.ramGB));
  best.storageGB = Math.max(...laptopsToCompare.map((l) => l.storageGB));
  best.batteryHours = Math.max(...laptopsToCompare.map((l) => l.batteryHours));

  return best;
}

function renderComparisonTable() {
  if (selectedIds.length < MIN_SELECTED) {
    tableWrapper.innerHTML = `<p class="text-center mt-6">Select at least ${MIN_SELECTED} laptops to compare.</p>`;
    return;
  }

  const laptopsToCompare = favoriteLaptops.filter((laptop) => selectedIds.includes(laptop.id));
  const best = getBestValueMap(laptopsToCompare);

  const rows = [
    { label: "Price", key: "price", format: (v) => `$${v}` },
    { label: "CPU", key: "cpu", format: (v) => v },
    { label: "RAM", key: "ramGB", format: (v) => `${v} GB` },
    { label: "Storage", key: "storageGB", format: (v) => `${v} GB` },
    { label: "Battery Life", key: "batteryHours", format: (v) => `${v} hours` },
    { label: "Weight", key: "weightKg", format: (v) => `${v} kg` },
  ];

  const headerCells = laptopsToCompare
    .map((laptop) => `<th class="p-3 text-left">${laptop.name}</th>`)
    .join("");

  const bodyRows = rows
    .map((row) => {
      const cells = laptopsToCompare
        .map((laptop) => {
          const value = laptop[row.key];
          const isBest = best[row.key] !== undefined && value === best[row.key];
          return `<td class="p-3 ${isBest ? "font-bold bg-battery-accent/20" : ""}">${row.format(value)}</td>`;
        })
        .join("");
      return `
        <tr class="border-b">
          <td class="p-3 font-medium">${row.label}</td>
          ${cells}
        </tr>
      `;
    })
    .join("");

  tableWrapper.innerHTML = `
    <table class="w-full laptop-card">
      <thead>
        <tr class="border-b">
          <th class="p-3 text-left">Spec</th>
          ${headerCells}
        </tr>
      </thead>
      <tbody>
        ${bodyRows}
      </tbody>
    </table>
  `;
}

async function init() {
  try {
    const allLaptops = await fetchLaptops();
    const favoriteIds = getFavorites();
    favoriteLaptops = allLaptops.filter((laptop) => favoriteIds.includes(laptop.id));

    if (favoriteLaptops.length === 0) {
      noFavoritesMessage.classList.remove("hidden");
      return;
    }

    selectedIds = favoriteLaptops.slice(0, MIN_SELECTED).map((l) => l.id);

    renderPicker();
    renderComparisonTable();
  } catch (error) {
    tableWrapper.innerHTML = `<p class="text-red-600">Could not load comparison data.</p>`;
    console.error(error);
  }
}

setupThemeToggle();
setupMobileNav();
init();