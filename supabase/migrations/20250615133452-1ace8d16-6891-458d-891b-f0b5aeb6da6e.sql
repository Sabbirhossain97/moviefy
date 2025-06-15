
-- Add a foreign key on movie_reviews.user_id referencing profiles.id so that Supabase joins work
ALTER TABLE public.movie_reviews
ADD CONSTRAINT movie_reviews_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
