-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  creativity INTEGER NOT NULL DEFAULT 50,
  technical INTEGER NOT NULL DEFAULT 50,
  leadership INTEGER NOT NULL DEFAULT 50,
  communication INTEGER NOT NULL DEFAULT 50,
  problem_solving INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  ('skill_creativity_label', 'Creativity & Innovation'),
  ('skill_creativity_description', 'Ability to think outside the box and generate novel ideas'),
  ('skill_technical_label', 'Technical Skills'),
  ('skill_technical_description', 'Proficiency in technical tools, programming, and systems'),
  ('skill_leadership_label', 'Leadership'),
  ('skill_leadership_description', 'Ability to guide teams and make strategic decisions'),
  ('skill_communication_label', 'Communication'),
  ('skill_communication_description', 'Effectiveness in conveying ideas and collaborating'),
  ('skill_problemSolving_label', 'Problem Solving'),
  ('skill_problemSolving_description', 'Analytical thinking and solution-finding capabilities')
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
  creativity NUMERIC,
  technical NUMERIC,
  leadership NUMERIC,
  communication NUMERIC,
  problem_solving NUMERIC,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(p.creativity)) as creativity,
    ROUND(AVG(p.technical)) as technical,
    ROUND(AVG(p.leadership)) as leadership,
    ROUND(AVG(p.communication)) as communication,
    ROUND(AVG(p.problem_solving)) as problem_solving,
    COUNT(*) as count
  FROM profiles p;
END;
$$ LANGUAGE plpgsql;
