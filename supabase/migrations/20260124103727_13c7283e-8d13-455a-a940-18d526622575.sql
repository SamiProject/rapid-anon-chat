-- Create online_users table to track real online count
CREATE TABLE public.online_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  looking_for TEXT NOT NULL CHECK (looking_for IN ('male', 'female', 'everyone')),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.online_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view online users" 
ON public.online_users 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert online users" 
ON public.online_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update online users" 
ON public.online_users 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete online users" 
ON public.online_users 
FOR DELETE 
USING (true);

-- Add partner info columns to waiting_queue
ALTER TABLE public.waiting_queue 
ADD COLUMN name TEXT,
ADD COLUMN location TEXT,
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'other')),
ADD COLUMN looking_for TEXT CHECK (looking_for IN ('male', 'female', 'everyone'));

-- Enable realtime for online_users
ALTER PUBLICATION supabase_realtime ADD TABLE public.online_users;