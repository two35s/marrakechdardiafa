import { WhatsappLogo } from '@phosphor-icons/react';

const WHATSAPP_NUMBER = '212600000000';

export default function Navbar({ scrolled, activePage, onNavigate }) {
  const isHero = activePage === 'Home' && !scrolled;

  return (
    <header
      className={`navbar${scrolled ? ' scrolled' : ''}${isHero ? ' navbar--hero' : ''}`}
      id="navbar"
    >
      <div className="nav-inner">

        {/* Logo */}
        <a
          className="nav-logo"
          href="#"
          onClick={(e) => { e.preventDefault(); onNavigate('Home'); }}
          aria-label="Marrakech Dar Diafa — Home"
        >
          <svg className="nav-logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="var(--accent)" />
            <path d="M8 22V14L16 8L24 14V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22V17H20V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="13" r="2" fill="white" />
          </svg>
          <div className="nav-wordmark">
            <span className="nav-word-main">Marrakech</span>
            <span className="nav-word-sub">Dar Diafa</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="nav-links desktop-only" aria-label="Main navigation">
          <a
            className={`nav-link${activePage === 'Catalogue' ? ' active' : ''}`}
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('Catalogue'); }}
          >
            Catalogue
          </a>
          <a
            className={`nav-link${activePage === 'Map' ? ' active' : ''}`}
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('Map'); }}
          >
            Map
          </a>
        </nav>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-wa desktop-only"
        >
          <WhatsappLogo size={15} weight="fill" />
          Contact us
        </a>

      </div>
    </header>
  );
}
