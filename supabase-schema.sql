-- CollabAI Database Schema
-- Supabase pe yeh SQL run karo

-- 1. Profiles table (users ka data)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'student', -- student, freelancer, professional, researcher
  credits INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  accuracy_score NUMERIC(5,2) DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Submissions table (submitted tasks)
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  task_id TEXT NOT NULL,
  task_type TEXT NOT NULL,
  answers JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  credits_awarded INTEGER DEFAULT 0,
  reviewer_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- 3. Withdrawals table
CREATE TABLE withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  credits INTEGER NOT NULL,
  amount_inr NUMERIC(10,2) NOT NULL,
  upi_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, paid, rejected
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  notes TEXT
);

-- Row Level Security (RLS) enable karo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Submissions policies
CREATE POLICY "Users can view their own submissions"
  ON submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
  ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON submissions FOR UPDATE USING (auth.uid() = user_id);

-- Admin can view all submissions (service role)
CREATE POLICY "Approved submissions viewable by all"
  ON submissions FOR SELECT USING (status = 'approved');

-- Withdrawals policies
CREATE POLICY "Users can view their own withdrawals"
  ON withdrawals FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own withdrawals"
  ON withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for performance
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_task_id ON submissions(task_id);
CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_profiles_credits ON profiles(credits DESC);
