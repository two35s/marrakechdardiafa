import { useState, useMemo, useRef } from 'react';
import {
  Plus, House, CurrencyCircleDollar, BoundingBox, CheckCircle,
  MagnifyingGlass, PencilLine, Trash, WarningCircle, X, Check,
  SmileySad, SignOut, Bed, UploadSimple, SpinnerGap
} from '@phosphor-icons/react';
import { uploadImage } from '../lib/supabase';

const AVAILABLE_AMENITIES = [
  'Air Conditioning', 'Balcony', 'Concierge', 'Dishwasher', 'Elevator',
  'Furnished', 'Gym Access', 'Heating', 'Parking', 'Smart Home',
  'Terrace', 'Washing Machine', 'Wi-Fi'
];

const AVAILABLE_BADGES  = ['Available', 'Verified', 'Realtor'];
const PROPERTY_TYPES    = ['Apartment', 'Studio', 'Penthouse', 'Villa', 'Loft', 'Duplex'];
const HEATING_TYPES     = ['Reversible AC', 'Electric', 'Individual Gas', 'Underfloor', 'None'];
const AVAILABLE_IMAGES  = ['/apartment_card1.png', '/apartment_hero.png', '/apartment_card3.png'];

const emptyProperty = {
  image: '/apartment_card1.png',
  gallery: ['/apartment_card1.png', '/apartment_hero.png', '/apartment_card3.png'],
  price: '', address: '', badges: ['Available'],
  rooms: '', floor: '', area: '', lat: '', lng: '', description: '',
  amenities: [],
  details: { type: 'Apartment', yearBuilt: '', heating: 'Reversible AC', bathroom: '1 bathroom', petFriendly: false, deposit: '' }
};

