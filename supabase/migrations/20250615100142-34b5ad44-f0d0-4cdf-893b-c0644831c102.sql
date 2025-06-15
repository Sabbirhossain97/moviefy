
-- 1. Movie Ratings: Users can rate a movie once, 1-5 stars
CREATE TABLE public.movie_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  movie_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- 2. Movie Reviews: Users can leave a textual review per movie; reviews are moderated by admin
CREATE TABLE public.movie_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  movie_id INTEGER NOT NULL,
  review TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Movie Reminders: Users may follow a movie (for notification/reminder)
CREATE TABLE public.movie_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  movie_id INTEGER NOT NULL,
  remind_by_email BOOLEAN NOT NULL DEFAULT TRUE,
  remind_on TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- 4. Basic RLS: Only allow users to read their own ratings, reviews, reminders;
--    Admins can view/delete/approve all reviews.
ALTER TABLE public.movie_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_reminders ENABLE ROW LEVEL SECURITY;

-- Ratings: User can SELECT, INSERT, UPDATE, DELETE their own rating
CREATE POLICY "Users manage their ratings" 
  ON public.movie_ratings 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Reviews: User can SELECT, INSERT, UPDATE, DELETE their own review
CREATE POLICY "Users manage their reviews" 
  ON public.movie_reviews 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Reviews: Only show approved reviews to everyone (including the web)
CREATE POLICY "Show approved reviews" 
  ON public.movie_reviews 
  FOR SELECT 
  USING (is_approved OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Admin: Approve or delete any review (admin can do anything)
CREATE POLICY "Admins manage all reviews" 
  ON public.movie_reviews 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Reminders: Only user can manage their reminders
CREATE POLICY "Users manage their reminders" 
  ON public.movie_reminders 
  FOR ALL 
  USING (auth.uid() = user_id);

