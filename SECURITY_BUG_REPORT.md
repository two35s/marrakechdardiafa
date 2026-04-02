# Security & Bug Report
**Project:** infinity-rent (marrakechdardiafa)  
**Path:** /Users/youssefbaaziz/Desktop/code/ui_house  
**Date:** 2026-03-26  
**Status:** Needs Fixes

---

## Security Issues

| Severity | Issue | Location |
|----------|-------|----------|
| Low | Missing security headers (CSP, X-Frame-Options, etc.) | No server-side config |
| Low | Social links hardcoded to placeholder URLs (github.com, twitter.com, linkedin.com) | App.jsx:59-62 |

---

## Functional Bugs

| Severity | Issue | Location | Status |
|----------|-------|----------|--------|
| **Bug** | Currency selector does nothing — prices always show `$` regardless of MAD/USD selection | App.jsx:9, PropertyCard.jsx:28 | Open |
| **Bug** | Search inputs have no `onChange` handlers — search is non-functional | Hero.jsx:13, 51 | Open |
| **Bug** | `visibleCount` in Listings.jsx doesn't update on window resize — carousel breaks on resize | Listings.jsx:18 | Open |
| **Bug** | Carousel dots in PropertyCard are clickable but do nothing | PropertyCard.jsx:14-21 | Open |
| **Bug** | Mobile overlay `zIndex: 35` is below navbar `z-index: 100` — overlay appears under navbar | StaggeredMenu.jsx:364 | Open |
| **Bug** | Typo: "accomodation" → "accommodation" | Listings.jsx:41 | Open |

---

## Warnings

| Category | Issue |
|----------|-------|
| Dependencies | GSAP installed but optional — could be replaced with CSS animations |
| Missing File | StaggeredMenu.css imported but not verified |
| Data | Only static mock data — no backend integration |
| Input | No sanitization — if dynamic content is added, sanitize inputs |

---

## Priority Fixes

1. **High** — Fix currency conversion logic (App.jsx → PropertyCard)
2. **High** — Add search input handlers and filter functionality
3. **Medium** — Fix carousel `visibleCount` on resize
4. **Medium** — Fix mobile menu z-index stacking
5. **Low** — Replace placeholder social links
6. **Low** — Fix typo in listings title
