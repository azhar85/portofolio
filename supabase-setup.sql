-- Supabase SQL Setup
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Profile table
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Ahmad Azhar',
  title TEXT DEFAULT 'Full-Stack Developer & Entrepreneur',
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT DEFAULT 'General',
  level INTEGER DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  live_url TEXT,
  repo_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  category TEXT DEFAULT 'General',
  founded_year TEXT,
  status TEXT DEFAULT 'Active',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can read portfolio data)
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read businesses" ON businesses FOR SELECT USING (true);
CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (true);

-- Public insert for messages (contact form)
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Authenticated user policies (admin can do everything)
CREATE POLICY "Admin all profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all businesses" ON businesses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all social_links" ON social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all messages" ON messages FOR ALL USING (auth.role() = 'authenticated');

-- Insert default profile
INSERT INTO profile (name, title, bio) VALUES (
  'Ahmad Azhar',
  'Full-Stack Developer & Entrepreneur',
  'Passionate developer and entrepreneur based in Indonesia. Building digital products that solve real-world problems and creating businesses that make an impact.'
);

-- Create Storage bucket for image uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Auth upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete images
CREATE POLICY "Auth manage images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
