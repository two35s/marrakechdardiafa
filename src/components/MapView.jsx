import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  X, MagnifyingGlass, XCircle, CurrencyCircleDollar, CaretDown, Bed,
  ArrowsDownUp, Heart, MapPin, CheckCircle, SealCheck, Building,
  Stack, BoundingBox, List, ArrowRight, SlidersHorizontal
} from '@phosphor-icons/react';

/* ─── Price-pill marker (Airbnb style) ─────────────────────────── */
const fmtPrice = (p) => {
  if (p >= 10000) return `${Math.round(p / 1000)}k`;
  if (p >= 1000)  return `${(p / 1000).toFixed(p % 1000 === 0 ? 0 : 1)}k`;
  return `${p}`;
};

const createMarkerIcon = (price, isActive) =>
  L.divIcon({
    className: 'pm-marker',
    html: `<div class="pm-pill${isActive ? ' pm-pill--active' : ''}">
             <span class="pm-num">${fmtPrice(price)}</span>
             <span class="pm-cur">MAD</span>
           </div>`,
    iconSize: [76, 30],
    iconAnchor: [38, 15],
  });

export default function MapView({ properties, onViewDetail }) {
  const mapRef          = useRef(null);
  const mapInstanceRef  = useRef(null);
  const markersRef      = useRef([]);

  const [activeProperty, setActiveProperty] = useState(null);
  const [listOpen,       setListOpen]       = useState(false);
  const [likedProps,     setLikedProps]     = useState({});

  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [roomsFilter, setRoomsFilter] = useState('');
  const [sortBy,      setSortBy]      = useState('');

  const hasFilters = !!(searchQuery || priceFilter || roomsFilter || sortBy);

  const clearFilters = () => {
    setSearchQuery(''); setPriceFilter('');
    setRoomsFilter(''); setSortBy('');
  };

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikedProps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  /* ── Filtered + sorted list ─────────────────────────────────── */
  const filtered = useMemo(() => {
    let r = [...properties];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(p =>
        p.address.toLowerCase().includes(q) ||
        p.details?.type?.toLowerCase().includes(q)
      );
    }
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      r = r.filter(p => max ? p.price >= min && p.price <= max : p.price >= min);
    }
    if (roomsFilter) {
      r = roomsFilter === '4+'
        ? r.filter(p => p.rooms >= 4)
        : r.filter(p => p.rooms === Number(roomsFilter));
    }
    if (sortBy === 'price-asc')  r.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') r.sort((a, b) => b.price - a.price);
    if (sortBy === 'area-desc')  r.sort((a, b) => b.area - a.area);
    if (sortBy === 'rooms-desc') r.sort((a, b) => b.rooms - a.rooms);
    return r;
  }, [properties, searchQuery, priceFilter, roomsFilter, sortBy]);

  /* ── Init map ───────────────────────────────────────────────── */
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [31.6295, -7.9811],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    ).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('© <a href="https://carto.com/">CARTO</a> © <a href="https://osm.org/">OSM</a>')
      .addTo(map);

    mapInstanceRef.current = map;
    map.on('click', () => { setActiveProperty(null); refreshMarkers(null, filtered); });

    return () => { map.remove(); mapInstanceRef.current = null; markersRef.current = []; };
  }, []);

  /* ── Sync markers ───────────────────────────────────────────── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filtered.forEach(prop => {
      const marker = L.marker([prop.lat, prop.lng], {
        icon: createMarkerIcon(prop.price, false),
      }).addTo(map);

      marker._propId = prop.id;
      marker.on('click', () => {
        setActiveProperty(prop);
        refreshMarkers(prop.id, filtered);
      });
      markersRef.current.push(marker);
    });
  }, [filtered]);

  const refreshMarkers = (activeId, list) => {
    markersRef.current.forEach(m => {
      const prop = list.find(p => p.id === m._propId);
      if (prop) m.setIcon(createMarkerIcon(prop.price, prop.id === activeId));
    });
  };

  const handleHover = (prop) => {
    setActiveProperty(prop);
    refreshMarkers(prop.id, filtered);
    if (mapInstanceRef.current)
      mapInstanceRef.current.panTo([prop.lat, prop.lng], { animate: true, duration: 0.35 });
  };

  const handleLeave = () => {
    setActiveProperty(null);
    refreshMarkers(null, filtered);
  };

  return (
    <div className="map-page">

      {/* ── Sidebar ── */}
      <aside className={`map-sidebar${listOpen ? ' open' : ''}`}>

        {/* Header */}
        <div className="map-sb-header">
          <div>
            <h2 className="map-sb-title">Properties</h2>
            <p className="map-sb-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="map-sb-close mobile-only" onClick={() => setListOpen(false)} aria-label="Close list">
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Filters */}
        <div className="map-filters">
          {/* Search */}
          <div className="map-search">
            <MagnifyingGlass size={16} className="map-search-icon" />
            <input
              type="text"
              placeholder="Search by address or type…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="map-search-x" onClick={() => setSearchQuery('')} aria-label="Clear">
                <XCircle size={15} weight="fill" />
              </button>
            )}
          </div>

          {/* Filter row */}
          <div className="map-filter-row">
            <div className="map-fsel">
              <CurrencyCircleDollar size={14} className="map-fsel-icon" />
              <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
                <option value="">Budget</option>
                <option value="0-3000">0 – 3,000</option>
                <option value="3000-6000">3 – 6k MAD</option>
                <option value="6000-10000">6 – 10k MAD</option>
                <option value="10000-99999">10k+ MAD</option>
              </select>
              <CaretDown size={12} className="map-fsel-caret" />
            </div>

            <div className="map-fsel">
              <Bed size={14} className="map-fsel-icon" />
              <select value={roomsFilter} onChange={e => setRoomsFilter(e.target.value)}>
                <option value="">Rooms</option>
                <option value="1">1 room</option>
                <option value="2">2 rooms</option>
                <option value="3">3 rooms</option>
                <option value="4+">4+ rooms</option>
              </select>
              <CaretDown size={12} className="map-fsel-caret" />
            </div>

            <div className="map-fsel map-fsel--sort">
              <ArrowsDownUp size={14} className="map-fsel-icon" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="">Sort</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="area-desc">Largest</option>
                <option value="rooms-desc">Most rooms</option>
              </select>
              <CaretDown size={12} className="map-fsel-caret" />
            </div>
          </div>

          {/* Active filter strip */}
          {hasFilters && (
            <div className="map-filter-meta">
              <span className="map-filter-active-dot">
                <SlidersHorizontal size={12} weight="bold" />
                Filters active
              </span>
              <button className="map-clear-btn" onClick={clearFilters}>Clear all</button>
            </div>
          )}
        </div>

        {/* List */}
        <div className="map-list">
          {filtered.length === 0 ? (
            <div className="map-empty">
              <span className="map-empty-icon">◇</span>
              <p>No properties match your search.</p>
              <button className="map-empty-clear" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            filtered.map(prop => (
              <div
                key={prop.id}
                className={`map-card${activeProperty?.id === prop.id ? ' map-card--active' : ''}`}
                onMouseEnter={() => handleHover(prop)}
                onMouseLeave={handleLeave}
              >
                <div className="map-card-img" onClick={() => onViewDetail?.(prop.id)}>
                  <img src={prop.image} alt={prop.address} loading="lazy" />
                </div>

                <div className="map-card-body">
                  <div className="map-card-price-row">
                    <div className="map-card-price">
                      {prop.price.toLocaleString()}
                      <span> MAD/mo</span>
                    </div>
                    <button
                      className={`map-like${likedProps[prop.id] ? ' liked' : ''}`}
                      onClick={e => toggleLike(e, prop.id)}
                      aria-label={likedProps[prop.id] ? 'Unlike' : 'Like'}
                    >
                      <Heart size={17} weight={likedProps[prop.id] ? 'fill' : 'regular'} />
                    </button>
                  </div>

                  <div className="map-card-addr">
                    <MapPin size={12} weight="fill" className="map-addr-pin" />
                    {prop.address}
                  </div>

                  <div className="map-card-meta">
                    <span><Bed size={12} />{prop.rooms} {prop.rooms === 1 ? 'rm' : 'rms'}</span>
                    <span><BoundingBox size={12} />{prop.area} m²</span>
                    <span><Stack size={12} />{prop.floor}</span>
                  </div>

                  <div className="map-card-badges">
                    {prop.badges?.includes('Available') && (
                      <span className="badge badge-available">
                        <CheckCircle size={11} weight="fill" />Available
                      </span>
                    )}
                    {prop.badges?.includes('Verified') && (
                      <span className="badge badge-verified">
                        <SealCheck size={11} weight="fill" />Verified
                      </span>
                    )}
                    {prop.badges?.includes('Realtor') && (
                      <span className="badge badge-realtor">
                        <Building size={11} weight="fill" />Realtor
                      </span>
                    )}
                  </div>

                  <button
                    className="map-card-cta"
                    onClick={e => { e.stopPropagation(); onViewDetail?.(prop.id); }}
                  >
                    View property
                    <ArrowRight size={13} weight="bold" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── Map ── */}
      <div className="map-container" ref={mapRef}>
        {/* Mobile toggle */}
        <button className="map-toggle mobile-only" onClick={() => setListOpen(true)}>
          <List size={17} weight="bold" />
          {filtered.length} listings
        </button>
      </div>

      {/* ── Floating popup (desktop marker click) ── */}
      {activeProperty && (
        <div
          className="map-popup"
          onClick={() => onViewDetail?.(activeProperty.id)}
          role="button"
          tabIndex={0}
        >
          <button
            className="map-popup-close"
            onClick={e => { e.stopPropagation(); setActiveProperty(null); refreshMarkers(null, filtered); }}
            aria-label="Close"
          >
            <X size={14} weight="bold" />
          </button>
          <img src={activeProperty.image} alt={activeProperty.address} className="map-popup-img" />
          <div className="map-popup-body">
            <div className="map-popup-price">
              {activeProperty.price.toLocaleString()}
              <span> MAD/mo</span>
            </div>
            <div className="map-popup-addr">{activeProperty.address}</div>
            <div className="map-popup-meta">
              {activeProperty.rooms} {activeProperty.rooms === 1 ? 'room' : 'rooms'} · {activeProperty.area} m²
            </div>
            <div className="map-popup-cta">
              View property <ArrowRight size={13} weight="bold" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
