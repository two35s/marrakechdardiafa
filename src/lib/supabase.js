import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials. Copy .env.example to .env.local and fill in your credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUCKET = 'property-images';

export const uploadImage = async (file) => {
  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return publicUrl;
};

export const deleteImage = async (url) => {
  const marker = `/object/public/${BUCKET}/`;
  const idx = url?.indexOf(marker);
  if (!idx || idx === -1) return;
  const path = url.slice(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([path]);
};

const generateSlug = (address) => {
  const base = (address || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 50);
  return `${base}-${Date.now().toString(36)}`;
};

export const mapSupabaseToProperty = (sp) => ({
  id: sp.id,
  image: sp.image_url,
  gallery: sp.ui_details?.gallery?.length ? sp.ui_details.gallery : [sp.image_url],
  price: Number(sp.price),
  address: `${sp.neighborhood}, ${sp.city}`,
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
    deposit: sp.ui_details?.deposit || 'N/A',
  },
});

export const mapPropertyToSupabase = (p) => {
  const parts = p.address?.split(',').map(s => s.trim()) || ['', ''];
  const typeLC = p.details?.type?.toLowerCase() || '';
  const category = ['riad', 'villa', 'house', 'land'].includes(typeLC) ? typeLC : 'apartment';
  return {
    title: p.address || '',
    slug: p.slug || generateSlug(p.address),
    category,
    type: 'rent',
    neighborhood: parts[0] || '',
    city: parts[1] || 'Marrakech',
    price: p.price,
    price_unit: 'MAD',
    rooms: p.rooms,
    bathrooms: parseInt(p.details?.bathroom) || 1,
    surface_m2: p.area,
    lat: p.lat || null,
    lng: p.lng || null,
    description: p.description,
    image_url: p.image,
    floor_description: p.floor,
    badges: p.badges,
    updated_at: new Date().toISOString(),
    ui_details: {
      type: p.details?.type,
      yearBuilt: p.details?.yearBuilt,
      heating: p.details?.heating,
      bathroom: p.details?.bathroom,
      petFriendly: p.details?.petFriendly,
      deposit: p.details?.deposit,
      gallery: p.gallery,
      amenities: p.amenities,
    },
  };
};
