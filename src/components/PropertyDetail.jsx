import { useState, useEffect } from 'react';
import {
  ArrowLeft, CaretLeft, CaretRight, Heart, CheckCircle, SealCheck, Building,
  Bed, Stack, BoundingBox, Wind, Steps, CookingPot, ArrowsDownUp, Couch,
  Car, Waves, WifiHigh, ThermometerHot, Sun, HouseLine, Bell, Barbell,
  Thermometer, WhatsappLogo, EnvelopeSimple, X, Check, ShareNetwork,
  MapPin, Calendar, CurrencyCircleDollar
} from '@phosphor-icons/react';

const WHATSAPP_NUMBER = '212600000000';

const amenityIcons = {
  'Air Conditioning': <Wind size={16} />,
  'Balcony': <Steps size={16} />,
  'Dishwasher': <CookingPot size={16} />,
  'Elevator': <ArrowsDownUp size={16} />,
  'Furnished': <Couch size={16} />,
  'Parking': <Car size={16} />,
  'Washing Machine': <Waves size={16} />,
  'Wi-Fi': <WifiHigh size={16} />,
  'Heating': <ThermometerHot size={16} />,
  'Terrace': <Sun size={16} />,
  'Smart Home': <HouseLine size={16} />,
  'Concierge': <Bell size={16} />,
  'Gym Access': <Barbell size={16} />,
  'Underfloor': <Thermometer size={16} />,
};

