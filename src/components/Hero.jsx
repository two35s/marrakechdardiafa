import { useState } from 'react';

export default function Hero({ onSearch }) {
  const [district, setDistrict] = useState('');
  const [rooms, setRooms] = useState('Rooms');
  const [price, setPrice] = useState('Price');
  const [currency, setCurrency] = useState('USD');

  const handleSearch = () => {
    alert(`Searching for: District: ${district || 'Any'}, Rooms: ${rooms}, Price: ${price}, Currency: ${currency}`);
    if (onSearch) onSearch({ district, rooms, price, currency });
  };
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">Find your perfect place</h1>
        <div className="hero-image-wrap">
          <img src="/apartment_hero.png" alt="Luxury Marrakech villa" className="hero-img" />

          {/* Search Bar — Desktop */}
          <div className="search-bar desktop-only">
            <div className="search-field">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
              <input type="text" placeholder="District, Area" value={district} onChange={e => setDistrict(e.target.value)} />
            </div>
            <div className="search-divider"></div>
            <div className="search-field select-field">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg>
              <select value={rooms} onChange={e => setRooms(e.target.value)}>
                <option disabled value="Rooms">Rooms</option>
                <option value="1">1 room</option>
                <option value="2">2 rooms</option>
                <option value="3">3 rooms</option>
                <option value="4+">4+ rooms</option>
              </select>
              <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div className="search-divider"></div>
            <div className="search-field select-field">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l3 3"/></svg>
              <select value={price} onChange={e => setPrice(e.target.value)}>
                <option disabled value="Price">Price</option>
                <option value="0-3000">0–3000 MAD</option>
                <option value="3000-6000">3000–6000 MAD</option>
                <option value="6000-10000">6000–10000 MAD</option>
                <option value="10000+">10000+ MAD</option>
              </select>
              <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div className="search-divider"></div>
            <button className="filter-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
              Filters
            </button>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>

          {/* Search Bar — Mobile (stacked) */}
          <div className="search-bar-mobile mobile-only">
            <div className="search-field">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
              <input type="text" placeholder="District, Area" value={district} onChange={e => setDistrict(e.target.value)} />
              <button className="filter-btn-inline">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
              </button>
            </div>
            <div className="search-field select-field">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg>
              <select value={rooms} onChange={e => setRooms(e.target.value)}><option disabled value="Rooms">Rooms</option><option value="1">1 room</option><option value="2">2 rooms</option><option value="3">3 rooms</option></select>
              <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div className="search-field select-field">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l3 3"/></svg>
              <select value={price} onChange={e => setPrice(e.target.value)}><option disabled value="Price">Price</option><option value="0-3000">0–3000 MAD</option><option value="3000-6000">3000–6000 MAD</option><option value="6000+">6000+ MAD</option></select>
              <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
    </section>
  );
}
