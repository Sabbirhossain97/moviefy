import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Movie } from '@/services/api';

interface FavoriteMovie {
  id: string;
  movie_id: number;
  movie_title: string;
  movie_poster_path: string | null;
  movie_release_date: string | null;
  movie_vote_average: number | null;
  favorited_at: string;
}

export const useFavoriteMovies = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFavoriteMovies = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorite_movies')
        .select('*')
        .eq('user_id', user.id)
        .order('favorited_at', { ascending: false });

      if (error) throw error;
      setFavoriteMovies(data || []);
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
      toast({
        title: 'Error',
        description: 'Failed to load favorite movies',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (movie: Movie) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add movies to favorites',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('favorite_movies').insert({
        user_id: user.id,
        movie_id: movie.id,
        movie_title: movie.title,
        movie_poster_path: movie.poster_path,
        movie_release_date: movie.release_date,
        movie_vote_average: movie.vote_average,
      });

      if (error) throw error;

      toast({
        title: 'Added to favorites',
        description: `${movie.title} has been added to your favorites`,
      });

      fetchFavoriteMovies();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: 'Already favorited',
          description: `${movie.title} is already in your favorites`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add movie to favorites',
          variant: 'destructive',
        });
      }
    }
  };

  const removeFromFavorites = async (movieId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorite_movies')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) throw error;

      toast({
        title: 'Removed from favorites',
        description: 'Movie has been removed from your favorites',
      });

      fetchFavoriteMovies();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove movie from favorites',
        variant: 'destructive',
      });
    }
  };

  const isFavorite = (movieId: number) => {
    return favoriteMovies.some((item) => item.movie_id === movieId);
  };

  useEffect(() => {
    if (user) {
      fetchFavoriteMovies();
    } else {
      setFavoriteMovies([]);
    }
  }, [user]);

  return {
    favoriteMovies,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    fetchFavoriteMovies,
  };
};