export default function PropertyDetail({ properties, propertyId, onBack }) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const property = properties.find(p => p.id === propertyId);
  const gallery = property?.gallery?.length ? property.gallery : [property?.image || ''];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImage(0);
  }, [propertyId]);

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowRight') setActiveImage(i => (i + 1) % gallery.length);
        if (e.key === 'ArrowLeft') setActiveImage(i => (i - 1 + gallery.length) % gallery.length);
        if (e.key === 'Escape') setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, gallery.length]);

  if (!property) {
    return (
      <section className="pd-page">
        <div className="pd-inner">
          <p>Property not found.</p>
          <button className="pd-back-btn" onClick={onBack}>← Back</button>
        </div>
      </section>
    );
  }

  const waMessage = encodeURIComponent(
    `Hi, I'm interested in the property at ${property.address} — ${property.price} MAD/month. Could you give me more details?`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setShowContact(false);
      setContactSent(false);
    }, 2200);
  };

  const isAvailable = property.badges.includes('Available');

  return (
    <>
      <section className="pd-page">
        <div className="pd-inner">

          {/* ── Back / Breadcrumb ── */}
          <div className="pd-breadcrumb">
            <button className="pd-back-btn" onClick={onBack}>
              <ArrowLeft size={15} weight="bold" />
              Back
            </button>
            <span className="pd-bread-sep">/</span>
            <span className="pd-bread-item">Catalogue</span>
            <span className="pd-bread-sep">/</span>
            <span className="pd-bread-item pd-bread-active">{property.address}</span>
          </div>

          {/* ── Gallery Grid ── */}
          <div className="pd-gallery">
            <div className="pd-gallery-grid">
              {/* Main large photo */}
              <button
                className="pd-gal-main"
                onClick={() => { setActiveImage(0); setLightboxOpen(true); }}
                aria-label="View main photo"
              >
                <img src={gallery[0]} alt={property.address} />
              </button>

              {/* Side thumbnails 2×2 */}
              <div className="pd-gal-side">
                {[1, 2, 3, 4].map(idx => (
                  gallery[idx] ? (
                    <button
                      key={idx}
                      className="pd-gal-thumb"
                      onClick={() => { setActiveImage(idx); setLightboxOpen(true); }}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img src={gallery[idx]} alt={`${property.address} — photo ${idx + 1}`} />
                      {idx === 4 && gallery.length > 5 && (
                        <div className="pd-gal-more">+{gallery.length - 5} more</div>
                      )}
                    </button>
                  ) : (
                    <div key={idx} className="pd-gal-thumb pd-gal-thumb--empty" />
                  )
                ))}
              </div>
            </div>

            {gallery.length > 1 && (
              <button
                className="pd-gal-all-btn"
                onClick={() => setLightboxOpen(true)}
              >
                View all {gallery.length} photos
              </button>
            )}
          </div>

          {/* ── Main + Sidebar ── */}
          <div className="pd-layout">

            {/* ── Left: main content ── */}
            <div className="pd-main">

              {/* Title row */}
              <div className="pd-title-row">
                <div className="pd-title-left">
                  {isAvailable && (
                    <span className="pd-avail-tag">
                      <CheckCircle size={13} weight="fill" />
                      Available now
                    </span>
                  )}
                  <h1 className="pd-address">{property.address}</h1>
                  <div className="pd-type-row">
                    <span className="pd-type">{property.details.type}</span>
                    {property.badges.includes('Verified') && (
                      <span className="pd-verified">
                        <SealCheck size={13} weight="fill" />
                        Verified listing
                      </span>
                    )}
                    {property.badges.includes('Realtor') && (
                      <span className="pd-realtor">
                        <Building size={13} weight="fill" />
                        Via Realtor
                      </span>
                    )}
                  </div>
                </div>
                <div className="pd-title-actions">
                  <LikeButton propertyId={property.id} />
                  <button
                    className="pd-action-btn"
                    onClick={handleShare}
                    aria-label="Share"
                    title={copied ? 'Link copied!' : 'Copy link'}
                  >
                    {copied ? <Check size={18} weight="bold" /> : <ShareNetwork size={18} />}
                  </button>
                </div>
              </div>

              {/* Quick stats strip */}
              <div className="pd-stats-strip">
                <div className="pd-stat">
                  <Bed size={18} weight="regular" className="pd-stat-icon" />
                  <span className="pd-stat-val">{property.rooms}</span>
                  <span className="pd-stat-lbl">{property.rooms === 1 ? 'room' : 'rooms'}</span>
                </div>
                <div className="pd-stat-sep" />
                <div className="pd-stat">
                  <BoundingBox size={18} weight="regular" className="pd-stat-icon" />
                  <span className="pd-stat-val">{property.area} m²</span>
                  <span className="pd-stat-lbl">area</span>
                </div>
                <div className="pd-stat-sep" />
                <div className="pd-stat">
                  <Stack size={18} weight="regular" className="pd-stat-icon" />
                  <span className="pd-stat-val">{property.floor}</span>
                  <span className="pd-stat-lbl">floor</span>
                </div>
                <div className="pd-stat-sep" />
                <div className="pd-stat">
                  <CurrencyCircleDollar size={18} weight="regular" className="pd-stat-icon" />
                  <span className="pd-stat-val">{property.price.toLocaleString()}</span>
                  <span className="pd-stat-lbl">MAD / mo</span>
                </div>
              </div>

              {/* Description */}
              <div className="pd-section">
                <h2 className="pd-section-title">About this property</h2>
                <p className="pd-description">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="pd-section">
                  <h2 className="pd-section-title">Amenities</h2>
                  <div className="pd-amenities">
                    {property.amenities.map(a => (
                      <span key={a} className="pd-amenity">
                        <span className="pd-amenity-icon">{amenityIcons[a] || <Check size={14} />}</span>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Property details table */}
              <div className="pd-section">
                <h2 className="pd-section-title">Property details</h2>
                <div className="pd-details-table">
                  <div className="pd-detail-row">
                    <span className="pd-detail-key">Type</span>
                    <span className="pd-detail-val">{property.details.type}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-key">Year built</span>
                    <span className="pd-detail-val">{property.details.yearBuilt}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-key">Heating</span>
                    <span className="pd-detail-val">{property.details.heating}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-key">Bathroom</span>
                    <span className="pd-detail-val">{property.details.bathroom}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-key">Pet friendly</span>
                    <span className="pd-detail-val">{property.details.petFriendly ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-key">Security deposit</span>
                    <span className="pd-detail-val">{property.details.deposit}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-key">Rooms</span>
                    <span className="pd-detail-val">{property.rooms} {property.rooms === 1 ? 'room' : 'rooms'}</span>
                  </div>
                  <div className="pd-detail-row">
                    <span className="pd-detail-key">Area</span>
                    <span className="pd-detail-val">{property.area} m²</span>
                  </div>
                </div>
              </div>

              {/* Location note */}
              <div className="pd-section">
                <h2 className="pd-section-title">Location</h2>
                <div className="pd-location">
                  <MapPin size={16} weight="fill" className="pd-loc-icon" />
                  <span>{property.address}, Marrakech, Morocco</span>
                </div>
              </div>

            </div>

            {/* ── Sidebar ── */}
            <aside className="pd-sidebar">
              <div className="pd-sidebar-card">

                {/* Price */}
                <div className="pd-sb-price-row">
                  <div>
                    <span className="pd-sb-price">{property.price.toLocaleString()}</span>
                    <span className="pd-sb-currency"> MAD</span>
                    <span className="pd-sb-period"> / month</span>
                  </div>
                  {isAvailable && (
                    <span className="pd-sb-avail">
                      <span className="pd-sb-avail-dot" />
                      Available
                    </span>
                  )}
                </div>

                {/* Annual estimate */}
                <p className="pd-sb-annual">≈ {(property.price * 12).toLocaleString()} MAD / year</p>

                {/* Specs mini grid */}
                <div className="pd-sb-specs">
                  <div className="pd-sb-spec">
                    <Bed size={16} />
                    <span>{property.rooms} {property.rooms === 1 ? 'room' : 'rooms'}</span>
                  </div>
                  <div className="pd-sb-spec">
                    <BoundingBox size={16} />
                    <span>{property.area} m²</span>
                  </div>
                  <div className="pd-sb-spec">
                    <Stack size={16} />
                    <span>{property.floor}</span>
                  </div>
                  <div className="pd-sb-spec">
                    <Calendar size={16} />
                    <span>Built {property.details.yearBuilt}</span>
                  </div>
                </div>

                {/* Primary CTA: WhatsApp */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-sb-wa"
                >
                  <WhatsappLogo size={20} weight="fill" />
                  Chat on WhatsApp
                </a>

                {/* Secondary CTA: Tour */}
                <button className="pd-sb-tour" onClick={() => setShowContact(true)}>
                  <EnvelopeSimple size={18} />
                  Request a tour
                </button>

                {/* Save + Share */}
                <div className="pd-sb-actions">
                  <LikeButton propertyId={property.id} label />
                  <button className="pd-sb-share" onClick={handleShare}>
                    {copied
                      ? <><Check size={15} weight="bold" /> Copied!</>
                      : <><ShareNetwork size={15} /> Share</>
                    }
                  </button>
                </div>

                {/* Deposit note */}
                <p className="pd-sb-deposit">
                  Deposit: <strong>{property.details.deposit}</strong>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Mobile sticky CTA bar ── */}
      <div className="pd-mobile-bar">
        <div className="pd-mb-price">
          <span className="pd-mb-amount">{property.price.toLocaleString()}</span>
          <span className="pd-mb-unit">MAD/mo</span>
        </div>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="pd-mb-wa">
          <WhatsappLogo size={18} weight="fill" />
          WhatsApp
        </a>
        <button className="pd-mb-tour" onClick={() => setShowContact(true)}>
          Tour
        </button>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <>
          <div className="pd-lightbox-overlay" onClick={() => setLightboxOpen(false)} />
          <div className="pd-lightbox">
            <button className="pd-lb-close" onClick={() => setLightboxOpen(false)} aria-label="Close">
              <X size={20} weight="bold" />
            </button>
            <button
              className="pd-lb-arrow pd-lb-arrow--left"
              onClick={() => setActiveImage(i => (i - 1 + gallery.length) % gallery.length)}
              aria-label="Previous"
            >
              <CaretLeft size={24} weight="bold" />
            </button>
            <img
              src={gallery[activeImage]}
              alt={`${property.address} — photo ${activeImage + 1}`}
              className="pd-lb-img"
            />
            <button
              className="pd-lb-arrow pd-lb-arrow--right"
              onClick={() => setActiveImage(i => (i + 1) % gallery.length)}
              aria-label="Next"
            >
              <CaretRight size={24} weight="bold" />
            </button>
            <div className="pd-lb-counter">{activeImage + 1} / {gallery.length}</div>
          </div>
        </>
      )}

      {/* ── Contact / Tour modal ── */}
      {showContact && (
        <>
          <div className="modal-overlay" onClick={() => { setShowContact(false); setContactSent(false); }} />
          <div className="contact-modal">
            <div className="modal-header">
              <h3>{contactSent ? 'Request sent!' : 'Request a tour'}</h3>
              <button className="modal-close" onClick={() => { setShowContact(false); setContactSent(false); }} type="button">
                <X size={18} weight="bold" />
              </button>
            </div>
            {contactSent ? (
              <div className="modal-success">
                <Check size={32} weight="bold" />
                We'll get back to you shortly about<br /><strong>{property.address}</strong>.
              </div>
            ) : (
              <>
                <p className="modal-address">{property.address} · {property.price.toLocaleString()} MAD / month</p>
                <form className="modal-form" onSubmit={handleContactSubmit}>
                  <input type="text" placeholder="Your full name" required />
                  <input type="email" placeholder="Email address" required />
                  <input type="tel" placeholder="Phone / WhatsApp number" />
                  <textarea placeholder="Any questions or preferred visit time?" rows="3" />
                  <button type="submit" className="modal-submit">Send request</button>
                </form>
                <p className="modal-wa-alt">
                  Or reach us directly on{' '}
                  <a href={waLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </p>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

function LikeButton({ propertyId, label }) {
  const [liked, setLiked] = useState(() => {
    try {
      const stored = localStorage.getItem('liked_properties');
      return stored ? JSON.parse(stored).includes(propertyId) : false;
    } catch { return false; }
  });

  const toggle = () => {
    setLiked(prev => {
      const next = !prev;
      try {
        const stored = localStorage.getItem('liked_properties');
        const ids = stored ? JSON.parse(stored) : [];
        if (next) { if (!ids.includes(propertyId)) ids.push(propertyId); }
        else { const i = ids.indexOf(propertyId); if (i > -1) ids.splice(i, 1); }
        localStorage.setItem('liked_properties', JSON.stringify(ids));
      } catch { /* */ }
      return next;
    });
  };

  if (label) {
    return (
      <button className={`pd-sb-save ${liked ? 'liked' : ''}`} onClick={toggle} type="button">
        <Heart size={15} weight={liked ? 'fill' : 'regular'} />
        {liked ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      className={`pd-action-btn ${liked ? 'liked' : ''}`}
      onClick={toggle}
      aria-label={liked ? 'Unlike' : 'Like'}
      type="button"
    >
      <Heart size={18} weight={liked ? 'fill' : 'regular'} />
    </button>
  );
}
