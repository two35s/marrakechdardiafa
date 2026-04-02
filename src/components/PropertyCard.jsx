import { useState } from 'react';

export default function PropertyCard({ property, onViewDetail }) {
  const [liked, setLiked] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const gallery = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image];
  const dots = gallery.map((_, i) => i);

  const handleCardClick = (e) => {
    // Don't navigate if user clicked an interactive element
    if (e.target.closest('.like-btn') || e.target.closest('.tour-btn') || e.target.closest('.card-dot') || e.target.closest('.card-nav-arrow')) return;
    if (onViewDetail) onViewDetail(property.id);
  };

  return (
    <article className="property-card clickable" onClick={handleCardClick}>
      <div className="card-img-wrap">
        <img src={gallery[activeDot]} alt={property.address} className="card-img" />
        <button 
          className="card-nav-arrow arrow-left"
          onClick={(e) => { e.stopPropagation(); setActiveDot(i => i === 0 ? gallery.length - 1 : i - 1); }}
          aria-label="Previous image"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 16l-6-6 6-6"/></svg>
        </button>
        <button 
          className="card-nav-arrow arrow-right"
          onClick={(e) => { e.stopPropagation(); setActiveDot(i => (i + 1) % gallery.length); }}
          aria-label="Next image"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 4l6 6-6 6"/></svg>
        </button>
        <div className="card-dots">
          {dots.map((dotIndex) => (
            <span 
              key={dotIndex} 
              className={`card-dot ${activeDot === dotIndex ? 'active' : ''}`}
              onClick={() => setActiveDot(dotIndex)}
            ></span>
          ))}
        </div>
      </div>
      
      <div className="card-body">
        <div className="card-price-row">
          <div className="card-price">
            <span className="price-amount">{property.price} MAD</span> 
            <span className="price-unit">month</span>
          </div>
          <button 
            className={`like-btn ${liked ? 'liked' : ''}`} 
            aria-label={liked ? "Unlike" : "Like"}
            onClick={() => setLiked(!liked)}
          >
            <svg viewBox="0 0 20 20" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M10 17s-7-4.5-7-9a7 7 0 0114 0c0 4.5-7 9-7 9z"/>
            </svg>
          </button>
        </div>
        
        <div className="card-address">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10" cy="10" r="7"/>
            <path d="M10 7v3l2 2"/>
          </svg>
          {property.address}
        </div>
        
        <div className="card-badges">
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
        
        <div className="card-meta">
          <span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="14" height="9" rx="1"/><path d="M5 5V4a3 3 0 016 0v1"/></svg>
            {property.rooms} {property.rooms === 1 ? 'room' : 'rooms'}
          </span>
          <span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v5M8 14v-3M2 8h3M14 8h-3"/></svg>
            {property.floor}
          </span>
          <span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1"/></svg>
            {property.area} m²
          </span>
        </div>
        
        <button className="tour-btn" onClick={() => onViewDetail && onViewDetail(property.id)}>Request a tour</button>
      </div>
    </article>
  );
}
