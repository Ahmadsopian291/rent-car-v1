-- Create cars table
CREATE TABLE public.cars (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price_per_day NUMERIC NOT NULL,
  fuel_type TEXT NOT NULL,
  seats INTEGER NOT NULL,
  transmission TEXT NOT NULL,
  engine_cc INTEGER,
  description TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  ktp_number TEXT,
  ktp_image_url TEXT,
  license_number TEXT,
  license_image_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id INTEGER NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending_payment',
  payment_proof_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cars (public read, admin write)
CREATE POLICY "Cars are viewable by everyone" ON public.cars FOR SELECT USING (true);
CREATE POLICY "Only admins can manage cars" ON public.cars FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all bookings" ON public.bookings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- RLS Policies for blog_posts
CREATE POLICY "Blog posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own blog posts" ON public.blog_posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update their own blog posts" ON public.blog_posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Users can delete their own blog posts" ON public.blog_posts FOR DELETE USING (author_id = auth.uid());
CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();