export default function AdminDashboard({ properties, onAdd, onUpdate, onDelete, onLogout }) {
  const [showForm,      setShowForm]      = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [formData,      setFormData]      = useState({ ...emptyProperty });
  const [searchQuery,   setSearchQuery]   = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast,         setToast]         = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImg,  setUploadingImg]  = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const imgInputRef = useRef(null);

  const stats = useMemo(() => ({
    total:     properties.length,
    avgPrice:  properties.length ? Math.round(properties.reduce((s, p) => s + p.price, 0) / properties.length) : 0,
    totalArea: properties.reduce((s, p) => s + p.area, 0),
    available: properties.filter(p => p.badges.includes('Available')).length,
  }), [properties]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return properties;
    const q = searchQuery.toLowerCase();
    return properties.filter(p =>
      p.address?.toLowerCase().includes(q) ||
      p.details?.type?.toLowerCase().includes(q) ||
      String(p.price).includes(q)
    );
  }, [properties, searchQuery]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData(JSON.parse(JSON.stringify(emptyProperty)));
    setUploadedImages([]);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setFormData(JSON.parse(JSON.stringify(p)));
    const extras = [p.image, ...(p.gallery || [])].filter(
      img => img && !AVAILABLE_IMAGES.includes(img)
    );
    setUploadedImages([...new Set(extras)]);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    e.target.value = '';
    setUploadingImg(true);
    try {
      const url = await uploadImage(file);
      setUploadedImages(prev => prev.includes(url) ? prev : [...prev, url]);
      field('image', url);
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImg(false);
    }
  };

  const removeUploadedImage = (img) => {
    setUploadedImages(prev => prev.filter(i => i !== img));
    if (formData.image === img) field('image', AVAILABLE_IMAGES[0]);
  };

  const field  = (k, v) => setFormData(prev => ({ ...prev, [k]: v }));
  const detail = (k, v) => setFormData(prev => ({ ...prev, details: { ...prev.details, [k]: v } }));

  const toggleAmenity = (a) => setFormData(prev => ({
    ...prev,
    amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a]
  }));
  const toggleBadge = (b) => setFormData(prev => ({
    ...prev,
    badges: prev.badges.includes(b) ? prev.badges.filter(x => x !== b) : [...prev.badges, b]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price    = Number(formData.price);
    const rooms    = Number(formData.rooms);
    const area     = Number(formData.area);
    const lat      = Number(formData.lat);
    const lng      = Number(formData.lng);
    const yearBuilt = formData.details.yearBuilt ? Number(formData.details.yearBuilt) : null;

    if (price < 0)                         { showToast('Price cannot be negative', 'error'); return; }
    if (rooms < 1)                         { showToast('At least 1 room required', 'error'); return; }
    if (area  < 1)                         { showToast('Area must be at least 1 m²', 'error'); return; }
    if (lat && (lat < -90  || lat > 90))   { showToast('Invalid latitude', 'error'); return; }
    if (lng && (lng < -180 || lng > 180))  { showToast('Invalid longitude', 'error'); return; }

    const data = { ...formData, price, rooms, area, lat, lng, details: { ...formData.details, yearBuilt } };
    setSubmitting(true);
    try {
      if (editingId) {
        await onUpdate({ ...data, id: editingId });
        showToast('Property updated');
      } else {
        await onAdd(data);
        showToast('Property added');
      }
      closeForm();
    } catch (err) {
      showToast(err.message || 'Failed to save property', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      showToast('Property deleted', 'delete');
    } catch (err) {
      showToast(err.message || 'Failed to delete property', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="admin-page">

      {/* ── Dark top bar ── */}
      <div className="admin-topbar">
        <div className="admin-topbar-inner">
          <div>
            <p className="admin-eye"><span className="admin-eye-dot" />Admin Dashboard</p>
            <h1 className="admin-topbar-title">Manage <em>Listings</em></h1>
          </div>
          <div className="admin-topbar-actions">
            {onLogout && (
              <button className="admin-logout" onClick={onLogout}>
                <SignOut size={15} weight="bold" />
                Sign out
              </button>
            )}
            <button className="admin-add-btn" onClick={openAdd}>
              <Plus size={16} weight="bold" />
              Add property
            </button>
          </div>
        </div>
      </div>

      <div className="admin-inner">

        {/* ── Stats ── */}
        <div className="admin-stats">
          {[
            { icon: <House size={20} />,                    label: 'Total listings',  value: stats.total,                           accent: 'blue'  },
            { icon: <CurrencyCircleDollar size={20} />,     label: 'Avg. price / mo', value: `${stats.avgPrice.toLocaleString()} MAD`, accent: 'amber' },
            { icon: <BoundingBox size={20} />,              label: 'Total area',       value: `${stats.totalArea.toLocaleString()} m²`, accent: 'slate' },
            { icon: <CheckCircle size={20} weight="fill"/>, label: 'Available now',   value: stats.available,                        accent: 'green' },
          ].map(s => (
            <div key={s.label} className={`admin-stat admin-stat--${s.accent}`}>
              <div className="admin-stat-icon">{s.icon}</div>
              <div>
                <p className="admin-stat-value">{s.value}</p>
                <p className="admin-stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table section ── */}
        <div className="admin-table-section">
          <div className="admin-table-head">
            <div>
              <h2 className="admin-table-title">All Properties</h2>
              <p className="admin-table-sub">{filtered.length} of {properties.length} shown</p>
            </div>
            <div className="admin-search">
              <MagnifyingGlass size={15} className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search by address, type or price…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="admin-search-x" onClick={() => setSearchQuery('')} aria-label="Clear">
                  <X size={13} weight="bold" />
                </button>
              )}
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
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-prop-cell">
                        <img src={p.image} alt={p.address} className="admin-thumb" />
                        <div>
                          <p className="admin-prop-addr">{p.address}</p>
                          <p className="admin-prop-floor">{p.floor}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-price">
                        {p.price.toLocaleString()}
                        <span> MAD/mo</span>
                      </span>
                    </td>
                    <td><span className="admin-cell-meta"><Bed size={13} />{p.rooms}</span></td>
                    <td>{p.area} m²</td>
                    <td><span className="admin-type-pill">{p.details.type}</span></td>
                    <td>
                      <div className="admin-status-row">
                        {p.badges.includes('Available') && <span className="admin-badge admin-badge--green">Available</span>}
                        {p.badges.includes('Verified')  && <span className="admin-badge admin-badge--gray">Verified</span>}
                        {p.badges.includes('Realtor')   && <span className="admin-badge admin-badge--gray">Realtor</span>}
                      </div>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button className="admin-row-btn admin-row-btn--edit" onClick={() => openEdit(p)} title="Edit">
                          <PencilLine size={15} />
                        </button>
                        <button className="admin-row-btn admin-row-btn--del" onClick={() => setDeleteConfirm(p.id)} title="Delete">
                          <Trash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="admin-empty-row">
                      <SmileySad size={36} weight="regular" />
                      <span>No properties found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Delete modal ── */}
      {deleteConfirm && (
        <>
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)} />
          <div className="admin-confirm-modal">
            <div className="admin-confirm-icon">
              <WarningCircle size={32} weight="fill" />
            </div>
            <h3>Delete property?</h3>
            <p>This action cannot be undone.</p>
            <div className="admin-confirm-actions">
              <button className="admin-confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-confirm-delete" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </>
      )}

      {/* ── Slide-in form panel ── */}
      {showForm && (
        <>
          <div className="modal-overlay" onClick={closeForm} />
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3 className="admin-panel-title">{editingId ? 'Edit property' : 'Add new property'}</h3>
                <p className="admin-panel-sub">{editingId ? 'Update the details below' : 'Fill in the property details'}</p>
              </div>
              <button className="admin-panel-close" onClick={closeForm} aria-label="Close">
                <X size={18} weight="bold" />
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-scroll">

                <div className="admin-fs">
                  <p className="admin-fs-legend">Basic information</p>
                  <div className="admin-fg-row">
                    <div className="admin-fg">
                      <label>Address *</label>
                      <input type="text" value={formData.address} onChange={e => field('address', e.target.value)} placeholder="Ave Mohammed V, Gueliz" required />
                    </div>
                    <div className="admin-fg">
                      <label>Price (MAD/month) *</label>
                      <input type="number" value={formData.price} onChange={e => field('price', e.target.value)} placeholder="e.g. 5000" required min="0" />
                    </div>
                  </div>
                  <div className="admin-fg-row admin-fg-row-3">
                    <div className="admin-fg">
                      <label>Rooms *</label>
                      <input type="number" value={formData.rooms} onChange={e => field('rooms', e.target.value)} placeholder="e.g. 3" required min="1" />
                    </div>
                    <div className="admin-fg">
                      <label>Floor *</label>
                      <input type="text" value={formData.floor} onChange={e => field('floor', e.target.value)} placeholder="7 floor of 16" required />
                    </div>
                    <div className="admin-fg">
                      <label>Area (m²) *</label>
                      <input type="number" value={formData.area} onChange={e => field('area', e.target.value)} placeholder="e.g. 85" required min="1" />
                    </div>
                  </div>
                  <div className="admin-fg">
                    <label>Description</label>
                    <textarea value={formData.description} onChange={e => field('description', e.target.value)} placeholder="Describe the property…" rows="3" />
                  </div>
                </div>

                <div className="admin-fs">
                  <p className="admin-fs-legend">Location</p>
                  <div className="admin-fg-row">
                    <div className="admin-fg">
                      <label>Latitude</label>
                      <input type="number" step="any" value={formData.lat} onChange={e => field('lat', e.target.value)} placeholder="31.6295" />
                    </div>
                    <div className="admin-fg">
                      <label>Longitude</label>
                      <input type="number" step="any" value={formData.lng} onChange={e => field('lng', e.target.value)} placeholder="-7.9811" />
                    </div>
                  </div>
                </div>

                <div className="admin-fs">
                  <p className="admin-fs-legend">Main image</p>
                  <div className="admin-img-row">
                    {AVAILABLE_IMAGES.map(img => (
                      <button
                        key={img}
                        type="button"
                        className={`admin-img-opt${formData.image === img ? ' selected' : ''}`}
                        onClick={() => field('image', img)}
                      >
                        <img src={img} alt="" />
                        {formData.image === img && (
                          <div className="admin-img-check"><Check size={11} weight="bold" /></div>
                        )}
                      </button>
                    ))}
                    {uploadedImages.map(img => (
                      <div key={img} className="admin-img-opt-wrap">
                        <button
                          type="button"
                          className={`admin-img-opt${formData.image === img ? ' selected' : ''}`}
                          onClick={() => field('image', img)}
                        >
                          <img src={img} alt="" />
                          {formData.image === img && (
                            <div className="admin-img-check"><Check size={11} weight="bold" /></div>
                          )}
                        </button>
                        <button
                          type="button"
                          className="admin-img-remove"
                          onClick={() => removeUploadedImage(img)}
                          title="Remove image"
                        >
                          <X size={9} weight="bold" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className={`admin-img-upload-btn${uploadingImg ? ' loading' : ''}`}
                      onClick={() => !uploadingImg && imgInputRef.current?.click()}
                      title="Upload your own image"
                      disabled={uploadingImg}
                    >
                      {uploadingImg
                        ? <SpinnerGap size={20} className="admin-spin" />
                        : <UploadSimple size={20} weight="regular" />}
                      <span>{uploadingImg ? 'Uploading…' : 'Upload'}</span>
                    </button>
                    <input
                      ref={imgInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <div className="admin-fs">
                  <p className="admin-fs-legend">Property details</p>
                  <div className="admin-fg-row">
                    <div className="admin-fg">
                      <label>Type</label>
                      <select value={formData.details.type} onChange={e => detail('type', e.target.value)}>
                        {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="admin-fg">
                      <label>Year built</label>
                      <input type="number" value={formData.details.yearBuilt} onChange={e => detail('yearBuilt', e.target.value)} placeholder="e.g. 2015" />
                    </div>
                  </div>
                  <div className="admin-fg-row admin-fg-row-3">
                    <div className="admin-fg">
                      <label>Heating</label>
                      <select value={formData.details.heating} onChange={e => detail('heating', e.target.value)}>
                        {HEATING_TYPES.map(h => <option key={h}>{h}</option>)}
                      </select>
                    </div>
                    <div className="admin-fg">
                      <label>Bathroom</label>
                      <input type="text" value={formData.details.bathroom} onChange={e => detail('bathroom', e.target.value)} placeholder="2 bathrooms" />
                    </div>
                    <div className="admin-fg">
                      <label>Deposit</label>
                      <input type="text" value={formData.details.deposit} onChange={e => detail('deposit', e.target.value)} placeholder="10 000 MAD" />
                    </div>
                  </div>
                  <label className="admin-checkbox">
                    <input type="checkbox" checked={formData.details.petFriendly} onChange={e => detail('petFriendly', e.target.checked)} />
                    <span className="admin-checkbox-box" />
                    Pet friendly
                  </label>
                </div>

                <div className="admin-fs">
                  <p className="admin-fs-legend">Status badges</p>
                  <div className="admin-chips">
                    {AVAILABLE_BADGES.map(b => (
                      <button key={b} type="button" className={`admin-chip${formData.badges.includes(b) ? ' active' : ''}`} onClick={() => toggleBadge(b)}>
                        {formData.badges.includes(b) && <Check size={11} weight="bold" />}
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-fs">
                  <p className="admin-fs-legend">Amenities</p>
                  <div className="admin-chips">
                    {AVAILABLE_AMENITIES.map(a => (
                      <button key={a} type="button" className={`admin-chip${formData.amenities.includes(a) ? ' active' : ''}`} onClick={() => toggleAmenity(a)}>
                        {formData.amenities.includes(a) && <Check size={11} weight="bold" />}
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-form-footer">
                <button type="button" className="admin-form-cancel" onClick={closeForm} disabled={submitting}>Cancel</button>
                <button type="submit" className="admin-form-submit" disabled={submitting || uploadingImg}>
                  {submitting
                    ? <><SpinnerGap size={14} className="admin-spin" /> Saving…</>
                    : editingId ? 'Save changes' : 'Add property'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`admin-toast${toast.type === 'delete' ? ' admin-toast--del' : toast.type === 'error' ? ' admin-toast--error' : ''}`}>
          {toast.type === 'error'  ? <WarningCircle size={16} weight="bold" />
           : toast.type === 'delete' ? <Trash size={16} weight="bold" />
           : <Check size={16} weight="bold" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
