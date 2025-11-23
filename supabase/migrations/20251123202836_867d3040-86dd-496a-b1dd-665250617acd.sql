-- Create enums
CREATE TYPE public.user_type AS ENUM ('buyer', 'seller');
CREATE TYPE public.verification_status AS ENUM ('verified', 'unverified');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.vehicle_category AS ENUM ('bike', 'scooter', 'car');
CREATE TYPE public.vehicle_condition AS ENUM ('new', 'used', 'certified');
CREATE TYPE public.listing_status AS ENUM ('pending', 'approved', 'rejected', 'sold');

-- Profiles table (user profile data)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  phone_number TEXT NOT NULL,
  avatar_url TEXT,
  city TEXT NOT NULL,
  user_type public.user_type NOT NULL DEFAULT 'buyer',
  address TEXT,
  bio TEXT,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Brands table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category public.vehicle_category NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(name, category)
);

-- Models table
CREATE TABLE public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category public.vehicle_category NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(brand_id, name)
);

-- Vehicles table (listings)
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id),
  model_id UUID REFERENCES public.models(id),
  brand_name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  mileage INTEGER,
  category public.vehicle_category NOT NULL,
  engine_capacity INTEGER,
  condition public.vehicle_condition NOT NULL DEFAULT 'used',
  city TEXT NOT NULL,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  contact_phone TEXT NOT NULL,
  status public.listing_status NOT NULL DEFAULT 'pending',
  is_urgent BOOLEAN DEFAULT false,
  is_negotiable BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_vehicles_seller_id ON public.vehicles(seller_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_category ON public.vehicles(category);
CREATE INDEX idx_vehicles_brand_id ON public.brands(id);
CREATE INDEX idx_vehicles_city ON public.vehicles(city);
CREATE INDEX idx_models_brand_id ON public.models(brand_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function to check if user is admin or moderator
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'moderator')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Anyone can view user roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for brands
CREATE POLICY "Anyone can view brands"
  ON public.brands FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage brands"
  ON public.brands FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for models
CREATE POLICY "Anyone can view models"
  ON public.models FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage models"
  ON public.models FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for vehicles
CREATE POLICY "Anyone can view approved vehicles"
  ON public.vehicles FOR SELECT
  TO authenticated
  USING (
    status = 'approved' 
    OR seller_id = auth.uid() 
    OR public.is_admin_or_moderator(auth.uid())
  );

CREATE POLICY "Sellers can insert their own vehicles"
  ON public.vehicles FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update their own vehicles"
  ON public.vehicles FOR UPDATE
  TO authenticated
  USING (
    seller_id = auth.uid() 
    OR public.is_admin_or_moderator(auth.uid())
  );

CREATE POLICY "Admins and moderators can delete vehicles"
  ON public.vehicles FOR DELETE
  TO authenticated
  USING (public.is_admin_or_moderator(auth.uid()));

-- Function to auto-generate username
CREATE OR REPLACE FUNCTION public.generate_username()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_username TEXT;
  username_exists BOOLEAN;
BEGIN
  LOOP
    new_username := 'user_' || substr(md5(random()::text), 1, 8);
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username = new_username) INTO username_exists;
    EXIT WHEN NOT username_exists;
  END LOOP;
  RETURN new_username;
END;
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, username, phone_number, city, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', public.generate_username()),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::public.user_type, 'buyer')
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample brands and models
INSERT INTO public.brands (name, category) VALUES
  ('Honda', 'bike'::public.vehicle_category),
  ('Yamaha', 'bike'::public.vehicle_category),
  ('Suzuki', 'bike'::public.vehicle_category),
  ('Hero', 'bike'::public.vehicle_category),
  ('Bajaj', 'bike'::public.vehicle_category),
  ('TVS', 'scooter'::public.vehicle_category),
  ('Honda', 'scooter'::public.vehicle_category),
  ('Suzuki', 'scooter'::public.vehicle_category),
  ('Toyota', 'car'::public.vehicle_category),
  ('Honda', 'car'::public.vehicle_category),
  ('Hyundai', 'car'::public.vehicle_category),
  ('Maruti', 'car'::public.vehicle_category);

-- Insert some sample models (bike)
INSERT INTO public.models (brand_id, name, category)
SELECT id, 'CB Shine', 'bike'::public.vehicle_category FROM public.brands WHERE name = 'Honda' AND category = 'bike'::public.vehicle_category
UNION ALL
SELECT id, 'Splendor', 'bike'::public.vehicle_category FROM public.brands WHERE name = 'Hero' AND category = 'bike'::public.vehicle_category
UNION ALL
SELECT id, 'FZ', 'bike'::public.vehicle_category FROM public.brands WHERE name = 'Yamaha' AND category = 'bike'::public.vehicle_category
UNION ALL
SELECT id, 'Pulsar', 'bike'::public.vehicle_category FROM public.brands WHERE name = 'Bajaj' AND category = 'bike'::public.vehicle_category;

-- Insert some sample models (scooter)
INSERT INTO public.models (brand_id, name, category)
SELECT id, 'Activa', 'scooter'::public.vehicle_category FROM public.brands WHERE name = 'Honda' AND category = 'scooter'::public.vehicle_category
UNION ALL
SELECT id, 'Jupiter', 'scooter'::public.vehicle_category FROM public.brands WHERE name = 'TVS' AND category = 'scooter'::public.vehicle_category;

-- Insert some sample models (car)
INSERT INTO public.models (brand_id, name, category)
SELECT id, 'Corolla', 'car'::public.vehicle_category FROM public.brands WHERE name = 'Toyota' AND category = 'car'::public.vehicle_category
UNION ALL
SELECT id, 'City', 'car'::public.vehicle_category FROM public.brands WHERE name = 'Honda' AND category = 'car'::public.vehicle_category
UNION ALL
SELECT id, 'i20', 'car'::public.vehicle_category FROM public.brands WHERE name = 'Hyundai' AND category = 'car'::public.vehicle_category;