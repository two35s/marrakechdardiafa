import { House, SquaresFour, MapPin, Gear } from '@phosphor-icons/react';
export default function Navbar({ scrolled, activePage, onNavigate }) {

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <a className="nav-logo" href="#">
            <House size={24} weight="duotone" color="#4A90D9" className="logo-icon" />
            <span>marrakechdardiafa</span>
          </a>
        </div>


        {/* Desktop Nav */}
        <nav className="nav-links desktop-only">
          <a className={`nav-link ${activePage === 'Home' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Home'); }}><House size={20} weight={activePage === 'Home' ? 'fill' : 'regular'} />Home</a>
          <a className={`nav-link ${activePage === 'Catalogue' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Catalogue'); }}><SquaresFour size={20} weight={activePage === 'Catalogue' ? 'fill' : 'regular'} />Catalogue</a>
          <a className={`nav-link ${activePage === 'Map' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Map'); }}><MapPin size={20} weight={activePage === 'Map' ? 'fill' : 'regular'} />Map</a>
          <a className={`nav-link ${activePage === 'Admin' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Admin'); }}><Gear size={20} weight={activePage === 'Admin' ? 'fill' : 'regular'} />Admin</a>
        </nav>

      </div>
    </header>
  );
}
