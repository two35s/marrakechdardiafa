import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import PropertyCard from './PropertyCard';

export default function Listings({ properties, onViewDetail }) {
  const [currentOffset, setCurrentOffset] = useState(0);
  const trackRef = useRef(null);

  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 3;
    const w = window.innerWidth;
    if (w > 1024) return 3;
    if (w > 768) return 2;
    return 1;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());
  const maxOffset = Math.max(0, properties.length - visibleCount);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
      setCurrentOffset(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slide = (dir) => {
    const newOffset = Math.max(0, Math.min(currentOffset + dir, maxOffset));
    setCurrentOffset(newOffset);
  };

  const cardWidthPercentage = 100 / visibleCount;

  return (
    <section className="listings">
      <div className="listings-inner">
        <div className="listings-header">
          <h2 className="listings-title">Popular accommodation</h2>
          <div className="listing-arrows desktop-only">
            <button 
              className="arrow-btn" 
              onClick={() => slide(-1)} 
              disabled={currentOffset === 0}
              aria-label="Previous"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>
            <button 
              className="arrow-btn" 
              onClick={() => slide(1)} 
              disabled={currentOffset >= maxOffset}
              aria-label="Next"
            >
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        </div>


        <div className="cards-track-wrap">
          <div 
            className="cards-track" 
            ref={trackRef}
            style={{ 
              transform: `translateX(calc(-${currentOffset * cardWidthPercentage}% - ${currentOffset * (20 / visibleCount)}px))`
            }}
          >
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} onViewDetail={onViewDetail} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
