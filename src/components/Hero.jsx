import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlass, Bed, CurrencyCircleDollar, CaretDown } from '@phosphor-icons/react';

const heroSlides = [
  {
    src: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1600&q=90',
    alt: 'Luxury Marrakech riad courtyard with fountain'
  },
  {
    src: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600&q=90',
    alt: 'Marrakech Medina streets and architecture'
  },
  {
    src: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=1600&q=90',
    alt: 'Traditional Moroccan riad interior with zellige tilework'
  },
  {
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=90',
    alt: 'Elegant Marrakech hotel pool and terrace'
  }
];

const stats = [
  { value: '500+', label: 'Verified Listings' },
  { value: 'All Districts', label: 'City Coverage' },
  { value: '100%', label: 'Verified Owners' },
];

export default function Hero({ onSearch }) {
  const [district, setDistrict] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(nextSlide, 7000);
    return () => clearInterval(t);
  }, [nextSlide]);

  const handleSearch = () => {
    if (onSearch) onSearch({ district: district || null, rooms: rooms || null, price: price || null });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className={`hero${loaded ? ' hero--loaded' : ''}`}>
      {/* Full-bleed slideshow background */}
      <div className="hero-bg">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`hero-bg-slide${i === currentSlide ? ' active' : ''}`}
            style={{ backgroundImage: `url(${slide.src})` }}
            aria-hidden="true"
          />
        ))}
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
      </div>

      {/* Main content */}
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Marrakech's Premier Rental Platform
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line hero-title-line--1">Marrakech</span>
          <span className="hero-title-line hero-title-line--2">Dar Diafa</span>
        </h1>

        <p className="hero-subtitle">
          Discover exceptional riads, apartments & villas
          <br className="hero-br" />
          in the heart of the Red City
        </p>

        {/* Search */}
        <div className="hero-search">
          <div className="hsearch-field">
            <MagnifyingGlass className="hsearch-icon" size={18} weight="regular" />
            <input
              type="text"
              placeholder="District or area..."
              value={district}
              onChange={e => setDistrict(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="hsearch-sep" />
          <div className="hsearch-field hsearch-field--select">
            <Bed className="hsearch-icon" size={18} weight="regular" />
            <select value={rooms} onChange={e => setRooms(e.target.value)}>
              <option value="">Rooms</option>
              <option value="1">1 room</option>
              <option value="2">2 rooms</option>
              <option value="3">3 rooms</option>
              <option value="4+">4+ rooms</option>
            </select>
            <CaretDown className="hsearch-chevron" size={14} />
          </div>
          <div className="hsearch-sep" />
          <div className="hsearch-field hsearch-field--select">
            <CurrencyCircleDollar className="hsearch-icon" size={18} weight="regular" />
            <select value={price} onChange={e => setPrice(e.target.value)}>
              <option value="">Budget</option>
              <option value="0-3000">0–3,000 MAD</option>
              <option value="3000-6000">3,000–6,000 MAD</option>
              <option value="6000-10000">6,000–10,000 MAD</option>
              <option value="10000-99999">10,000+ MAD</option>
            </select>
            <CaretDown className="hsearch-chevron" size={14} />
          </div>
          <button className="hsearch-btn" onClick={handleSearch}>
            <MagnifyingGlass size={16} weight="bold" />
            <span>Search</span>
          </button>
        </div>

        {/* Trust stats */}
        <div className="hero-stats">
          {stats.map((s, i) => (
            <div key={i} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div className="hero-dots" role="tablist" aria-label="Hero slides">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === currentSlide}
            className={`hero-dot${i === currentSlide ? ' active' : ''}`}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll caret */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <CaretDown size={20} weight="light" />
      </div>
    </section>
  );
}
