import { useState, useMemo } from 'react';
import PropertyCard from './PropertyCard';
import { Bed, CurrencyCircleDollar, CaretDown, X, Funnel } from '@phosphor-icons/react';

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

  const roomsLabel = roomsFilter
    ? (roomsFilter === '4+' ? '4+ rooms' : `${roomsFilter} room${roomsFilter === '1' ? '' : 's'}`)
    : null;

  const priceLabel = priceFilter
    ? { '0-3000': '0–3k MAD', '3000-6000': '3–6k MAD', '6000-10000': '6–10k MAD', '10000-99999': '10k+ MAD' }[priceFilter]
    : null;

  return (
    <div className="catalogue-page">
      {/* ── Page header ── */}
      <div className="cat-hero">
        <div className="cat-hero-inner">
          <p className="cat-eyebrow">
            <span className="cat-eyebrow-dot" />
            Browse all listings
          </p>
          <h1 className="cat-title">Our <em>Catalogue</em></h1>
          <p className="cat-subtitle">Exceptional stays across the Red City — riads, apartments & villas</p>
        </div>
        <div className="cat-hero-ornament" aria-hidden="true" />
      </div>

      <div className="catalogue-inner">
        {/* ── Toolbar ── */}
        <div className="cat-toolbar">
          <div className="cat-filters">
            <span className="cat-filters-label">
              <Funnel size={14} weight="bold" />
              Filter
            </span>

            <div className="cat-filter-pill">
              <Bed size={15} weight="regular" className="cat-filter-icon" />
              <select value={roomsFilter} onChange={e => setRoomsFilter(e.target.value)}>
                <option value="">All rooms</option>
                <option value="1">1 room</option>
                <option value="2">2 rooms</option>
                <option value="3">3 rooms</option>
                <option value="4+">4+ rooms</option>
              </select>
              <CaretDown size={13} className="cat-filter-caret" />
            </div>

            <div className="cat-filter-pill">
              <CurrencyCircleDollar size={15} weight="regular" className="cat-filter-icon" />
              <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
                <option value="">All budgets</option>
                <option value="0-3000">0–3,000 MAD</option>
                <option value="3000-6000">3,000–6,000 MAD</option>
                <option value="6000-10000">6,000–10,000 MAD</option>
                <option value="10000-99999">10,000+ MAD</option>
              </select>
              <CaretDown size={13} className="cat-filter-caret" />
            </div>

            {hasActiveFilters && (
              <div className="cat-active-chips">
                {roomsLabel && (
                  <span className="cat-chip">
                    {roomsLabel}
                    <button onClick={() => setRoomsFilter('')} aria-label="Remove rooms filter"><X size={11} weight="bold" /></button>
                  </span>
                )}
                {priceLabel && (
                  <span className="cat-chip">
                    {priceLabel}
                    <button onClick={() => setPriceFilter('')} aria-label="Remove price filter"><X size={11} weight="bold" /></button>
                  </span>
                )}
              </div>
            )}
          </div>

          <p className="cat-count">
            <strong>{filteredProperties.length}</strong>
            {' '}{filteredProperties.length === 1 ? 'property' : 'properties'}
            {hasActiveFilters && <span className="cat-count-of"> of {allProperties.length}</span>}
          </p>
        </div>

        <div className="cat-divider" />

        {/* ── Grid ── */}
        {filteredProperties.length > 0 ? (
          <div className="cat-grid">
            {filteredProperties.map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetail={onViewDetail}
                style={{ '--i': i }}
              />
            ))}
          </div>
        ) : (
          <div className="cat-empty">
            <div className="cat-empty-icon" aria-hidden="true">◇</div>
            <h3 className="cat-empty-title">No properties found</h3>
            <p className="cat-empty-sub">Try adjusting your filters to see more results.</p>
            <button className="cat-empty-btn" onClick={clearFilters}>Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
