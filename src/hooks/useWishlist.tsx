
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Movie } from '@/services/api';

interface WishlistMovie {
  id: string;
  movie_id: number;
  movie_title: string;
  movie_poster_path: string | null;
  movie_release_date: string | null;
  movie_vote_average: number | null;
  added_at: string;
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;
      setWishlist(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wishlist',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (movie: Movie) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add movies to your wishlist',
        variant: 'destructive',
      });
      return;
    }

    try {
      // First, remove from watched list if it exists
      await supabase
        .from('watched_movies')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movie.id);

      // Then add to wishlist
      const { error } = await supabase.from('wishlists').insert({
        user_id: user.id,
        movie_id: movie.id,
        movie_title: movie.title,
        movie_poster_path: movie.poster_path,
        movie_release_date: movie.release_date,
        movie_vote_average: movie.vote_average,
      });

      if (error) throw error;

      toast({
        title: 'Added to wishlist',
        description: `${movie.title} has been added to your wishlist`,
      });

      fetchWishlist();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: 'Already in wishlist',
          description: `${movie.title} is already in your wishlist`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add movie to wishlist',
          variant: 'destructive',
        });
      }
    }
  };

  const removeFromWishlist = async (movieId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) throw error;

      toast({
        title: 'Removed from wishlist',
        description: 'Movie has been removed from your wishlist',
      });

      fetchWishlist();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove movie from wishlist',
        variant: 'destructive',
      });
    }
  };

  const isInWishlist = (movieId: number) => {
    return wishlist.some((item) => item.movie_id === movieId);
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
  };
};
