import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Custom marker SVG for a premium look
const createMarkerIcon = (price, isActive) => {
  const bg = isActive ? '#111111' : '#ffffff';
  const color = isActive ? '#ffffff' : '#111111';
  const border = isActive ? '#111111' : '#d4d4d0';
  const shadow = isActive ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.12)';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-inner" style="
        background: ${bg};
        color: ${color};
        border: 2px solid ${border};
        border-radius: 50%;
        width: 36px;
        height: 36px;
        box-sizing: border-box;
        box-shadow: ${shadow};
        transform: ${isActive ? 'scale(1.15)' : 'scale(1)'};
        transition: all 0.2s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

export default function MapView({ properties, onViewDetail }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [activeProperty, setActiveProperty] = useState(null);
  const [listOpen, setListOpen] = useState(false);
  const [likedProperties, setLikedProperties] = useState({});

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [roomsFilter, setRoomsFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  const toggleLike = (e, propId) => {
    e.stopPropagation();
    setLikedProperties(prev => ({ ...prev, [propId]: !prev[propId] }));
  };

  // Count active filters (price + rooms)
  const activeFilterCount = [priceFilter, roomsFilter].filter(Boolean).length;

  // Filtered + sorted properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search by address
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.address.toLowerCase().includes(q) ||
        p.details?.type?.toLowerCase().includes(q)
      );
    }

    // Price filter
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      result = result.filter(p => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min; // "1000+" case
      });
    }

    // Rooms filter
    if (roomsFilter) {
      if (roomsFilter === '4+') {
        result = result.filter(p => p.rooms >= 4);
      } else {
        result = result.filter(p => p.rooms === Number(roomsFilter));
      }
    }

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'area-desc') result.sort((a, b) => b.area - a.area);
    else if (sortBy === 'rooms-desc') result.sort((a, b) => b.rooms - a.rooms);

    return result;
  }, [properties, searchQuery, priceFilter, roomsFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setPriceFilter('');
    setRoomsFilter('');
    setSortBy('');
  };

  // Initialize map
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [31.6295, -7.9811],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('© <a href="https://carto.com/">CARTO</a> © <a href="https://osm.org/">OSM</a>')
      .addTo(map);

    mapInstanceRef.current = map;

    properties.forEach((prop) => {
      const marker = L.marker([prop.lat, prop.lng], {
        icon: createMarkerIcon(prop.price, false),
      }).addTo(map);

      marker.propertyId = prop.id;

      marker.on('click', () => {
        setActiveProperty(prop);
        updateMarkers(prop.id);
      });

      markersRef.current.push(marker);
    });

    map.on('click', () => {
      setActiveProperty(null);
      updateMarkers(null);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, []);

  const updateMarkers = (activeId) => {
    markersRef.current.forEach((marker) => {
      const prop = properties.find(p => p.id === marker.propertyId);
      if (prop) {
        marker.setIcon(createMarkerIcon(prop.price, prop.id === activeId));
      }
    });
  };

  const handlePropertyHover = (prop) => {
    setActiveProperty(prop);
    updateMarkers(prop.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([prop.lat, prop.lng], { animate: true, duration: 0.4 });
    }
  };

  const handleViewDetail = (id) => {
    if (onViewDetail) onViewDetail(id);
  };

  return (
    <div className="map-page">
      {/* Sidebar property list */}
      <aside className={`map-sidebar ${listOpen ? 'open' : ''}`}>
        <div className="map-sidebar-header">
          <div>
            <h2 className="map-sidebar-title">Catalogue</h2>
          </div>
          <button className="map-sidebar-close mobile-only" onClick={() => setListOpen(false)}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15"/>
            </svg>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="map-filters">
          <div className="map-search-input">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="9" r="6"/><path d="M14 14l4 4"/>
            </svg>
            <input
              type="text"
              placeholder="District, Area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="map-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8"/></svg>
              </button>
            )}
          </div>

          <div className="map-filter-row">
            <div className="map-filter-select">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="8"/><path d="M10 6v4l2 2"/>
              </svg>
              <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                <option value="">Price</option>
                <option value="0-3000">0 – 3000 MAD</option>
                <option value="3000-6000">3000 – 6000 MAD</option>
                <option value="6000-10000">6000 – 10000 MAD</option>
                <option value="10000-99999">10000+ MAD</option>
              </select>
              <svg className="map-filter-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8l4 4 4-4"/></svg>
            </div>

            <div className="map-filter-select">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="14" height="12" rx="2"/><path d="M3 9h14"/>
              </svg>
              <select value={roomsFilter} onChange={(e) => setRoomsFilter(e.target.value)}>
                <option value="">Rooms</option>
                <option value="1">1 room</option>
                <option value="2">2 rooms</option>
                <option value="3">3 rooms</option>
                <option value="4+">4+ rooms</option>
              </select>
              <svg className="map-filter-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8l4 4 4-4"/></svg>
            </div>

            <button
              className={`map-filters-btn ${activeFilterCount > 0 ? 'has-filters' : ''}`}
              onClick={clearFilters}
              title={activeFilterCount > 0 ? 'Clear all filters' : 'No active filters'}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5h14M6 10h8M9 15h2"/>
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="map-filter-count">{activeFilterCount}</span>
              )}
            </button>
          </div>

          <div className="map-results-row">
            <span className="map-results-count">{filteredProperties.length} results</span>
            <div className="map-sort-select">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h12M6 10h8M8 14h4"/>
              </svg>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Sort</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="area-desc">Largest Area</option>
                <option value="rooms-desc">Most Rooms</option>
              </select>
              <svg className="map-filter-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8l4 4 4-4"/></svg>
            </div>
          </div>
        </div>

        <div className="map-sidebar-list">
          {filteredProperties.length === 0 ? (
            <div className="map-empty-state">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="24" cy="24" r="20"/>
                <path d="M16 28s2 4 8 4 8-4 8-4"/>
                <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none"/>
                <circle cx="30" cy="20" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
              <p>No properties match your filters</p>
              <button className="map-empty-clear" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            filteredProperties.map((prop) => (
              <div
                key={prop.id}
                data-property-id={prop.id}
                className={`map-property-card ${activeProperty?.id === prop.id ? 'active' : ''}`}
                onMouseEnter={() => handlePropertyHover(prop)}
                onMouseLeave={() => { setActiveProperty(null); updateMarkers(null); }}
              >
                <div className="map-card-image" onClick={() => handleViewDetail(prop.id)}>
                  <img src={prop.image} alt={prop.address} />
                  <div className="map-card-dots">
                    {(prop.gallery || [prop.image]).map((_, i) => (
                      <span key={i} className={`map-dot ${i === 0 ? 'active' : ''}`}></span>
                    ))}
                  </div>
                </div>
                <div className="map-card-info">
                  <div className="map-card-price-row">
                    <div className="map-card-price">{prop.price} MAD <span>/ month</span></div>
                    <button
                      className={`map-like-btn ${likedProperties[prop.id] ? 'liked' : ''}`}
                      onClick={(e) => toggleLike(e, prop.id)}
                      aria-label={likedProperties[prop.id] ? 'Unlike' : 'Like'}
                    >
                      <svg viewBox="0 0 20 20" fill={likedProperties[prop.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                        <path d="M10 17s-7-4.5-7-9a7 7 0 0114 0c0 4.5-7 9-7 9z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="map-card-address">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"/>
                      <circle cx="8" cy="6" r="2"/>
                    </svg>
                    {prop.address}
                  </div>
                  <div className="map-card-badges">
                    {prop.badges && prop.badges.map(badge => (
                      <span key={badge} className={`badge badge-${badge.toLowerCase()}`}>
                        {badge === 'Available' && <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l4 4 6-6"/></svg>}
                        {badge === 'Verified' && <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.4l-3.7 1.9.7-4.1L2 6.3l4.2-.7L8 2z"/></svg>}
                        {badge === 'Realtor' && <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="10" rx="1"/><path d="M5 7h6M5 10h4"/></svg>}
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="map-card-meta">
                    <span>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="14" height="9" rx="1"/><path d="M5 5V4a3 3 0 016 0v1"/></svg>
                      {prop.rooms} {prop.rooms === 1 ? 'room' : 'rooms'}
                    </span>
                    <span>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v5M8 14v-3M2 8h3M14 8h-3"/></svg>
                      {prop.floor}
                    </span>
                    <span>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1"/></svg>
                      {prop.area} m²
                    </span>
                  </div>
                  <button className="map-tour-btn" onClick={(e) => { e.stopPropagation(); handleViewDetail(prop.id); }}>
                    Request a tour
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Map container */}
      <div className="map-container" ref={mapRef}>
        <button className="map-list-toggle mobile-only" onClick={() => setListOpen(true)}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 5h14M3 10h14M3 15h14"/>
          </svg>
          <span>{filteredProperties.length} Listings</span>
        </button>
      </div>

      {/* Floating property card on map (when marker clicked) */}
      {activeProperty && (
        <div className="map-floating-card" onClick={() => handleViewDetail(activeProperty.id)}>
          <img src={activeProperty.image} alt={activeProperty.address} className="floating-card-img" />
          <div className="floating-card-body">
            <div className="floating-card-price">{activeProperty.price} MAD<span>/mo</span></div>
            <div className="floating-card-address">{activeProperty.address}</div>
            <div className="floating-card-meta">
              {activeProperty.rooms} {activeProperty.rooms === 1 ? 'room' : 'rooms'} · {activeProperty.area} m²
            </div>
          </div>
          <svg className="floating-card-arrow" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 4l6 6-6 6"/>
          </svg>
        </div>
      )}
    </div>
  );
}

