import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Listings from './components/Listings';
import Catalogue from './components/Catalogue';
import PropertyDetail from './components/PropertyDetail';
import { supabase, mapSupabaseToProperty, mapPropertyToSupabase } from './lib/supabase';

const MapView        = lazy(() => import('./components/MapView'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const REPO_PREFIX = '/marrakechdardiafa';

function parsePath() {
  // Handle GitHub Pages 404 → hash redirect (e.g. index.html#/marrakechdardiafa/admin)
  const hash = window.location.hash;
  if (hash.startsWith('#/')) {
    let restored = hash.slice(1); // e.g. /marrakechdardiafa/admin
    window.history.replaceState({}, '', restored);
  }

  let path = window.location.pathname.toLowerCase();
  if (path.startsWith(REPO_PREFIX)) path = path.slice(REPO_PREFIX.length) || '/';
  const propertyMatch = path.match(/^\/property\/([a-zA-Z0-9-]+)$/);
  if (propertyMatch) return { page: 'PropertyDetail', id: propertyMatch[1] };
  if (path === '/catalogue' || path === '/catalog') return { page: 'Catalogue', id: null };
  if (path === '/map')   return { page: 'Map',   id: null };
  if (path === '/admin') return { page: 'Admin', id: null };
  return { page: 'Home', id: null };
}

function App() {
  const [scrolled,    setScrolled]    = useState(false);
  const [properties,  setProperties]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const [activePage,         setActivePage]         = useState(() => parsePath().page);
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => parsePath().id);

  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword,      setAdminPassword]      = useState('');
  const [adminLoginError,    setAdminLoginError]    = useState('');
  const [adminLoginLoading,  setAdminLoginLoading]  = useState(false);

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminAuthenticated(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Initial fetch
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('properties').select('*');
        if (error) setError('Failed to load properties. Please try again later.');
        else if (data) setProperties(data.map(mapSupabaseToProperty));
      } catch {
        setError('An unexpected error occurred.');
      }
      setLoading(false);
    };
    fetch();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('properties-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'properties' }, ({ new: row }) => {
        setProperties(prev => [...prev, mapSupabaseToProperty(row)]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'properties' }, ({ new: row }) => {
        setProperties(prev => prev.map(p => p.id === row.id ? mapSupabaseToProperty(row) : p));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'properties' }, ({ old: row }) => {
        setProperties(prev => prev.filter(p => p.id !== row.id));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
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
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page) => {
    setActivePage(page);
    setSelectedPropertyId(null);
    const paths = { Catalogue: '/catalogue', Map: '/map', Admin: '/admin', Home: '/' };
    window.history.pushState({}, '', REPO_PREFIX + (paths[page] || '/'));
    window.scrollTo(0, 0);
  };

  const viewDetail = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setActivePage('PropertyDetail');
    window.history.pushState({}, '', `${REPO_PREFIX}/property/${propertyId}`);
    window.scrollTo(0, 0);
  };

  const goBack = () => window.history.back();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError('');
    setAdminLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: 'youssefbaaziz2077@gmail.com',
      password: adminPassword,
    });
    setAdminLoginLoading(false);
    if (error) setAdminLoginError('Incorrect password.');
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    navigateTo('Home');
  };

  // CRUD handlers — throw on error so AdminDashboard can show a toast
  const handleAddProperty = async (newProperty) => {
    const { data, error } = await supabase
      .from('properties')
      .insert([mapPropertyToSupabase(newProperty)])
      .select();
    if (error) throw new Error(error.message);
    setProperties(prev => [...prev, mapSupabaseToProperty(data[0])]);
  };

  const handleUpdateProperty = async (updatedProperty) => {
    const { data, error } = await supabase
      .from('properties')
      .update(mapPropertyToSupabase(updatedProperty))
      .eq('id', updatedProperty.id)
      .select();
    if (error) throw new Error(error.message);
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? mapSupabaseToProperty(data[0]) : p));
  };

  const handleDeleteProperty = async (id) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw new Error(error.message);
    setProperties(prev => prev.filter(p => p.id !== id));
  };

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
      <Navbar scrolled={scrolled} activePage={activePage} onNavigate={navigateTo} />

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
                <p>Sign in with your admin account.</p>
                <form onSubmit={handleAdminLogin}>
                  <input
                    type="password"
                    placeholder="Password"
                    value={adminPassword}
                    onChange={e => { setAdminPassword(e.target.value); setAdminLoginError(''); }}
                    required
                    autoFocus
                  />
                  {adminLoginError && <p className="admin-login-error">{adminLoginError}</p>}
                  <button type="submit" disabled={adminLoginLoading}>
                    {adminLoginLoading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
                <button className="admin-login-back" onClick={() => navigateTo('Home')}>← Back to Home</button>
              </div>
            </section>
          )
        ) : activePage === 'PropertyDetail' && selectedPropertyId ? (
          <PropertyDetail properties={properties} propertyId={selectedPropertyId} onBack={goBack} />
        ) : activePage === 'Map' ? (
          <Suspense fallback={<div className="loading-screen"><div className="loading-spinner"></div></div>}>
            <MapView properties={properties} onViewDetail={viewDetail} />
          </Suspense>
        ) : activePage === 'Catalogue' ? (
          <Catalogue properties={properties} allProperties={properties} onViewDetail={viewDetail} />
        ) : (
          <>
            <Hero />
            <Listings properties={properties} onViewDetail={viewDetail} />
          </>
        )}
      </main>

      {activePage !== 'Admin' && activePage !== 'PropertyDetail' && (
        <Footer onNavigate={navigateTo} />
      )}
    </>
  );
}

export default App;
