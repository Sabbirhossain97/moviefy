
-- Create a table for favorite movies
CREATE TABLE public.favorite_movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  movie_id INTEGER NOT NULL,
  movie_title TEXT NOT NULL,
  movie_poster_path TEXT,
  movie_release_date TEXT,
  movie_vote_average NUMERIC,
  favorited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Create a table for favorite TV series
CREATE TABLE public.favorite_tv_series (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  series_id INTEGER NOT NULL,
  series_name TEXT NOT NULL,
  series_poster_path TEXT,
  series_first_air_date TEXT,
  series_vote_average NUMERIC,
  favorited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, series_id)
);

-- Add Row Level Security
ALTER TABLE public.favorite_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_tv_series ENABLE ROW LEVEL SECURITY;

-- Create policies for favorite movies
CREATE POLICY "Users can manage their own favorite movies" 
  ON public.favorite_movies 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for favorite TV series
CREATE POLICY "Users can manage their own favorite TV series" 
  ON public.favorite_tv_series 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
