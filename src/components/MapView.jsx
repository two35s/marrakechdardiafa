import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  X, MagnifyingGlass, XCircle, CurrencyCircleDollar, CaretDown, Bed, 
  FadersHorizontal, ArrowsDownUp, SmileySad, Heart, MapPin, CheckCircle, 
  SealCheck, Building, Stack, BoundingBox, List, CaretRight
} from '@phosphor-icons/react';


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
        <svg viewBox="0 0 256 256" fill="currentColor" style="width: 20px; height: 20px;">
          <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.5,64.7,40.6,93,22.1,24,47.4,30.3,47.4,30.3a8,8,0,0,0,1.4.1,8,8,0,0,0,1.4-.1s25.3-6.3,47.4-30.3c26.1-28.3,40.6-61.6,40.6-93A88.1,88.1,0,0,0,128,16Zm0,199.1C111.4,198.8,56,151.7,56,104a72,72,0,0,1,144,0C200,151.7,144.6,198.8,128,215.1Z"/>
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

  // Sync markers with filtered properties
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for filtered properties
    filteredProperties.forEach((prop) => {
      const marker = L.marker([prop.lat, prop.lng], {
        icon: createMarkerIcon(prop.price, false),
      }).addTo(mapInstanceRef.current);

      marker.propertyId = prop.id;

      marker.on('click', () => {
        setActiveProperty(prop);
        updateMarkers(prop.id);
      });

      markersRef.current.push(marker);
    });
  }, [filteredProperties]);

  const updateMarkers = (activeId) => {
    markersRef.current.forEach((marker) => {
      const prop = filteredProperties.find(p => p.id === marker.propertyId);
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
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="map-filters">
          <div className="map-search-input">
            <MagnifyingGlass size={18} weight="regular" />
            <input
              type="text"
              placeholder="District, Area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="map-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                <XCircle size={16} weight="fill" />
              </button>
            )}
          </div>

          <div className="map-filter-row">
            <div className="map-filter-select">
              <CurrencyCircleDollar size={18} weight="regular" />
              <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                <option value="">Price</option>
                <option value="0-3000">0 – 3000 MAD</option>
                <option value="3000-6000">3000 – 6000 MAD</option>
                <option value="6000-10000">6000 – 10000 MAD</option>
                <option value="10000-99999">10000+ MAD</option>
              </select>
              <CaretDown className="map-filter-chevron" size={16} weight="regular" />
            </div>

            <div className="map-filter-select">
              <Bed size={18} weight="regular" />
              <select value={roomsFilter} onChange={(e) => setRoomsFilter(e.target.value)}>
                <option value="">Rooms</option>
                <option value="1">1 room</option>
                <option value="2">2 rooms</option>
                <option value="3">3 rooms</option>
                <option value="4+">4+ rooms</option>
              </select>
              <CaretDown className="map-filter-chevron" size={16} weight="regular" />
            </div>

            <button
              className={`map-filters-btn ${activeFilterCount > 0 ? 'has-filters' : ''}`}
              onClick={clearFilters}
              title={activeFilterCount > 0 ? 'Clear all filters' : 'No active filters'}
            >
              <FadersHorizontal size={18} weight="regular" />
              Filters
              {activeFilterCount > 0 && (
                <span className="map-filter-count">{activeFilterCount}</span>
              )}
            </button>
          </div>

          <div className="map-results-row">
            <span className="map-results-count">{filteredProperties.length} results</span>
            <div className="map-sort-select">
              <ArrowsDownUp size={18} weight="regular" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Sort</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="area-desc">Largest Area</option>
                <option value="rooms-desc">Most Rooms</option>
              </select>
              <CaretDown className="map-filter-chevron" size={16} weight="regular" />
            </div>
          </div>
        </div>

        <div className="map-sidebar-list">
          {filteredProperties.length === 0 ? (
            <div className="map-empty-state">
              <SmileySad size={48} weight="regular" />
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
                      <Heart size={20} weight={likedProperties[prop.id] ? 'fill' : 'regular'} />
                    </button>
                  </div>
                  <div className="map-card-address">
                    <MapPin size={16} weight="regular" />
                    {prop.address}
                  </div>
                  <div className="map-card-badges">
                    {prop.badges && prop.badges.map(badge => (
                      <span key={badge} className={`badge badge-${badge.toLowerCase()}`}>
                        {badge === 'Available' && <CheckCircle size={14} weight="fill" />}
                        {badge === 'Verified' && <SealCheck size={14} weight="fill" />}
                        {badge === 'Realtor' && <Building size={14} weight="fill" />}
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="map-card-meta">
                    <span>
                      <Bed size={16} weight="regular" />
                      {prop.rooms} {prop.rooms === 1 ? 'room' : 'rooms'}
                    </span>
                    <span>
                      <Stack size={16} weight="regular" />
                      {prop.floor}
                    </span>
                    <span>
                      <BoundingBox size={16} weight="regular" />
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
        <button type="button" className="map-list-toggle mobile-only" onClick={() => setListOpen(true)}>
          <List size={20} weight="bold" />
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
          <CaretRight size={20} weight="bold" />
        </div>
      )}
    </div>
  );
}

