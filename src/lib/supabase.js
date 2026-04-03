import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase credentials. Copy .env.example to .env.local and fill in your credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility to convert a Supabase property record into the structure the UI expects
export const mapSupabaseToProperty = (sp) => {
  return {
    id: sp.id, // we might need to map to string, but keep as UUID
    image: sp.image_url,
    gallery: sp.ui_details?.gallery || [],
    price: Number(sp.price),
    address: `${sp.neighborhood}, ${sp.city}`, // fallback address format
    badges: sp.badges || [],
    rooms: sp.rooms,
    floor: sp.floor_description,
    area: Number(sp.surface_m2),
    lat: Number(sp.lat),
    lng: Number(sp.lng),
    description: sp.description,
    amenities: sp.ui_details?.amenities || [],
    details: {
      type: sp.ui_details?.type || sp.category,
      yearBuilt: sp.ui_details?.yearBuilt || null,
      heating: sp.ui_details?.heating || 'N/A',
      bathroom: sp.ui_details?.bathroom || `${sp.bathrooms} bathrooms`,
      petFriendly: sp.ui_details?.petFriendly ?? true,
      deposit: sp.ui_details?.deposit || 'N/A'
    }
  };
};

export const mapPropertyToSupabase = (p) => {
  return {
    title: p.address, // UI uses address as title loosely
    slug: p.slug || Math.random().toString(36).substring(7),
    category: p.details?.type?.toLowerCase() === 'riad' ? 'riad' : 
              p.details?.type?.toLowerCase() === 'villa' ? 'villa' : 'apartment',
    type: 'rent',
    neighborhood: p.address?.split(',')[1]?.trim() || '',
    city: p.address?.split(',')[0]?.trim() || 'Marrakech',
    price: p.price,
    price_unit: 'MAD',
    rooms: p.rooms,
    bathrooms: parseInt(p.details?.bathroom) || 1,
    surface_m2: p.area,
    lat: p.lat,
    lng: p.lng,
    description: p.description,
    image_url: p.image,
    floor_description: p.floor,
    badges: p.badges,
    ui_details: {
      type: p.details?.type,
      yearBuilt: p.details?.yearBuilt,
      heating: p.details?.heating,
      bathroom: p.details?.bathroom,
      petFriendly: p.details?.petFriendly,
      deposit: p.details?.deposit,
      gallery: p.gallery,
      amenities: p.amenities
    }
  };
};
