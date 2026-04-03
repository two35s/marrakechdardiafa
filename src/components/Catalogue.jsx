import { useState, useMemo } from 'react';
import PropertyCard from './PropertyCard';
import { CaretDown } from '@phosphor-icons/react';

export default function Catalogue({ properties, allProperties, onViewDetail }) {
  const [roomsFilter, setRoomsFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (roomsFilter) {
      if (roomsFilter === '4+') {
        result = result.filter(p => p.rooms >= 4);
      } else {
        result = result.filter(p => p.rooms === Number(roomsFilter));
      }
    }

    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      result = result.filter(p => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    return result;
  }, [properties, roomsFilter, priceFilter]);

  const clearFilters = () => {
    setRoomsFilter('');
    setPriceFilter('');
  };

  const hasActiveFilters = roomsFilter || priceFilter;

  return (
    <section className="catalogue-page">
      <div className="catalogue-inner">
        <div className="catalogue-header">
          <h1 className="catalogue-title">Our Catalogue</h1>

          <div className="catalogue-filters">
            <div className="search-field select-field">
              <select value={roomsFilter} onChange={(e) => setRoomsFilter(e.target.value)}>
                <option value="">Rooms</option>
                <option value="1">1 room</option>
                <option value="2">2 rooms</option>
                <option value="3">3 rooms</option>
                <option value="4+">4+ rooms</option>
              </select>
              <CaretDown className="chevron" size={20} weight="regular" />
            </div>
            <div className="filter-divider"></div>
            <div className="search-field select-field">
              <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                <option value="">Price</option>
                <option value="0-3000">0–3000 MAD</option>
                <option value="3000-6000">3000–6000 MAD</option>
                <option value="6000-10000">6000–10000 MAD</option>
                <option value="10000-99999">10000+ MAD</option>
              </select>
              <CaretDown className="chevron" size={20} weight="regular" />
            </div>
            {hasActiveFilters && (
              <button className="catalogue-clear-btn" onClick={clearFilters}>Clear</button>
            )}
          </div>
        </div>

        <p className="catalogue-results-count">
          {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
          {hasActiveFilters && ` (filtered from ${allProperties.length})`}
        </p>

        <div className="catalogue-grid">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} onViewDetail={onViewDetail} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="catalogue-empty">
            <p>No properties match your filters.</p>
            <button onClick={clearFilters}>Clear all filters</button>
          </div>
        )}
      </div>
    </section>
  );
}
