import { useState } from 'react';
import { CaretLeft, CaretRight, Heart, MapPin, CheckCircle, SealCheck, Building, Bed, Stack, BoundingBox } from '@phosphor-icons/react';

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
          <CaretLeft size={20} weight="bold" />
        </button>
        <button 
          className="card-nav-arrow arrow-right"
          onClick={(e) => { e.stopPropagation(); setActiveDot(i => (i + 1) % gallery.length); }}
          aria-label="Next image"
        >
          <CaretRight size={20} weight="bold" />
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
            <Heart size={22} weight={liked ? "fill" : "regular"} />
          </button>
        </div>
        
        <div className="card-address">
          <MapPin size={16} weight="regular" />
          {property.address}
        </div>
        
        <div className="card-badges">
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
        
        <div className="card-meta">
          <span>
            <Bed size={16} weight="regular" />
            {property.rooms} {property.rooms === 1 ? 'room' : 'rooms'}
          </span>
          <span>
            <Stack size={16} weight="regular" />
            {property.floor}
          </span>
          <span>
            <BoundingBox size={16} weight="regular" />
            {property.area} m²
          </span>
        </div>
        
        <button className="tour-btn" onClick={() => onViewDetail && onViewDetail(property.id)}>Request a tour</button>
      </div>
    </article>
  );
}
