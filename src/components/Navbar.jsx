import { SquaresFour, MapPin, Gear } from '@phosphor-icons/react';
export default function Navbar({ scrolled, activePage, onNavigate }) {

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <a className="nav-logo" href="#" onClick={(e) => { e.preventDefault(); onNavigate('Home'); }} role="button" aria-label="Go to home">
            <svg className="nav-logo-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path d="M8 22V14L16 8L24 14V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22V17H20V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="13" r="2" fill="white" />
            </svg>
            <span className="nav-logo-text">mdd</span>
          </a>
        </div>

        <nav className="nav-links desktop-only">
          <a className={`nav-link ${activePage === 'Catalogue' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Catalogue'); }} role="button"><SquaresFour size={20} weight={activePage === 'Catalogue' ? 'fill' : 'regular'} />Catalogue</a>
          <a className={`nav-link ${activePage === 'Map' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Map'); }} role="button"><MapPin size={20} weight={activePage === 'Map' ? 'fill' : 'regular'} />Map</a>
          <a className={`nav-link ${activePage === 'Admin' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Admin'); }} role="button"><Gear size={20} weight={activePage === 'Admin' ? 'fill' : 'regular'} />Admin</a>
        </nav>

      </div>
    </header>
  );
}
