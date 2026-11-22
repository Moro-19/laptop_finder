const DATA_URL = "data/laptops.json";

export async function fetchLaptops() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Failed to load laptops (status ${response.status})`);
    }

    const laptops = await response.json();
    return laptops;
  } catch (error) {
    throw new Error("Could not load laptop data: " + error.message);
  }
}

export function getLaptopById(laptops, id) {
  return laptops.find((laptop) => laptop.id === Number(id));
}