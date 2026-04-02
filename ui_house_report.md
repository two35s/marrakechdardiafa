# UI_HOUSE - MarrakechDardiafa - Improvement Report

**Generated:** April 1, 2026  
**Project Path:** `/Users/youssefbaaziz/Desktop/code/ui_house`  
**Project Type:** Real estate rental listing web application

---

## Tech Stack

- React 18.3.1
- Vite 6.2.0
- GSAP 3.14.2
- Leaflet 1.9.4
- localStorage (no backend)

---

## CRITICAL ISSUES

### 1. Search Functionality Non-Functional
- **Severity:** HIGH
- **File:** `src/components/Hero.jsx`
- **Issue:** No `onChange` handlers on search inputs (location, rooms, price)
- **Fix:** Add state and onChange handlers to filter properties

### 2. Currency Selector Broken
- **Severity:** HIGH
- **File:** `src/components/Hero.jsx`
- **Issue:** Currency dropdown has no handler, prices always display as `$`
- **Fix:** Add currency state and price conversion logic (support MAD)

### 3. Map Centered on Wrong Location
- **Severity:** HIGH
- **File:** `src/components/MapView.jsx`
- **Issue:** Map centered on Kyiv, Ukraine (50.4540, 30.5155) instead of Marrakech, Morocco
- **Fix:** Change center to `[30.4285, -8.0088]` (Marrakech coordinates)

### 4. Mobile Menu Z-Index Conflict
- **Severity:** HIGH
- **File:** `src/components/StaggeredMenu.css` (line 364)
- **Issue:** Mobile overlay has `zIndex: 35` but navbar has `z-index: 100`
- **Fix:** Change overlay z-index to `999` or higher than navbar

---

## MEDIUM ISSUES

### 5. Carousel Not Responsive to Resize
- **File:** `src/components/Listings.jsx` (line 16)
- **Issue:** `visibleCount` calculated once, doesn't update on window resize
- **Fix:** Use `useEffect` with resize listener or CSS-based solution

### 6. Carousel Dots Non-Functional
- **File:** `src/components/PropertyCard.jsx` (lines 19-26)
- **Issue:** Clickable dots but do nothing
- **Fix:** Either implement pagination or remove dots

### 7. Typo in Text
- **File:** `src/components/Listings.jsx` (line 38)
- **Issue:** "accomodation" should be "accommodation"

### 8. Form Submissions Do Nothing
- **File:** `src/components/PropertyDetail.jsx`
- **Issue:** Contact/tour request forms use `e.preventDefault()` with no API call
- **Fix:** Integrate with email service (Resend, SendGrid) or backend

### 9. No Authentication on Admin Dashboard
- **File:** `src/components/AdminDashboard.jsx`
- **Issue:** Anyone can access and modify properties
- **Fix:** Add Supabase Auth or similar authentication

---

## MISSING FEATURES

### Backend/API
- [ ] Replace localStorage with real database (Supabase recommended)
- [ ] API endpoints for CRUD operations
- [ ] Image upload for properties

### Functionality
- [ ] Working search and filter system
- [ ] Currency conversion (MAD primary, USD/EUR secondary)
- [ ] Email notifications for tour requests
- [ ] Favorites/saved properties (persisted to user account)
- [ ] Pagination for property listings

### Technical
- [ ] TypeScript migration
- [ ] Unit tests (Jest/React Testing Library)
- [ ] Error boundaries
- [ ] Loading states/skeletons
- [ ] React Router for proper routing
- [ ] Zustand/Redux for state management

### SEO & Performance
- [ ] Meta tags and Open Graph
- [ ] Structured data (JSON-LD)
- [ ] Code splitting/lazy loading
- [ ] Image optimization

### Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Color contrast compliance

---

## QUICK FIXES (Low Effort)

| File | Line | Issue | Fix |
|------|------|-------|-----|
| `StaggeredMenu.css` | 364 | z-index: 35 | z-index: 999 |
| `MapView.jsx` | - | center: [50.454, 30.515] | center: [30.4285, -8.0088] |
| `Listings.jsx` | 38 | "accomodation" | "accommodation" |

---

## RECOMMENDED IMPROVEMENTS

### Phase 1: Quick Fixes (1-2 hours)
1. Fix map center coordinates
2. Fix mobile z-index
3. Fix typo
4. Add search functionality

### Phase 2: Backend Integration (1-2 days)
1. Set up Supabase project
2. Create database schema for properties
3. Replace localStorage with API calls
4. Add authentication

### Phase 3: Polish (1 week)
1. Add TypeScript
2. Implement proper routing
3. Add unit tests
4. SEO optimization
5. Performance improvements

---

## File Structure

```
ui_house/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx    # CRUD admin interface
│   │   ├── Catalogue.jsx         # Property grid view
│   │   ├── Hero.jsx              # Landing hero + search
│   │   ├── Listings.jsx          # Horizontal carousel
│   │   ├── MapView.jsx           # Leaflet map
│   │   ├── Navbar.jsx            # Navigation
│   │   ├── PropertyCard.jsx      # Reusable card
│   │   ├── PropertyDetail.jsx    # Property page + gallery
│   │   ├── StaggeredMenu.jsx    # Mobile menu (GSAP)
│   │   └── StaggeredMenu.css
│   ├── data/
│   │   └── properties.js         # Static mock data (4 properties)
│   ├── App.jsx                   # Root component + routing
│   ├── index.css                 # Global styles
│   └── main.jsx
├── package.json
├── vite.config.js
└── SECURITY_BUG_REPORT.md
```

---

## Dependencies

**Current:**
```json
{
  "dependencies": {
    "gsap": "^3.14.2",
    "leaflet": "^1.9.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

**Recommended Additions:**
- `@supabase/supabase-js` - Backend & auth
- `react-router-dom` - Routing
- `zod` - Validation
- `react-hook-form` - Form handling

---

## Notes

- This project appears to be a frontend prototype that needs backend integration
- Consider merging with `dardeiafa` project which has similar functionality (luxury real estate in Marrakech)
- Data model in `dardeiafa` (Prisma schema) could be reused for this project
