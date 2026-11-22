# Student Laptop Finder

A responsive web app built with vanilla JavaScript (ES Modules), Tailwind CSS 4, and localStorage. It helps students browse laptops, search and filter them, view full specifications, save favorites, and compare favorites side by side.

Course project for SW302 – User Interface Development.

## Pages

- index.html — Home page with live stats and theme switch
- laptops.html — Laptop catalogue with search, filters, and sorting
- details.html — Full specifications for a single laptop (?id=)
- favorites.html — Saved favorites with totals
- compare.html — Side-by-side comparison of 2–4 favorites

## Tech Stack

- Vanilla JavaScript (ES Modules, fetch, async/await, localStorage)
- Tailwind CSS 4 (installed locally via npm, no CDN)
- @tailwindcss/forms plugin

## Setup Instructions

1. Clone the repository:
   git clone <your-repo-url>
   cd laptop_finder_yourname

2. Install dependencies:
   npm install

3. Build the Tailwind CSS file:
   npm run build:css

   This watches src/input.css and generates dist/output.css. Keep this running while you work.

4. Run the project with a local server (fetch() requires this — it will not work by opening the HTML files directly). In VS Code, install the Live Server extension, then right-click index.html and choose Open with Live Server.

## Project Structure

laptop_finder_yourname/
- index.html
- laptops.html
- details.html
- favorites.html
- compare.html
- src/input.css
- src/js/api.js
- src/js/storage.js
- src/js/ui.js
- src/js/compare.js
- src/js/index.js
- src/js/laptops.js
- src/js/details.js
- src/js/favorites.js
- data/laptops.json
- dist/output.css
- assets/
- package.json
- README.md

## Features

- 22 laptops stored in data/laptops.json, loaded via fetch()
- Live search by name/brand, category filter, max price filter, minimum RAM filter
- Sorting by price, battery life, and weight (both directions)
- Favorites saved to localStorage, synced across all pages
- Comparison tool highlighting the best value per spec (lowest price/weight, highest RAM/storage/battery)
- Two custom themes (Performance Mode, Battery Saver Mode) defined with Tailwind's @theme, persisted in localStorage
- Responsive layout (mobile, tablet, desktop) with a collapsing navigation menu

## GitHub Repository

<your-repo-link-here>