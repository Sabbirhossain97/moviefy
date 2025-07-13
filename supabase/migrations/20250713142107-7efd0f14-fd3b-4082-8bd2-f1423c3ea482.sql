
-- Create a function to delete the current user and all their data
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Delete all user data from public tables
  DELETE FROM public.wishlists WHERE user_id = auth.uid();
  DELETE FROM public.tv_wishlists WHERE user_id = auth.uid();
  DELETE FROM public.watched_movies WHERE user_id = auth.uid();
  DELETE FROM public.watched_tv_series WHERE user_id = auth.uid();
  DELETE FROM public.favorite_movies WHERE user_id = auth.uid();
  DELETE FROM public.favorite_tv_series WHERE user_id = auth.uid();
  DELETE FROM public.movie_ratings WHERE user_id = auth.uid();
  DELETE FROM public.series_ratings WHERE user_id = auth.uid();
  DELETE FROM public.movie_reviews WHERE user_id = auth.uid();
  DELETE FROM public.series_reviews WHERE user_id = auth.uid();
  DELETE FROM public.movie_reminders WHERE user_id = auth.uid();
  DELETE FROM public.user_api_keys WHERE user_id = auth.uid();
  DELETE FROM public.user_roles WHERE user_id = auth.uid();
  DELETE FROM public.profiles WHERE id = auth.uid();
  
  -- Delete the user from auth.users (this will cascade to related auth tables)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
