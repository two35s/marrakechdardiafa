import { useState, useMemo } from 'react';

const AVAILABLE_AMENITIES = [
  'Air Conditioning', 'Balcony', 'Concierge', 'Dishwasher', 'Elevator',
  'Furnished', 'Gym Access', 'Heating', 'Parking', 'Smart Home',
  'Terrace', 'Washing Machine', 'Wi-Fi'
];

const AVAILABLE_BADGES = ['Available', 'Verified', 'Realtor'];

const PROPERTY_TYPES = ['Apartment', 'Studio', 'Penthouse', 'Villa', 'Loft', 'Duplex'];
const HEATING_TYPES = ['Reversible AC', 'Electric', 'Individual Gas', 'Underfloor', 'None'];
const AVAILABLE_IMAGES = ['/apartment_card1.png', '/apartment_hero.png', '/apartment_card3.png'];

const emptyProperty = {
  image: '/apartment_card1.png',
  gallery: ['/apartment_card1.png', '/apartment_hero.png', '/apartment_card3.png'],
  price: '',
  address: '',
  badges: ['Available'],
  rooms: '',
  floor: '',
  area: '',
  lat: '',
  lng: '',
  description: '',
  amenities: [],
  details: {
    type: 'Apartment',
    yearBuilt: '',
    heating: 'Reversible AC',
    bathroom: '1 bathroom',
    petFriendly: false,
    deposit: ''
  }
};

