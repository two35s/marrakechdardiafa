import { MapPin, EnvelopeSimple, InstagramLogo, WhatsappLogo } from '@phosphor-icons/react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      {/* Moroccan ornamental divider */}
      <div className="footer-ornament" aria-hidden="true">
        <div className="footer-orn-line" />
        <svg className="footer-orn-gem" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 1L19 10L10 19L1 10Z" fill="currentColor" />
          <path d="M10 5L15 10L10 15L5 10Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        </svg>
        <div className="footer-orn-line footer-orn-line--r" />
      </div>

      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path d="M8 22V14L16 8L24 14V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22V17H20V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="13" r="2" fill="white" />
            </svg>
            <div className="footer-logo-text">
              Marrakech
              <em>Dar Diafa</em>
            </div>
          </div>
          <p className="footer-tagline">
            Your trusted gateway to exceptional rentals — riads, apartments, and villas — in the heart of the Red City.
          </p>
          <div className="footer-socials">
            <a href="#" className="footer-social" aria-label="WhatsApp">
              <WhatsappLogo size={17} weight="fill" />
            </a>
            <a href="#" className="footer-social" aria-label="Instagram">
              <InstagramLogo size={17} weight="fill" />
            </a>
            <a href="mailto:contact@marrakechdardiafa.com" className="footer-social" aria-label="Email">
              <EnvelopeSimple size={17} weight="fill" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="footer-col">
          <h4 className="footer-col-title">Explore</h4>
          <nav className="footer-links">
            <button className="footer-link" onClick={() => onNavigate('Home')}>Home</button>
            <button className="footer-link" onClick={() => onNavigate('Catalogue')}>Catalogue</button>
            <button className="footer-link" onClick={() => onNavigate('Map')}>Map View</button>
          </nav>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <div className="footer-contact">
            <a href="https://wa.me/212600000000" className="footer-contact-item">
              <WhatsappLogo size={15} />
              +212 6XX XXX XXX
            </a>
            <a href="mailto:contact@marrakechdardiafa.com" className="footer-contact-item">
              <EnvelopeSimple size={15} />
              contact@marrakechdardiafa.com
            </a>
            <span className="footer-contact-item footer-contact-loc">
              <MapPin size={15} />
              Marrakech, Morocco
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copy">© {new Date().getFullYear()} Marrakech Dar Diafa. All rights reserved.</p>
          <p className="footer-made">Made with ♥ in Marrakech</p>
        </div>
      </div>
    </footer>
  );
}
