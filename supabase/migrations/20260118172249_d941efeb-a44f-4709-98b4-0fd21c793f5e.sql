-- Table for users waiting to be matched
CREATE TABLE public.waiting_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table for active chat rooms
CREATE TABLE public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_session TEXT NOT NULL,
  user2_session TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Table for messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_session TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table for typing indicators
CREATE TABLE public.typing_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  is_typing BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(room_id, session_id)
);

-- Table for reports
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE SET NULL,
  reporter_session TEXT NOT NULL,
  reported_session TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.waiting_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Since this is anonymous chat, we allow public access (no auth required)
-- Waiting queue policies
CREATE POLICY "Anyone can join queue" ON public.waiting_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view queue" ON public.waiting_queue FOR SELECT USING (true);
CREATE POLICY "Anyone can leave queue" ON public.waiting_queue FOR DELETE USING (true);

-- Chat rooms policies
CREATE POLICY "Anyone can create rooms" ON public.chat_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view rooms" ON public.chat_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can update rooms" ON public.chat_rooms FOR UPDATE USING (true);

-- Messages policies
CREATE POLICY "Anyone can send messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view messages" ON public.messages FOR SELECT USING (true);

-- Typing status policies
CREATE POLICY "Anyone can update typing" ON public.typing_status FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view typing" ON public.typing_status FOR SELECT USING (true);
CREATE POLICY "Anyone can change typing" ON public.typing_status FOR UPDATE USING (true);

-- Reports policies
CREATE POLICY "Anyone can report" ON public.reports FOR INSERT WITH CHECK (true);

-- Enable realtime for messages, typing, and chat rooms
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.waiting_queue;

-- Create index for faster queue matching
CREATE INDEX idx_waiting_queue_created ON public.waiting_queue(created_at ASC);
CREATE INDEX idx_messages_room ON public.messages(room_id, created_at);
CREATE INDEX idx_chat_rooms_active ON public.chat_rooms(is_active) WHERE is_active = true;