import { useState } from 'react';
import { MagnifyingGlass, Bed, CurrencyCircleDollar, CaretDown, FadersHorizontal } from '@phosphor-icons/react';

export default function Hero({ onSearch }) {
  const [district, setDistrict] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch({ district: district || null, rooms: rooms || null, price: price || null });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">Find your perfect place</h1>
        <div className="hero-image-wrap">
          <img src="https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=80" alt="Luxury Marrakech riad with Atlas Mountains" className="hero-img" />

          <div className="search-bar desktop-only">
            <div className="search-field">
              <MagnifyingGlass className="field-icon" size={24} weight="regular" />
              <input
                type="text"
                placeholder="District, Area"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="search-divider"></div>
            <div className="search-field select-field">
              <Bed className="field-icon" size={24} weight="regular" />
              <select value={rooms} onChange={e => setRooms(e.target.value)}>
                <option value="">Rooms</option>
                <option value="1">1 room</option>
                <option value="2">2 rooms</option>
                <option value="3">3 rooms</option>
                <option value="4+">4+ rooms</option>
              </select>
              <CaretDown className="chevron" size={24} weight="regular" />
            </div>
            <div className="search-divider"></div>
            <div className="search-field select-field">
              <CurrencyCircleDollar className="field-icon" size={24} weight="regular" />
              <select value={price} onChange={e => setPrice(e.target.value)}>
                <option value="">Price</option>
                <option value="0-3000">0–3000 MAD</option>
                <option value="3000-6000">3000–6000 MAD</option>
                <option value="6000-10000">6000–10000 MAD</option>
                <option value="10000-99999">10000+ MAD</option>
              </select>
              <CaretDown className="chevron" size={24} weight="regular" />
            </div>
            <div className="search-divider"></div>
            <button className="filter-btn" type="button">
              <FadersHorizontal size={24} weight="regular" />
              Filters
            </button>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>

          <div className="search-bar-mobile mobile-only">
            <div className="search-field">
              <MagnifyingGlass className="field-icon" size={24} weight="regular" />
              <input
                type="text"
                placeholder="District, Area"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="filter-btn-inline" type="button">
                <FadersHorizontal size={24} weight="regular" />
              </button>
            </div>
            <div className="search-field select-field">
              <Bed className="field-icon" size={24} weight="regular" />
              <select value={rooms} onChange={e => setRooms(e.target.value)}>
                <option value="">Rooms</option>
                <option value="1">1 room</option>
                <option value="2">2 rooms</option>
                <option value="3">3 rooms</option>
                <option value="4+">4+ rooms</option>
              </select>
              <CaretDown className="chevron" size={24} weight="regular" />
            </div>
            <div className="search-field select-field">
              <CurrencyCircleDollar className="field-icon" size={24} weight="regular" />
              <select value={price} onChange={e => setPrice(e.target.value)}>
                <option value="">Price</option>
                <option value="0-3000">0–3000 MAD</option>
                <option value="3000-6000">3000–6000 MAD</option>
                <option value="6000-99999">6000+ MAD</option>
              </select>
              <CaretDown className="chevron" size={24} weight="regular" />
            </div>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
    </section>
  );
}
