export default function Navbar({ scrolled, activePage, onNavigate }) {

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <a className="nav-logo" href="#">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9.33 2 7.33 4.33 7.33 7c0 2.67 2 5 4.67 5 2.67 0 4.67-2.33 4.67-5C16.67 4.33 14.67 2 12 2z" fill="#4A90D9" opacity="0.5"/>
              <path d="M12 9C8.67 9 6 11.67 6 15s2.67 6 6 6 6-2.67 6-6-2.67-6-6-6z" fill="#4A90D9" opacity="0.7"/>
            </svg>
            <span>marrakechdardiafa</span>
          </a>
        </div>


        {/* Desktop Nav */}
        <nav className="nav-links desktop-only">
          <a className={`nav-link ${activePage === 'Home' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Home'); }}><svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>Home</a>
          <a className={`nav-link ${activePage === 'Catalogue' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Catalogue'); }}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="14" rx="1"/><path d="M3 8h14"/><path d="M8 4v4M12 4v4"/></svg>Catalogue</a>
          <a className={`nav-link ${activePage === 'Map' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Map'); }}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2C7.24 2 5 4.24 5 7c0 4.5 5 11 5 11s5-6.5 5-11c0-2.76-2.24-5-5-5z"/><circle cx="10" cy="7" r="2"/></svg>Map</a>
          <a className={`nav-link ${activePage === 'Admin' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); onNavigate('Admin'); }}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a3 3 0 100-6 3 3 0 000 6z"/><path d="M17.4 11c.1-.3.1-.7.1-1s0-.7-.1-1l2.1-1.6a.5.5 0 00.1-.6l-2-3.5a.5.5 0 00-.6-.2l-2.5 1a7.5 7.5 0 00-1.7-1L12.3.6a.5.5 0 00-.5-.4h-4a.5.5 0 00-.5.4l-.4 2.7c-.6.3-1.2.6-1.7 1l-2.5-1a.5.5 0 00-.6.2l-2 3.5a.5.5 0 00.1.6L2.3 9c-.1.3-.1.7-.1 1s0 .7.1 1L.2 12.6a.5.5 0 00-.1.6l2 3.5c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.7c0 .2.2.4.5.4h4c.2 0 .4-.2.5-.4l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1c.2.1.5 0 .6-.2l2-3.5a.5.5 0 00-.1-.6L17.4 11z"/></svg>Admin</a>
        </nav>

      </div>
    </header>
  );
}
