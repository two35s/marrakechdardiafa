# marrakechdardiafa — Infinity Rent

A modern single-page application for browsing and managing rental properties in Marrakech, Morocco. Built with React 18, Vite, and Supabase.

**Live Demo:** [https://two35s.github.io/marrakechdardiafa/](https://two35s.github.io/marrakechdardiafa/)

## Features

- **Property Browsing** — View properties in a carousel, full catalogue grid, or interactive map
- **Search & Filters** — Filter by district, rooms, and price range
- **Property Details** — Image gallery, amenities, property specs, and tour request form
- **Interactive Map** — Leaflet-powered map with property markers, sidebar listings, and hover-to-pan
- **Admin Dashboard** — Full CRUD interface with stats, search, and form validation
- **Responsive Design** — Fully responsive with mobile-optimized layouts and GSAP-animated navigation
- **Like Persistence** — Favorite properties are saved to localStorage

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite 6](https://vite.dev/) | Build tool and dev server |
| [Supabase](https://supabase.com/) | Backend-as-a-Service (database) |
| [Leaflet](https://leafletjs.com/) | Interactive maps |
| [GSAP](https://gsap.com/) | Animated mobile navigation |
| [Phosphor Icons](https://phosphoricons.com/) | Icon library |
| [gh-pages](https://github.com/tschaub/gh-pages) | Static hosting deployment |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/two35s/marrakechdardiafa.git
   cd marrakechdardiafa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_PASSWORD=your_admin_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy to GitHub Pages |

## Project Structure

```
├── public/                      # Static assets
│   ├── apartment_card1.png
│   ├── apartment_card3.png
│   ├── apartment_hero.png
│   └── 404.html                 # SPA routing fallback for GitHub Pages
├── src/
│   ├── components/              # React components
│   │   ├── AdminDashboard.jsx   # Admin panel with CRUD operations
│   │   ├── Catalogue.jsx        # Full property grid with filters
│   │   ├── Hero.jsx             # Hero section with search bar
│   │   ├── Listings.jsx         # Horizontal carousel of property cards
│   │   ├── MapView.jsx          # Leaflet map with sidebar property list
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── PropertyCard.jsx     # Reusable property card component
│   │   ├── PropertyDetail.jsx   # Single property detail page
│   │   ├── StaggeredMenu.jsx    # GSAP-animated mobile menu
│   │   └── StaggeredMenu.css    # Styles for staggered menu
│   ├── lib/
│   │   └── supabase.js          # Supabase client and data mapping utilities
│   ├── styles/                  # Per-component CSS (modular)
│   │   ├── base.css             # Global styles, variables, utilities
│   │   ├── navbar.css
│   │   ├── hero.css
│   │   ├── listings.css
│   │   ├── property-card.css
│   │   ├── catalogue.css
│   │   ├── property-detail.css
│   │   ├── map.css
│   │   └── admin.css
│   ├── App.jsx                  # Root component, routing, state management
│   ├── main.jsx                 # React entry point
│   └── index.css                # CSS imports (modular entry point)
├── .env.example                 # Environment variable template
├── .eslintrc.json               # ESLint configuration
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Architecture

### Routing

The app uses custom client-side routing via `window.history.pushState` and `popstate` events. Routes:

| Route | Page |
|---|---|
| `/` | Home (Hero + Listings) |
| `/catalogue` | Full catalogue with filters |
| `/map` | Interactive map view |
| `/admin` | Admin dashboard (password protected) |
| `/property/:id` | Property detail page |

### Data Flow

- Properties are fetched from Supabase on initial load
- CRUD operations (create, update, delete) are handled through Supabase
- Data mapping utilities in `src/lib/supabase.js` translate between database schema and UI model
- Liked properties are persisted in localStorage

### State Management

All state is lifted to `App.jsx` which acts as a central controller. Components receive props and callbacks. No external state management library is used.

## Deployment

The app is configured for GitHub Pages deployment:

```bash
npm run deploy
```

This builds the project and pushes the `dist/` folder to the `gh-pages` branch.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |
| `VITE_ADMIN_PASSWORD` | No | Admin dashboard password (default: `admin123`) |

## License

This project is open source and available under the MIT License.
