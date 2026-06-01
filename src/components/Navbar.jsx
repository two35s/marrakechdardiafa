import { useState, useEffect } from 'react';
import { WhatsappLogo, List, X, House, BookOpen, MapPin, Phone } from '@phosphor-icons/react';

const WHATSAPP_NUMBER = '212600000000';

const NAV_ITEMS = [
  { label: 'Home',      page: 'Home',      icon: House    },
  { label: 'Catalogue', page: 'Catalogue', icon: BookOpen },
  { label: 'Map',       page: 'Map',       icon: MapPin   },
];

export default function Navbar({ scrolled, activePage, onNavigate }) {
  const isHero = activePage === 'Home' && !scrolled;
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu  = () => { setMenuOpen(true);  document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { setMenuOpen(false); document.body.style.overflow = ''; };

  const navigate = (page) => { closeMenu(); onNavigate(page); };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeMenu(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  return (
    <>
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
            <a className={`nav-link${activePage === 'Catalogue' ? ' active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Catalogue'); }}>Catalogue</a>
            <a className={`nav-link${activePage === 'Map'       ? ' active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Map');       }}>Map</a>
          </nav>

          {/* Desktop WhatsApp CTA */}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="nav-wa desktop-only">
            <WhatsappLogo size={15} weight="fill" />
            Contact us
          </a>

          {/* Mobile hamburger */}
          <button className="nav-hamburger mobile-only" onClick={openMenu} aria-label="Open menu" aria-expanded={menuOpen}>
            <List size={24} weight="bold" />
          </button>

        </div>
      </header>

      {/* Mobile drawer backdrop */}
      <div className={`mob-backdrop${menuOpen ? ' visible' : ''}`} onClick={closeMenu} aria-hidden="true" />

      {/* Mobile drawer */}
      <aside className={`mob-drawer${menuOpen ? ' open' : ''}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>

        {/* Drawer header */}
        <div className="mob-drawer-header">
          <div className="mob-drawer-brand">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path d="M8 22V14L16 8L24 14V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22V17H20V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="13" r="2" fill="white" />
            </svg>
            <span>Dar Diafa</span>
          </div>
          <button className="mob-drawer-close" onClick={closeMenu} aria-label="Close menu">
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="mob-drawer-nav">
          {NAV_ITEMS.map(({ label, page, icon: Icon }, i) => (
            <button
              key={page}
              className={`mob-nav-item${activePage === page ? ' active' : ''}`}
              onClick={() => navigate(page)}
              style={{ '--i': i }}
            >
              <span className="mob-nav-num">0{i + 1}</span>
              <span className="mob-nav-label">{label}</span>
              <Icon size={18} weight={activePage === page ? 'fill' : 'regular'} className="mob-nav-icon" />
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="mob-drawer-divider" />

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mob-drawer-wa"
          onClick={closeMenu}
        >
          <WhatsappLogo size={20} weight="fill" />
          <div>
            <p className="mob-drawer-wa-label">Get in touch</p>
            <p className="mob-drawer-wa-sub">Chat with us on WhatsApp</p>
          </div>
        </a>

      </aside>
    </>
  );
}
