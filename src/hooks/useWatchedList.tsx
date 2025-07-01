
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Movie } from '@/services/api';

interface WatchedMovie {
  id: string;
  movie_id: number;
  movie_title: string;
  movie_poster_path: string | null;
  movie_release_date: string | null;
  movie_vote_average: number | null;
  watched_at: string;
}

export const useWatchedList = () => {
  const [watchedList, setWatchedList] = useState<WatchedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWatchedList = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('watched_movies')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false });

      if (error) throw error;
      setWatchedList(data || []);
    } catch (error) {
      console.error('Error fetching watched list:', error);
      toast({
        title: 'Error',
        description: 'Failed to load watched list',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWatchedList = async (movie: Movie) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to mark movies as watched',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('watched_movies').insert({
        user_id: user.id,
        movie_id: movie.id,
        movie_title: movie.title,
        movie_poster_path: movie.poster_path,
        movie_release_date: movie.release_date,
        movie_vote_average: movie.vote_average,
      });

      if (error) throw error;

      toast({
        title: 'Marked as watched',
        description: `${movie.title} has been added to your watched list`,
      });

      fetchWatchedList();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: 'Already watched',
          description: `${movie.title} is already in your watched list`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add movie to watched list',
          variant: 'destructive',
        });
      }
    }
  };

  const removeFromWatchedList = async (movieId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watched_movies')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) throw error;

      toast({
        title: 'Removed from watched list',
        description: 'Movie has been removed from your watched list',
      });

      fetchWatchedList();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove movie from watched list',
        variant: 'destructive',
      });
    }
  };

  const isWatched = (movieId: number) => {
    return watchedList.some((item) => item.movie_id === movieId);
  };

  useEffect(() => {
    if (user) {
      fetchWatchedList();
    } else {
      setWatchedList([]);
    }
  }, [user]);

  return {
    watchedList,
    loading,
    addToWatchedList,
    removeFromWatchedList,
    isWatched,
    fetchWatchedList,
  };
};
