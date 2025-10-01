// Temporary types until migration is executed
export interface Product {
  id: string;
  slug: string;
  name: string;
  type: string;
  status: string;
  price: number;
  year: number;
  length_m: number;
  beam_m: number;
  draft_m: number;
  material: string;
  engine: string;
  engine_hours: number;
  fuel: string;
  capacity_people: number;
  range_nm: number;
  location: string;
  brochure_url: string | null;
  deposit_mode: string;
  deposit_fixed_amount: number;
  deposit_percent: number;
  min_deposit_amount: number;
  featured: boolean;
  created_at: string;
  image?: string; // Added for frontend convenience
  product_images?: ProductImage[];
  product_features?: ProductFeature[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort: number;
}

export interface ProductFeature {
  id: string;
  product_id: string;
  group: string;
  label: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  product_id: string;
  mode: string;
  amount: number;
  status: string;
  hold_until: string | null;
  payment_id: string | null;
  created_at: string;
  products?: Product;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products?: Product;
}
