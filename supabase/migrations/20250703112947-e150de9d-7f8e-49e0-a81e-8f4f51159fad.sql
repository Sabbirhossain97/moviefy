
-- Create table for watched TV series
CREATE TABLE public.watched_tv_series (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  series_id INTEGER NOT NULL,
  series_name TEXT NOT NULL,
  series_poster_path TEXT,
  series_first_air_date TEXT,
  series_vote_average NUMERIC,
  watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, series_id)
);

-- Add Row Level Security
ALTER TABLE public.watched_tv_series ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own watched TV series
CREATE POLICY "Users can manage their own watched TV series" 
  ON public.watched_tv_series 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
