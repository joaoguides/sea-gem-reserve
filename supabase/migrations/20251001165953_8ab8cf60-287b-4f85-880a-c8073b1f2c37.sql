-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lancha', 'veleiro', 'jetski', 'iate')),
  status TEXT NOT NULL CHECK (status IN ('novo', 'seminovo')),
  price DECIMAL(12,2) NOT NULL,
  year INTEGER NOT NULL,
  length_m DECIMAL(5,2) NOT NULL,
  beam_m DECIMAL(5,2),
  draft_m DECIMAL(5,2),
  material TEXT,
  engine TEXT,
  engine_hours INTEGER,
  fuel TEXT CHECK (fuel IN ('gasolina', 'diesel', 'eletrico', 'hibrido')),
  capacity_people INTEGER,
  range_nm INTEGER,
  location TEXT NOT NULL,
  brochure_url TEXT,
  deposit_mode TEXT DEFAULT 'both' CHECK (deposit_mode IN ('fixed', 'percent', 'both')),
  deposit_fixed_amount DECIMAL(12,2) DEFAULT 0,
  deposit_percent DECIMAL(5,2) DEFAULT 0,
  min_deposit_amount DECIMAL(12,2) DEFAULT 0,
  hold_period_days INTEGER DEFAULT 7,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create product_images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images are viewable by everyone"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product images"
  ON public.product_images FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create product_features table
CREATE TABLE public.product_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product features are viewable by everyone"
  ON public.product_features FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product features"
  ON public.product_features FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create accessories table
CREATE TABLE public.accessories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accessories are viewable by everyone"
  ON public.accessories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage accessories"
  ON public.accessories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create accessory_compatibility table
CREATE TABLE public.accessory_compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accessory_id UUID NOT NULL REFERENCES public.accessories(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL REFERENCES public.products(slug) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(accessory_id, product_slug)
);

ALTER TABLE public.accessory_compatibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accessory compatibility is viewable by everyone"
  ON public.accessory_compatibility FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage accessory compatibility"
  ON public.accessory_compatibility FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'cancelled', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('pix', 'credit_card')),
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('accessory', 'reservation')),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  accessory_id UUID REFERENCES public.accessories(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('fixed', 'percent')),
  amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'expired', 'cancelled')),
  hold_until TIMESTAMPTZ,
  payment_id TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reservations"
  ON public.reservations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reservations"
  ON public.reservations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update reservations"
  ON public.reservations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id);

-- Create pages table (CMS)
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are viewable by everyone"
  ON public.pages FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage pages"
  ON public.pages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.accessories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert seed data for products
INSERT INTO public.products (slug, name, type, status, price, year, length_m, beam_m, draft_m, material, engine, engine_hours, fuel, capacity_people, range_nm, location, deposit_fixed_amount, deposit_percent, min_deposit_amount, hold_period_days, featured) VALUES
('schaefer-phantom-400', 'Schaefer Phantom 400', 'lancha', 'novo', 850000.00, 2024, 12.2, 3.8, 1.2, 'Fibra de vidro', '2x Volvo Penta D6-400', 0, 'diesel', 12, 250, 'Santos, SP', 50000.00, 5.0, 30000.00, 7, true),
('ferretti-720', 'Ferretti 720', 'iate', 'seminovo', 4500000.00, 2022, 22.0, 5.5, 1.8, 'Fibra de vidro', '2x MTU 12V 2000 M96L', 350, 'diesel', 8, 400, 'Rio de Janeiro, RJ', 200000.00, 5.0, 150000.00, 7, true),
('beneteau-oceanis-51', 'Beneteau Oceanis 51.1', 'veleiro', 'novo', 1800000.00, 2024, 15.5, 4.8, 2.3, 'Fibra de vidro', 'Yanmar 4JH110', 0, 'diesel', 10, 800, 'Florianópolis, SC', 100000.00, 5.0, 80000.00, 7, true),
('yamaha-vx-cruiser', 'Yamaha VX Cruiser', 'jetski', 'novo', 58000.00, 2024, 3.4, 1.2, 0.6, 'Plástico reforçado', '4 tempos 1.8L', 0, 'gasolina', 3, 80, 'Balneário Camboriú, SC', 5000.00, 10.0, 3000.00, 7, false);

-- Insert product images
INSERT INTO public.product_images (product_id, url, sort) 
SELECT id, '/placeholder.svg', 0 FROM public.products WHERE slug = 'schaefer-phantom-400';

INSERT INTO public.product_images (product_id, url, sort) 
SELECT id, '/placeholder.svg', 0 FROM public.products WHERE slug = 'ferretti-720';

INSERT INTO public.product_images (product_id, url, sort) 
SELECT id, '/placeholder.svg', 0 FROM public.products WHERE slug = 'beneteau-oceanis-51';

INSERT INTO public.product_images (product_id, url, sort) 
SELECT id, '/placeholder.svg', 0 FROM public.products WHERE slug = 'yamaha-vx-cruiser';

-- Insert product features
INSERT INTO public.product_features (product_id, group_name, label)
SELECT id, 'Série', 'Modelo 2024' FROM public.products WHERE slug = 'schaefer-phantom-400';

INSERT INTO public.product_features (product_id, group_name, label)
SELECT id, 'Conforto', 'Ar condicionado' FROM public.products WHERE slug = 'schaefer-phantom-400';

INSERT INTO public.product_features (product_id, group_name, label)
SELECT id, 'Conforto', 'Geladeira' FROM public.products WHERE slug = 'schaefer-phantom-400';

INSERT INTO public.product_features (product_id, group_name, label)
SELECT id, 'Segurança', 'GPS/Chartplotter' FROM public.products WHERE slug = 'schaefer-phantom-400';

INSERT INTO public.product_features (product_id, group_name, label)
SELECT id, 'Série', 'Iate de luxo' FROM public.products WHERE slug = 'ferretti-720';

INSERT INTO public.product_features (product_id, group_name, label)
SELECT id, 'Conforto', '4 cabines' FROM public.products WHERE slug = 'ferretti-720';

INSERT INTO public.product_features (product_id, group_name, label)
SELECT id, 'Série', 'Cruzeiro oceânico' FROM public.products WHERE slug = 'beneteau-oceanis-51';

INSERT INTO public.product_features (product_id, group_name, label)
SELECT id, 'Vela', 'Vela maior' FROM public.products WHERE slug = 'beneteau-oceanis-51';

-- Insert CMS pages
INSERT INTO public.pages (slug, title, content, published) VALUES
('politica-de-reserva', 'Política de Reserva', '<h2>Condições de Reserva</h2><p>Para garantir sua embarcação, é necessário realizar o pagamento do sinal de reserva conforme especificado no produto.</p><p>Após o pagamento, o produto ficará reservado por 7 dias (ou conforme indicado), período no qual você deverá finalizar a compra ou agendar visita.</p><p>Em caso de desistência após o pagamento do sinal, o valor poderá ser retido conforme acordado.</p>', true),
('termos', 'Termos e Condições', '<h2>Termos de Uso</h2><p>Ao utilizar nossa plataforma, você concorda com os termos aqui descritos.</p><p>Todas as transações são regidas pela legislação brasileira vigente.</p>', true),
('faq', 'Perguntas Frequentes', '<h2>FAQ</h2><h3>Como funciona a reserva?</h3><p>Você escolhe o produto, paga o sinal e tem 7 dias para finalizar.</p><h3>Posso cancelar?</h3><p>Sim, mas conforme nossa política de cancelamento.</p>', true);