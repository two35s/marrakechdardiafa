import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Listings from './components/Listings';
import Catalogue from './components/Catalogue';
import PropertyDetail from './components/PropertyDetail';
import MapView from './components/MapView';
import StaggeredMenu from './components/StaggeredMenu';
import AdminDashboard from './components/AdminDashboard';
import { supabase, mapSupabaseToProperty, mapPropertyToSupabase } from './lib/supabase';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties from Supabase on load
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('properties').select('*');
      if (error) {
        console.error('Error fetching properties:', error);
      } else if (data) {
        setProperties(data.map(mapSupabaseToProperty));
      }
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const [activePage, setActivePage] = useState(() => {
    let path = window.location.pathname.toLowerCase();
    // GitHub Pages repo prefix handling
    const repoPrefix = '/marrakechdardiafa';
    if (path.startsWith(repoPrefix)) {
      path = path.slice(repoPrefix.length) || '/';
    }
    
    const propertyMatch = path.match(/^\/property\/([a-zA-Z0-9-]+)$/);
    if (propertyMatch) return 'PropertyDetail';
    if (path === '/catalogue' || path === '/catalog') return 'Catalogue';
    if (path === '/map') return 'Map';
    if (path === '/admin') return 'Admin';
    return 'Home';
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => {
    let path = window.location.pathname.toLowerCase();
    const repoPrefix = '/marrakechdardiafa';
    if (path.startsWith(repoPrefix)) {
      path = path.slice(repoPrefix.length) || '/';
    }
    const match = path.match(/^\/property\/([a-zA-Z0-9-]+)$/);
    return match ? match[1] : null;
  });

  // Removing localStorage persistence useEffect.
  
  useEffect(() => {
    const handlePopState = () => {
      let path = window.location.pathname.toLowerCase();
      const repoPrefix = '/marrakechdardiafa';
      if (path.startsWith(repoPrefix)) {
        path = path.slice(repoPrefix.length) || '/';
      }

      const propertyMatch = path.match(/^\/property\/([a-zA-Z0-9-]+)$/);
      if (propertyMatch) {
        setSelectedPropertyId(propertyMatch[1]);
        setActivePage('PropertyDetail');
      } else if (path === '/catalogue' || path === '/catalog') {
        setActivePage('Catalogue');
        setSelectedPropertyId(null);
      } else if (path === '/map') {
        setActivePage('Map');
        setSelectedPropertyId(null);
      } else if (path === '/admin') {
        setActivePage('Admin');
        setSelectedPropertyId(null);
      } else {
        setActivePage('Home');
        setSelectedPropertyId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page) => {
    setActivePage(page);
    setSelectedPropertyId(null);
    const repoPrefix = '/marrakechdardiafa';
    const paths = { Catalogue: '/catalogue', Map: '/map', Admin: '/admin', Home: '/' };
    const targetPath = paths[page] || '/';
    window.history.pushState({}, '', repoPrefix + targetPath);
    window.scrollTo(0, 0);
  };

  const handleViewDetail = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setActivePage('PropertyDetail');
    const repoPrefix = '/marrakechdardiafa';
    window.history.pushState({}, '', `${repoPrefix}/property/${propertyId}`);
    window.scrollTo(0, 0);
  };

  const handleBackFromDetail = () => {
    window.history.back();
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="mobile-only">
        <StaggeredMenu
          position="right"
          isFixed={true}
          menuButtonColor={scrolled ? '#111' : '#111'}
          openMenuButtonColor="#111"
          changeMenuColorOnOpen={false}
          colors={['#dc9d75ff', '#e85d04']}
          accentColor="#e85d04"
          displaySocials={true}
          displayItemNumbering={true}
          items={[
            { label: 'Home', ariaLabel: 'Go to home page', link: '#', onClick: () => handleNavigate('Home') },
            { label: 'Catalogue', ariaLabel: 'View our projects', link: '#', onClick: () => handleNavigate('Catalogue') },
            { label: 'Map', ariaLabel: 'View map of properties', link: '#', onClick: () => handleNavigate('Map') },
            { label: 'Admin', ariaLabel: 'Admin dashboard', link: '#', onClick: () => handleNavigate('Admin') },
            { label: 'Contact', ariaLabel: 'Get in touch', link: '#', onClick: () => { } }
          ]}
          socialItems={[
            { label: 'GitHub', link: 'https://github.com' },
            { label: 'Twitter', link: 'https://twitter.com' },
            { label: 'LinkedIn', link: 'https://linkedin.com' }
          ]}
        />
      </div>

      <Navbar
        scrolled={scrolled}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <main>
        {activePage === 'Admin' ? (
          <AdminDashboard
            properties={properties}
            onAdd={handleAddProperty}
            onUpdate={handleUpdateProperty}
            onDelete={handleDeleteProperty}
          />
        ) : activePage === 'PropertyDetail' && selectedPropertyId ? (
          <PropertyDetail
            properties={properties}
            propertyId={selectedPropertyId}
            onBack={handleBackFromDetail}
          />
        ) : activePage === 'Map' ? (
          <MapView properties={properties} onViewDetail={handleViewDetail} />
        ) : activePage === 'Catalogue' ? (
          <Catalogue properties={properties} onViewDetail={handleViewDetail} />
        ) : (
          <>
            <Hero />
            <Listings properties={properties} onViewDetail={handleViewDetail} />
          </>
        )}
      </main>
    </>
  );
}

export default App;
