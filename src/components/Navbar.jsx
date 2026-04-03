import { SquaresFour, MapPin, Gear } from '@phosphor-icons/react';
export default function Navbar({ scrolled, activePage, onNavigate }) {

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <a className="nav-logo" href="#" onClick={(e) => { e.preventDefault(); onNavigate('Home'); }} role="button" aria-label="Go to home">
            <span className="nav-logo-text">marrakech<span className="nav-logo-accent">dar diafa</span></span>
          </a>
        </div>


        {/* Desktop Nav */}
        <nav className="nav-links desktop-only">
          <a className={`nav-link ${activePage === 'Catalogue' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Catalogue'); }} role="button"><SquaresFour size={20} weight={activePage === 'Catalogue' ? 'fill' : 'regular'} />Catalogue</a>
          <a className={`nav-link ${activePage === 'Map' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Map'); }} role="button"><MapPin size={20} weight={activePage === 'Map' ? 'fill' : 'regular'} />Map</a>
          <a className={`nav-link ${activePage === 'Admin' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Admin'); }} role="button"><Gear size={20} weight={activePage === 'Admin' ? 'fill' : 'regular'} />Admin</a>
        </nav>

      </div>
    </header>
  );
}
