import { useState, useEffect } from 'react';

export default function PropertyDetail({ properties, propertyId, onBack }) {
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const property = properties.find(p => p.id === propertyId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [propertyId]);

  if (!property) {
    return (
      <section className="detail-page">
        <div className="detail-inner">
          <p>Property not found.</p>
          <button className="back-btn" onClick={onBack}>← Back</button>
        </div>
      </section>
    );
  }

  const amenityIcons = {
    'Air Conditioning': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>
    ),
    'Balcony': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="12" width="18" height="8" rx="1"/><path d="M3 12V6a9 9 0 0118 0v6"/></svg>
    ),
    'Dishwasher': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="14" r="4"/><path d="M3 8h18"/></svg>
    ),
    'Elevator': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 8l3-3 3 3M9 16l3 3 3-3"/></svg>
    ),
    'Furnished': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12V6a2 2 0 012-2h10a2 2 0 012 2v6"/><rect x="2" y="12" width="20" height="6" rx="2"/><path d="M4 18v2M20 18v2"/></svg>
    ),
    'Parking': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg>
    ),
    'Washing Machine': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="14" r="5"/><circle cx="12" cy="14" r="2"/><path d="M7 6h2M13 6h2"/></svg>
    ),
    'Wi-Fi': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12.5a7 7 0 0114 0"/><path d="M8.5 16a4 4 0 017 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/><path d="M2 9a11 11 0 0120 0"/></svg>
    ),
    'Heating': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2c0 4-6 6-6 10a6 6 0 0012 0c0-4-6-6-6-10z"/></svg>
    ),
    'Terrace': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 22h20M4 22v-6h16v6M12 2v14M2 16l10-6 10 6"/></svg>
    ),
    'Smart Home': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/><rect x="9" y="14" width="6" height="6" rx="1"/></svg>
    ),
    'Concierge': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="5"/><path d="M4 21v-1a8 8 0 0116 0v1"/></svg>
    ),
    'Gym Access': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 5v14M18 5v14M6 12h12M2 8v8M22 8v8"/></svg>
    ),
    'Underfloor': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 18h20M2 22h20M6 14c0-2 2-4 3-6s3-4 3-6c0 2 2 4 3 6s3 4 3 6"/></svg>
    ),
  };

  return (
    <section className="detail-page">
      <div className="detail-inner">

        {/* Back navigation */}
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        {/* Gallery */}
        <div className="detail-gallery">
          <div className="gallery-main">
            <img
              src={property.gallery[activeImage]}
              alt={`${property.address} — photo ${activeImage + 1}`}
              className="gallery-main-img"
            />
            <div className="gallery-nav">
              <button
                className="gallery-arrow gallery-arrow-left"
                onClick={() => setActiveImage(i => (i - 1 + property.gallery.length) % property.gallery.length)}
                aria-label="Previous image"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                className="gallery-arrow gallery-arrow-right"
                onClick={() => setActiveImage(i => (i + 1) % property.gallery.length)}
                aria-label="Next image"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
            <div className="gallery-counter">{activeImage + 1} / {property.gallery.length}</div>
          </div>
          <div className="gallery-thumbs">
            {property.gallery.map((img, i) => (
              <button
                key={i}
                className={`gallery-thumb ${activeImage === i ? 'active' : ''}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content grid */}
        <div className="detail-content">

          {/* Left: main info */}
          <div className="detail-main">

            {/* Title row */}
            <div className="detail-title-row">
              <div>
                <h1 className="detail-address">{property.address}</h1>
                <span className="detail-type">{property.details.type}</span>
              </div>
              <button
                className={`detail-like ${liked ? 'liked' : ''}`}
                onClick={() => setLiked(!liked)}
                aria-label={liked ? 'Unlike' : 'Like'}
              >
                <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21s-8-5.5-8-11a5.5 5.5 0 0111 0 5.5 5.5 0 0111 0c0 5.5-8 11-8 11z" />
                </svg>
              </button>
            </div>

            {/* Badges */}
            <div className="detail-badges">
              {property.badges.includes('Available') && (
                <span className="badge badge-available">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l4 4 6-6"/></svg>
                  Available
                </span>
              )}
              {property.badges.includes('Verified') && (
                <span className="badge badge-verified">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.4l-3.7 1.9.7-4.1L2 6.3l4.2-.7L8 2z"/></svg>
                  Verified
                </span>
              )}
              {property.badges.includes('Realtor') && (
                <span className="badge badge-realtor">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="10" rx="1"/><path d="M5 7h6M5 10h4"/></svg>
                  Realtor
                </span>
              )}
            </div>

            {/* Quick stats */}
            <div className="detail-stats">
              <div className="stat-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="13" rx="2"/><path d="M7 7V5a5 5 0 0110 0v2"/></svg>
                <div className="stat-info">
                  <span className="stat-value">{property.rooms}</span>
                  <span className="stat-label">{property.rooms === 1 ? 'Room' : 'Rooms'}</span>
                </div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
                <div className="stat-info">
                  <span className="stat-value">{property.area} m²</span>
                  <span className="stat-label">Area</span>
                </div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/></svg>
                <div className="stat-info">
                  <span className="stat-value">{property.floor}</span>
                  <span className="stat-label">Floor</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="detail-section">
              <h2 className="section-heading">About this property</h2>
              <p className="detail-description">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="detail-section">
              <h2 className="section-heading">Amenities</h2>
              <div className="amenities-grid">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="amenity-item">
                    <div className="amenity-icon">
                      {amenityIcons[amenity] || (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
                      )}
                    </div>
                    <span className="amenity-label">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property details */}
            <div className="detail-section">
              <h2 className="section-heading">Property details</h2>
              <div className="details-grid">
                <div className="detail-row">
                  <span className="detail-key">Type</span>
                  <span className="detail-val">{property.details.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Year built</span>
                  <span className="detail-val">{property.details.yearBuilt}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Heating</span>
                  <span className="detail-val">{property.details.heating}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Bathroom</span>
                  <span className="detail-val">{property.details.bathroom}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Pet friendly</span>
                  <span className="detail-val">{property.details.petFriendly ? 'Yes' : 'No'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Security deposit</span>
                  <span className="detail-val">{property.details.deposit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-price">
                <span className="sidebar-amount">{property.price} MAD</span>
                <span className="sidebar-unit">/ month</span>
              </div>

              <div className="sidebar-meta">
                <div className="sidebar-meta-item">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="18" height="13" rx="2"/><path d="M5 5V4a5 5 0 0110 0v1"/></svg>
                  {property.rooms} {property.rooms === 1 ? 'room' : 'rooms'}
                </div>
                <div className="sidebar-meta-item">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="16" height="16" rx="2"/></svg>
                  {property.area} m²
                </div>
                <div className="sidebar-meta-item">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4v4M10 16v-4M4 10h4M16 10h-4"/></svg>
                  {property.floor}
                </div>
              </div>

              <button className="sidebar-cta" onClick={() => setShowContact(true)}>
                Request a tour
              </button>
              <button className="sidebar-secondary">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 5l8 5 8-5"/><rect x="2" y="4" width="16" height="12" rx="2"/></svg>
                Message the host
              </button>
            </div>
          </aside>
        </div>

        {/* Contact modal */}
        {showContact && (
          <>
            <div className="modal-overlay" onClick={() => setShowContact(false)}></div>
            <div className="contact-modal">
              <div className="modal-header">
                <h3>Request a tour</h3>
                <button className="modal-close" onClick={() => setShowContact(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <p className="modal-address">{property.address} — {property.price} MAD / mo</p>
              <form className="modal-form" onSubmit={(e) => { e.preventDefault(); alert("Tour request sent successfully!"); setShowContact(false); }}>
                <input type="text" placeholder="Your name" required />
                <input type="email" placeholder="Email address" required />
                <input type="tel" placeholder="Phone number" />
                <textarea placeholder="Message (optional)" rows="3"></textarea>
                <button type="submit" className="modal-submit">Send request</button>
              </form>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
