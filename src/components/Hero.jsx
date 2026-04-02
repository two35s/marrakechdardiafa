import { useState } from 'react';
import { MagnifyingGlass, Bed, CurrencyCircleDollar, CaretDown, FadersHorizontal } from '@phosphor-icons/react';

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
              <MagnifyingGlass className="field-icon" size={24} weight="regular" />
              <input type="text" placeholder="District, Area" value={district} onChange={e => setDistrict(e.target.value)} />
            </div>
            <div className="search-divider"></div>
            <div className="search-field select-field">
              <Bed className="field-icon" size={24} weight="regular" />
              <select value={rooms} onChange={e => setRooms(e.target.value)}>
                <option disabled value="Rooms">Rooms</option>
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
                <option disabled value="Price">Price</option>
                <option value="0-3000">0–3000 MAD</option>
                <option value="3000-6000">3000–6000 MAD</option>
                <option value="6000-10000">6000–10000 MAD</option>
                <option value="10000+">10000+ MAD</option>
              </select>
              <CaretDown className="chevron" size={24} weight="regular" />
            </div>
            <div className="search-divider"></div>
            <button className="filter-btn">
              <FadersHorizontal size={24} weight="regular" />
              Filters
            </button>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>

          {/* Search Bar — Mobile (stacked) */}
          <div className="search-bar-mobile mobile-only">
            <div className="search-field">
              <MagnifyingGlass className="field-icon" size={24} weight="regular" />
              <input type="text" placeholder="District, Area" value={district} onChange={e => setDistrict(e.target.value)} />
              <button className="filter-btn-inline">
                <FadersHorizontal size={24} weight="regular" />
              </button>
            </div>
            <div className="search-field select-field">
              <Bed className="field-icon" size={24} weight="regular" />
              <select value={rooms} onChange={e => setRooms(e.target.value)}><option disabled value="Rooms">Rooms</option><option value="1">1 room</option><option value="2">2 rooms</option><option value="3">3 rooms</option></select>
              <CaretDown className="chevron" size={24} weight="regular" />
            </div>
            <div className="search-field select-field">
              <CurrencyCircleDollar className="field-icon" size={24} weight="regular" />
              <select value={price} onChange={e => setPrice(e.target.value)}><option disabled value="Price">Price</option><option value="0-3000">0–3000 MAD</option><option value="3000-6000">3000–6000 MAD</option><option value="6000+">6000+ MAD</option></select>
              <CaretDown className="chevron" size={24} weight="regular" />
            </div>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
    </section>
  );
}
