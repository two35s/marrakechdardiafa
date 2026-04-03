import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Listings from './components/Listings';
import Catalogue from './components/Catalogue';
import PropertyDetail from './components/PropertyDetail';
import { supabase, mapSupabaseToProperty, mapPropertyToSupabase } from './lib/supabase';

const MapView = lazy(() => import('./components/MapView'));
const StaggeredMenu = lazy(() => import('./components/StaggeredMenu'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const REPO_PREFIX = '/marrakechdardiafa';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

function parsePath() {
  let path = window.location.pathname.toLowerCase();
  if (path.startsWith(REPO_PREFIX)) {
    path = path.slice(REPO_PREFIX.length) || '/';
  }
  const propertyMatch = path.match(/^\/property\/([a-zA-Z0-9-]+)$/);
  if (propertyMatch) return { page: 'PropertyDetail', id: propertyMatch[1] };
  if (path === '/catalogue' || path === '/catalog') return { page: 'Catalogue', id: null };
  if (path === '/map') return { page: 'Map', id: null };
  if (path === '/admin') return { page: 'Admin', id: null };
  return { page: 'Home', id: null };
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activePage, setActivePage] = useState(() => parsePath().page);
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => parsePath().id);

  // Admin authentication state
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('properties').select('*');
        if (error) {
          console.error('Error fetching properties:', error);
          setError('Failed to load properties. Please try again later.');
        } else if (data) {
          setProperties(data.map(mapSupabaseToProperty));
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
      }
      setLoading(false);
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePath();
      setSelectedPropertyId(parsed.id);
      setActivePage(parsed.page);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page) => {
    setActivePage(page);
    setSelectedPropertyId(null);
    const paths = { Catalogue: '/catalogue', Map: '/map', Admin: '/admin', Home: '/' };
    const targetPath = paths[page] || '/';
    window.history.pushState({}, '', REPO_PREFIX + targetPath);
    window.scrollTo(0, 0);
  };

  const viewDetail = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setActivePage('PropertyDetail');
    window.history.pushState({}, '', `${REPO_PREFIX}/property/${propertyId}`);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    window.history.back();
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setAdminPasswordError(false);
    } else {
      setAdminPasswordError(true);
    }
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    navigateTo('Home');
  };

  // CRUD handlers
  const handleAddProperty = async (newProperty) => {
    const supabasePayload = mapPropertyToSupabase(newProperty);
    const { data, error } = await supabase.from('properties').insert([supabasePayload]).select();
    if (error) {
      console.error('Error adding property:', error);
      alert('Failed to add property.');
    } else if (data && data.length > 0) {
      const addedProp = mapSupabaseToProperty(data[0]);
      setProperties(prev => [...prev, addedProp]);
    }
  };

  const handleUpdateProperty = async (updatedProperty) => {
    const supabasePayload = mapPropertyToSupabase(updatedProperty);
    const { data, error } = await supabase.from('properties')
      .update(supabasePayload)
      .eq('id', updatedProperty.id)
      .select();
    if (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property.');
    } else if (data && data.length > 0) {
      const savedProp = mapSupabaseToProperty(data[0]);
      setProperties(prev => prev.map(p => p.id === updatedProperty.id ? savedProp : p));
    }
  };

  const handleDeleteProperty = async (id) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property.');
    } else {
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  // Filtered properties for Catalogue — always returns all properties since Hero search removed
  const filteredProperties = properties;

  if (loading) {
    return (
      <>
        <Navbar scrolled={false} activePage={activePage} onNavigate={navigateTo} />
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading properties…</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar scrolled={false} activePage={activePage} onNavigate={navigateTo} />
        <div className="loading-screen">
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mobile-only">
        <Suspense fallback={null}>
          <StaggeredMenu
          position="right"
          isFixed={true}
          menuButtonColor={scrolled ? '#111' : '#111'}
          openMenuButtonColor="#111"
          changeMenuColorOnOpen={false}
          colors={['#c46b2e', '#a05520']}
          accentColor="#c46b2e"
          displaySocials={true}
          displayItemNumbering={true}
          items={[
            { label: 'Home', ariaLabel: 'Go to home page', link: '#', onClick: () => navigateTo('Home') },
            { label: 'Catalogue', ariaLabel: 'View our projects', link: '#', onClick: () => navigateTo('Catalogue') },
            { label: 'Map', ariaLabel: 'View map of properties', link: '#', onClick: () => navigateTo('Map') },
            { label: 'Admin', ariaLabel: 'Admin dashboard', link: '#', onClick: () => navigateTo('Admin') },
            { label: 'Contact', ariaLabel: 'Get in touch', link: '#', onClick: () => { } }
          ]}
          socialItems={[
            { label: 'GitHub', link: 'https://github.com' },
            { label: 'Twitter', link: 'https://twitter.com' },
            { label: 'LinkedIn', link: 'https://linkedin.com' }
          ]}
          />
        </Suspense>
      </div>

      <Navbar
        scrolled={scrolled}
        activePage={activePage}
        onNavigate={navigateTo}
      />

      <main>
        {activePage === 'Admin' ? (
          adminAuthenticated ? (
            <Suspense fallback={<div className="loading-screen"><div className="loading-spinner"></div></div>}>
              <AdminDashboard
                properties={properties}
                onAdd={handleAddProperty}
                onUpdate={handleUpdateProperty}
                onDelete={handleDeleteProperty}
                onLogout={handleAdminLogout}
              />
            </Suspense>
          ) : (
            <section className="admin-login-page">
              <div className="admin-login-card">
                <h2>Admin Access</h2>
                <p>Enter the admin password to continue.</p>
                <form onSubmit={handleAdminLogin}>
                  <input
                    type="password"
                    placeholder="Password"
                    value={adminPasswordInput}
                    onChange={(e) => { setAdminPasswordInput(e.target.value); setAdminPasswordError(false); }}
                    required
                    autoFocus
                  />
                  {adminPasswordError && <p className="admin-login-error">Incorrect password.</p>}
                  <button type="submit">Sign In</button>
                </form>
                <button className="admin-login-back" onClick={() => navigateTo('Home')}>← Back to Home</button>
              </div>
            </section>
          )
        ) : activePage === 'PropertyDetail' && selectedPropertyId ? (
          <PropertyDetail
            properties={properties}
            propertyId={selectedPropertyId}
            onBack={goBack}
          />
        ) : activePage === 'Map' ? (
          <Suspense fallback={<div className="loading-screen"><div className="loading-spinner"></div></div>}>
            <MapView properties={properties} onViewDetail={viewDetail} />
          </Suspense>
        ) : activePage === 'Catalogue' ? (
          <Catalogue
            properties={filteredProperties}
            allProperties={properties}
            onViewDetail={viewDetail}
          />
        ) : (
          <>
            <Hero />
            <Listings properties={properties} onViewDetail={viewDetail} />
          </>
        )}
      </main>
    </>
  );
}

export default App;
