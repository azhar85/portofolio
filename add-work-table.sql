-- Drop the table and recreate it with the correct schema
DROP TABLE IF EXISTS work;

-- Work Table setup (Ongoing Projects matching standard project layout + private data)
CREATE TABLE IF NOT EXISTS work (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  
  -- Private / Admin-only Tracking Fields
  price NUMERIC DEFAULT 0,
  deadline DATE,
  installments_paid NUMERIC DEFAULT 0,
  installments_total NUMERIC DEFAULT 1,
  installment_features BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'On Going', -- On Going, Finished
  client_name TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE work ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can read portfolio data)
CREATE POLICY "Public read work" ON work FOR SELECT USING (true);

-- Authenticated user policies (admin can do everything)
CREATE POLICY "Admin all work" ON work FOR ALL USING (auth.role() = 'authenticated');
