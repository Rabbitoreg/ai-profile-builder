-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  attr1 INTEGER NOT NULL DEFAULT 50,
  attr2 INTEGER NOT NULL DEFAULT 50,
  attr3 INTEGER NOT NULL DEFAULT 50,
  attr4 INTEGER NOT NULL DEFAULT 50,
  attr5 INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content table for configurable text
CREATE TABLE IF NOT EXISTS content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default content
INSERT INTO content (key, value) VALUES
  ('title', 'Conference Profile Builder'),
  ('subtitle', 'Adjust the sliders to create your professional profile and see it visualized in real-time'),
  ('attributes_title', 'Profile Attributes'),
  ('visualization_title', 'Profile Visualization'),
  ('attr1_label', 'Creativity & Innovation'),
  ('attr1_description', 'Ability to think outside the box and generate novel ideas'),
  ('attr2_label', 'Technical Skills'),
  ('attr2_description', 'Proficiency in technical tools, programming, and systems'),
  ('attr3_label', 'Leadership'),
  ('attr3_description', 'Ability to guide teams and make strategic decisions'),
  ('attr4_label', 'Communication'),
  ('attr4_description', 'Effectiveness in conveying ideas and collaborating'),
  ('attr5_label', 'Problem Solving'),
  ('attr5_description', 'Analytical thinking and solution-finding capabilities')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (conference use case)
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on content" ON content FOR ALL USING (true);

-- Create function to get group averages
CREATE OR REPLACE FUNCTION get_group_averages()
RETURNS TABLE (
  attr1 NUMERIC,
  attr2 NUMERIC,
  attr3 NUMERIC,
  attr4 NUMERIC,
  attr5 NUMERIC,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(p.attr1)) as attr1,
    ROUND(AVG(p.attr2)) as attr2,
    ROUND(AVG(p.attr3)) as attr3,
    ROUND(AVG(p.attr4)) as attr4,
    ROUND(AVG(p.attr5)) as attr5,
    COUNT(*) as count
  FROM profiles p;
END;
$$ LANGUAGE plpgsql;
