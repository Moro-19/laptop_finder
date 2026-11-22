const FAVORITES_KEY = "laptopFinderFavorites";
const THEME_KEY = "laptopFinderTheme";
const PENDING_COMPARE_KEY = "laptopFinderPendingCompare";

export function getFavorites() {
  const raw = localStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.includes(Number(id));
}

export function addFavorite(id) {
  const favorites = getFavorites();
  const numId = Number(id);
  if (!favorites.includes(numId)) {
    favorites.push(numId);
    saveFavorites(favorites);
  }
}

export function removeFavorite(id) {
  const favorites = getFavorites().filter((favId) => favId !== Number(id));
  saveFavorites(favorites);
}

export function toggleFavorite(id) {
  if (isFavorite(id)) {
    removeFavorite(id);
  } else {
    addFavorite(id);
  }
  return isFavorite(id);
}

export function clearFavorites() {
  saveFavorites([]);
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "battery-saver";
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function addPendingCompare(id) {
  const raw = localStorage.getItem(PENDING_COMPARE_KEY);
  const list = raw ? JSON.parse(raw) : [];
  const numId = Number(id);
  if (!list.includes(numId)) {
    list.push(numId);
    localStorage.setItem(PENDING_COMPARE_KEY, JSON.stringify(list));
  }
}

export function getAndClearPendingCompare() {
  const raw = localStorage.getItem(PENDING_COMPARE_KEY);
  const list = raw ? JSON.parse(raw) : [];
  localStorage.removeItem(PENDING_COMPARE_KEY);
  return list;
}