export default function AdminDashboard({ properties, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...emptyProperty });
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  // Stats
  const stats = useMemo(() => ({
    total: properties.length,
    avgPrice: properties.length ? Math.round(properties.reduce((s, p) => s + p.price, 0) / properties.length) : 0,
    totalArea: properties.reduce((s, p) => s + p.area, 0),
    available: properties.filter(p => p.badges.includes('Available')).length,
  }), [properties]);

  // Filtered properties
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return properties;
    const q = searchQuery.toLowerCase();
    return properties.filter(p =>
      p.address?.toLowerCase().includes(q) ||
      p.details?.type?.toLowerCase().includes(q) ||
      String(p.price).includes(q)
    );
  }, [properties, searchQuery]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(JSON.parse(JSON.stringify(emptyProperty)));
    setShowForm(true);
  };

  const handleOpenEdit = (property) => {
    setEditingId(property.id);
    setFormData(JSON.parse(JSON.stringify(property)));
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDetailChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      details: { ...prev.details, [field]: value }
    }));
  };

  const handleToggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleToggleBadge = (badge) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price),
      rooms: Number(formData.rooms),
      area: Number(formData.area),
      lat: Number(formData.lat),
      lng: Number(formData.lng),
      details: {
        ...formData.details,
        yearBuilt: Number(formData.details.yearBuilt),
      }
    };

    if (editingId) {
      onUpdate({ ...data, id: editingId });
      showToast('Property updated successfully');
    } else {
      onAdd(data);
      showToast('Property added successfully');
    }
    handleCloseForm();
  };

  const handleDelete = (id) => {
    onDelete(id);
    setDeleteConfirm(null);
    showToast('Property deleted', 'delete');
  };

  return (
    <section className="admin-page">
      <div className="admin-inner">

        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 13a3 3 0 100-6 3 3 0 000 6z"/>
                <path d="M17.4 11c.1-.3.1-.7.1-1s0-.7-.1-1l2.1-1.6a.5.5 0 00.1-.6l-2-3.5a.5.5 0 00-.6-.2l-2.5 1a7.5 7.5 0 00-1.7-1L12.3.6a.5.5 0 00-.5-.4h-4a.5.5 0 00-.5.4l-.4 2.7c-.6.3-1.2.6-1.7 1l-2.5-1a.5.5 0 00-.6.2l-2 3.5a.5.5 0 00.1.6L2.3 9c-.1.3-.1.7-.1 1s0 .7.1 1L.2 12.6a.5.5 0 00-.1.6l2 3.5c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.7c0 .2.2.4.5.4h4c.2 0 .4-.2.5-.4l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1c.2.1.5 0 .6-.2l2-3.5a.5.5 0 00-.1-.6L17.4 11z"/>
              </svg>
              Admin Dashboard
            </h1>
            <p className="admin-subtitle">Manage your property listings</p>
          </div>
          <button className="admin-add-btn" onClick={handleOpenAdd}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 4v12M4 10h12"/>
            </svg>
            Add Property
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="stat-card-icon stat-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/>
              </svg>
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{stats.total}</span>
              <span className="stat-card-label">Total Properties</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-card-icon stat-icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{stats.avgPrice} MAD</span>
              <span className="stat-card-label">Avg. Price / mo</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-card-icon stat-icon-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>
              </svg>
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{stats.totalArea} m²</span>
              <span className="stat-card-label">Total Area</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-card-icon stat-icon-emerald">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12l5 5L20 7"/>
              </svg>
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{stats.available}</span>
              <span className="stat-card-label">Available</span>
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="admin-table-section">
          <div className="admin-table-header">
            <h2 className="admin-table-title">All Properties</h2>
            <div className="admin-search">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="9" r="6"/>
                <path d="M14 14l4 4"/>
              </svg>
              <input
                type="text"
                placeholder="Search by address, type or price..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Price</th>
                  <th>Rooms</th>
                  <th>Area</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(property => (
                  <tr key={property.id}>
                    <td>
                      <div className="admin-property-cell">
                        <img src={property.image} alt={property.address} className="admin-property-thumb" />
                        <div className="admin-property-info">
                          <span className="admin-property-address">{property.address}</span>
                          <span className="admin-property-floor">{property.floor}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-price">{property.price} MAD<span>/mo</span></span>
                    </td>
                    <td>{property.rooms}</td>
                    <td>{property.area} m²</td>
                    <td>
                      <span className="admin-type-badge">{property.details.type}</span>
                    </td>
                    <td>
                      <div className="admin-status-badges">
                        {property.badges.includes('Available') && <span className="admin-badge admin-badge-green">Available</span>}
                        {property.badges.includes('Verified') && <span className="admin-badge admin-badge-gray">Verified</span>}
                      </div>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn admin-edit-btn" onClick={() => handleOpenEdit(property)} title="Edit">
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M13.586 3.586a2 2 0 012.828 2.828l-8.793 8.793-3.828.707.707-3.828 8.793-8.793z"/>
                          </svg>
                        </button>
                        <button className="admin-action-btn admin-delete-btn" onClick={() => setDeleteConfirm(property.id)} title="Delete">
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 5h12M7 5V4a2 2 0 012-2h2a2 2 0 012 2v1M8 9v5M12 9v5M5 5l1 11a2 2 0 002 2h4a2 2 0 002-2l1-11"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="admin-empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                      <span>No properties found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteConfirm && (
        <>
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}></div>
          <div className="admin-confirm-modal">
            <div className="confirm-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <h3>Delete Property</h3>
            <p>Are you sure you want to remove this property? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="confirm-delete" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit form modal */}
      {showForm && (
        <>
          <div className="modal-overlay" onClick={handleCloseForm}></div>
          <div className="admin-form-modal">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Property' : 'Add New Property'}</h3>
              <button className="modal-close" onClick={handleCloseForm}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-scroll">

                {/* Basic Info */}
                <fieldset className="admin-fieldset">
                  <legend>Basic Information</legend>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Address *</label>
                      <input type="text" value={formData.address} onChange={(e) => handleFieldChange('address', e.target.value)} placeholder="e.g. Ave Mohammed V, Gueliz" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Price (MAD/month) *</label>
                      <input type="number" value={formData.price} onChange={(e) => handleFieldChange('price', e.target.value)} placeholder="e.g. 610" required min="0" />
                    </div>
                  </div>

                  <div className="admin-form-row admin-form-row-3">
                    <div className="admin-form-group">
                      <label>Rooms *</label>
                      <input type="number" value={formData.rooms} onChange={(e) => handleFieldChange('rooms', e.target.value)} placeholder="e.g. 3" required min="1" />
                    </div>
                    <div className="admin-form-group">
                      <label>Floor *</label>
                      <input type="text" value={formData.floor} onChange={(e) => handleFieldChange('floor', e.target.value)} placeholder="e.g. 7 floor of 16" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Area (m²) *</label>
                      <input type="number" value={formData.area} onChange={(e) => handleFieldChange('area', e.target.value)} placeholder="e.g. 81" required min="1" />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea value={formData.description} onChange={(e) => handleFieldChange('description', e.target.value)} placeholder="Describe the property..." rows="3"></textarea>
                  </div>
                </fieldset>

                {/* Location */}
                <fieldset className="admin-fieldset">
                  <legend>Location</legend>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Latitude</label>
                      <input type="number" step="any" value={formData.lat} onChange={(e) => handleFieldChange('lat', e.target.value)} placeholder="e.g. 31.6325" />
                    </div>
                    <div className="admin-form-group">
                      <label>Longitude</label>
                      <input type="number" step="any" value={formData.lng} onChange={(e) => handleFieldChange('lng', e.target.value)} placeholder="e.g. -8.0012" />
                    </div>
                  </div>
                </fieldset>

                {/* Images */}
                <fieldset className="admin-fieldset">
                  <legend>Images</legend>
                  <div className="admin-form-group">
                    <label>Main Image</label>
                    <div className="admin-image-select">
                      {AVAILABLE_IMAGES.map(img => (
                        <button
                          key={img}
                          type="button"
                          className={`admin-image-option ${formData.image === img ? 'selected' : ''}`}
                          onClick={() => handleFieldChange('image', img)}
                        >
                          <img src={img} alt={img} />
                          {formData.image === img && (
                            <div className="admin-image-check">
                              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l4 4 6-6"/></svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </fieldset>

                {/* Property Details */}
                <fieldset className="admin-fieldset">
                  <legend>Property Details</legend>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Type</label>
                      <select value={formData.details.type} onChange={(e) => handleDetailChange('type', e.target.value)}>
                        {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Year Built</label>
                      <input type="number" value={formData.details.yearBuilt} onChange={(e) => handleDetailChange('yearBuilt', e.target.value)} placeholder="e.g. 2021" />
                    </div>
                  </div>
                  <div className="admin-form-row admin-form-row-3">
                    <div className="admin-form-group">
                      <label>Heating</label>
                      <select value={formData.details.heating} onChange={(e) => handleDetailChange('heating', e.target.value)}>
                        {HEATING_TYPES.map(h => <option key={h}>{h}</option>)}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Bathroom</label>
                      <input type="text" value={formData.details.bathroom} onChange={(e) => handleDetailChange('bathroom', e.target.value)} placeholder="e.g. 2 bathrooms" />
                    </div>
                    <div className="admin-form-group">
                      <label>Deposit</label>
                      <input type="text" value={formData.details.deposit} onChange={(e) => handleDetailChange('deposit', e.target.value)} placeholder="e.g. 1200 MAD" />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-checkbox-label">
                      <input type="checkbox" checked={formData.details.petFriendly} onChange={(e) => handleDetailChange('petFriendly', e.target.checked)} />
                      <span className="admin-checkbox-custom"></span>
                      Pet Friendly
                    </label>
                  </div>
                </fieldset>

                {/* Badges */}
                <fieldset className="admin-fieldset">
                  <legend>Status Badges</legend>
                  <div className="admin-toggle-group">
                    {AVAILABLE_BADGES.map(badge => (
                      <button
                        key={badge}
                        type="button"
                        className={`admin-toggle-chip ${formData.badges.includes(badge) ? 'active' : ''}`}
                        onClick={() => handleToggleBadge(badge)}
                      >
                        {formData.badges.includes(badge) && (
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l4 4 6-6"/></svg>
                        )}
                        {badge}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Amenities */}
                <fieldset className="admin-fieldset">
                  <legend>Amenities</legend>
                  <div className="admin-toggle-group">
                    {AVAILABLE_AMENITIES.map(amenity => (
                      <button
                        key={amenity}
                        type="button"
                        className={`admin-toggle-chip ${formData.amenities.includes(amenity) ? 'active' : ''}`}
                        onClick={() => handleToggleAmenity(amenity)}
                      >
                        {formData.amenities.includes(amenity) && (
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l4 4 6-6"/></svg>
                        )}
                        {amenity}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-form-cancel" onClick={handleCloseForm}>Cancel</button>
                <button type="submit" className="admin-form-submit">
                  {editingId ? 'Save Changes' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Toast notification */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            {toast.type === 'delete'
              ? <><circle cx="10" cy="10" r="8"/><path d="M7 10l2 2 4-4"/></>
              : <><circle cx="10" cy="10" r="8"/><path d="M7 10l2 2 4-4"/></>
            }
          </svg>
          {toast.message}
        </div>
      )}
    </section>
  );
}
