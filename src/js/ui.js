import { isFavorite } from "./storage.js";

export function renderLaptopCard(laptop) {
  const favorited = isFavorite(laptop.id);

  return `
    <article class="laptop-card" data-id="${laptop.id}">
      <img src="${laptop.image}" alt="${laptop.name}" class="w-full h-40 object-cover rounded-t-lg" />
      <div class="p-4">
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-lg">${laptop.name}</h3>
          <button
            class="favorite-btn text-xl transition-transform hover:scale-125"
            data-id="${laptop.id}"
            aria-label="Toggle favorite"
          >
            ${favorited ? "❤️" : "🤍"}
          </button>
        </div>
        <p class="text-sm text-gray-500">${laptop.brand} • ${laptop.category}</p>
        <p class="font-semibold mt-1">$${laptop.price}</p>
        <ul class="text-sm mt-2 space-y-1">
          <li>${laptop.cpu}</li>
          <li>${laptop.ramGB}GB RAM • ${laptop.storageGB}GB Storage</li>
          <li>${laptop.batteryHours}h battery • ${laptop.weightKg}kg</li>
        </ul>
        <a
          href="details.html?id=${laptop.id}"
          class="btn-action mt-3 inline-block"
        >
          View Details
        </a>
      </div>
    </article>
  `;
}

export function renderLaptopCards(laptops) {
  return laptops.map(renderLaptopCard).join("");
}

export function renderSkeletonCard() {
  return `
    <div class="laptop-card animate-pulse">
      <div class="w-full h-40 bg-gray-300 rounded-t-lg"></div>
      <div class="p-4 space-y-2">
        <div class="h-4 bg-gray-300 rounded w-3/4"></div>
        <div class="h-3 bg-gray-300 rounded w-1/2"></div>
        <div class="h-3 bg-gray-300 rounded w-1/3"></div>
        <div class="h-3 bg-gray-300 rounded w-full"></div>
        <div class="h-8 bg-gray-300 rounded w-1/2 mt-2"></div>
      </div>
    </div>
  `;
}

export function renderSkeletonCards(count = 6) {
  let html = "";
  for (let i = 0; i < count; i++) {
    html += renderSkeletonCard();
  }
  return html;
}

export function attachFavoriteButtonListeners(container, onToggle) {
  container.querySelectorAll(".favorite-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      onToggle(id, btn);
    });
  });
}