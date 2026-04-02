import { useState, useEffect } from 'react';
import { 
  ArrowLeft, CaretLeft, CaretRight, Heart, CheckCircle, SealCheck, Building, 
  Bed, Stack, BoundingBox, Wind, Steps, CookingPot, ArrowsDownUp, Couch, 
  Car, Waves, WifiHigh, ThermometerHot, Sun, HouseLine, Bell, Barbell, 
  Thermometer, EnvelopeSimple, X, Check
} from '@phosphor-icons/react';

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
    'Air Conditioning': <Wind size={20} weight="regular" />,
    'Balcony': <Steps size={20} weight="regular" />,
    'Dishwasher': <CookingPot size={20} weight="regular" />,
    'Elevator': <ArrowsDownUp size={20} weight="regular" />,
    'Furnished': <Couch size={20} weight="regular" />,
    'Parking': <Car size={20} weight="regular" />,
    'Washing Machine': <Waves size={20} weight="regular" />,
    'Wi-Fi': <WifiHigh size={20} weight="regular" />,
    'Heating': <ThermometerHot size={20} weight="regular" />,
    'Terrace': <Sun size={20} weight="regular" />,
    'Smart Home': <HouseLine size={20} weight="regular" />,
    'Concierge': <Bell size={20} weight="regular" />,
    'Gym Access': <Barbell size={20} weight="regular" />,
    'Underfloor': <Thermometer size={20} weight="regular" />,
  };

  return (
    <section className="detail-page">
      <div className="detail-inner">

        {/* Back navigation */}
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} weight="bold" />
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
                <CaretLeft size={24} weight="bold" />
              </button>
              <button
                className="gallery-arrow gallery-arrow-right"
                onClick={() => setActiveImage(i => (i + 1) % property.gallery.length)}
                aria-label="Next image"
              >
                <CaretRight size={24} weight="bold" />
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
                <Heart size={24} weight={liked ? 'fill' : 'regular'} />
              </button>
            </div>

            {/* Badges */}
            <div className="detail-badges">
              {property.badges.includes('Available') && (
                <span className="badge badge-available">
                  <CheckCircle size={14} weight="fill" />
                  Available
                </span>
              )}
              {property.badges.includes('Verified') && (
                <span className="badge badge-verified">
                  <SealCheck size={14} weight="fill" />
                  Verified
                </span>
              )}
              {property.badges.includes('Realtor') && (
                <span className="badge badge-realtor">
                  <Building size={14} weight="fill" />
                  Realtor
                </span>
              )}
            </div>

            {/* Quick stats */}
            <div className="detail-stats">
              <div className="stat-item">
                <Bed size={20} weight="regular" />
                <div className="stat-info">
                  <span className="stat-value">{property.rooms}</span>
                  <span className="stat-label">{property.rooms === 1 ? 'Room' : 'Rooms'}</span>
                </div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <BoundingBox size={20} weight="regular" />
                <div className="stat-info">
                  <span className="stat-value">{property.area} m²</span>
                  <span className="stat-label">Area</span>
                </div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <Stack size={20} weight="regular" />
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
                      {amenityIcons[amenity] || <Check size={20} weight="bold" />}
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
                  <Bed size={18} weight="regular" />
                  {property.rooms} {property.rooms === 1 ? 'room' : 'rooms'}
                </div>
                <div className="sidebar-meta-item">
                  <BoundingBox size={18} weight="regular" />
                  {property.area} m²
                </div>
                <div className="sidebar-meta-item">
                  <Stack size={18} weight="regular" />
                  {property.floor}
                </div>
              </div>

              <button className="sidebar-cta" onClick={() => setShowContact(true)}>
                Request a tour
              </button>
              <button className="sidebar-secondary">
                <EnvelopeSimple size={18} weight="regular" />
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
                  <X size={20} weight="bold" />
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
