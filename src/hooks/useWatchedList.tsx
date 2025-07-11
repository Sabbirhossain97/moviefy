
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Movie } from '@/services/api';
import { TVSeries } from '@/services/api';

interface WatchedMovie {
  id: string;
  movie_id: number;
  movie_title: string;
  movie_poster_path: string | null;
  movie_release_date: string | null;
  movie_vote_average: number | null;
  watched_at: string;
}

interface WatchedTVSeries {
  id: string;
  series_id: number;
  series_name: string;
  series_poster_path: string | null;
  series_first_air_date: string | null;
  series_vote_average: number | null;
  watched_at: string;
}

const ITEMS_PER_PAGE = 20;

export const useWatchedList = () => {
  const [watchedList, setWatchedList] = useState<WatchedMovie[]>([]);
  const [watchedTVList, setWatchedTVList] = useState<WatchedTVSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTVPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [hasMoreTV, setHasMoreTV] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWatchedList = async (page: number = 1, append: boolean = false) => {
    if (!user) return;

    setLoading(true);
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('watched_movies')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      if (append) {
        setWatchedList(prev => [...prev, ...(data || [])]);
      } else {
        setWatchedList(data || []);
      }
      
      setHasMoreMovies((data || []).length === ITEMS_PER_PAGE);
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

  const fetchTVWatchedList = async (page: number = 1, append: boolean = false) => {
    if (!user) return;

    setLoading(true);
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('watched_tv_series')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      if (append) {
        setWatchedTVList(prev => [...prev, ...(data || [])]);
      } else {
        setWatchedTVList(data || []);
      }
      
      setHasMoreTV((data || []).length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching watched TV series list:', error);
      toast({
        title: 'Error',
        description: 'Failed to load watched TV series list',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    const nextPage = moviePage + 1;
    setMoviePage(nextPage);
    fetchWatchedList(nextPage, true);
  };

  const loadMoreTV = () => {
    const nextPage = tvPage + 1;
    setTVPage(nextPage);
    fetchTVWatchedList(nextPage, true);
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
      // First, remove from wishlist if it exists
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movie.id);

      // Then add to watched list
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

  const addToTVWatchedList = async (series: TVSeries) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to mark TV series as watched',
        variant: 'destructive',
      });
      return;
    }

    try {
      // First, remove from TV wishlist if it exists
      await supabase
        .from('tv_wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('series_id', series.id);

      // Then add to watched list
      const { error } = await supabase.from('watched_tv_series').insert({
        user_id: user.id,
        series_id: series.id,
        series_name: series.name,
        series_poster_path: series.poster_path,
        series_first_air_date: series.first_air_date,
        series_vote_average: series.vote_average,
      });

      if (error) throw error;

      toast({
        title: 'Marked as watched',
        description: `${series.name} has been added to your watched list`,
      });

      fetchWatchedList();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: 'Already watched',
          description: `${series.name} is already in your watched list`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add TV series to watched list',
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

  const removeFromTVWatchedList = async (seriesId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watched_tv_series')
        .delete()
        .eq('user_id', user.id)
        .eq('series_id', seriesId);

      if (error) throw error;

      toast({
        title: 'Removed from watched list',
        description: 'TV series has been removed from your watched list',
      });

      fetchTVWatchedList();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove TV series from watched list',
        variant: 'destructive',
      });
    }
  };

  const removeAllWatchedMovies = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watched_movies')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'All movies removed',
        description: 'All watched movies have been removed from your list',
      });

      setWatchedList([]);
      setMoviePage(1);
      setHasMoreMovies(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove all watched movies',
        variant: 'destructive',
      });
    }
  };

  const removeAllWatchedTVSeries = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watched_tv_series')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'All TV series removed',
        description: 'All watched TV series have been removed from your list',
      });

      setWatchedTVList([]);
      setTVPage(1);
      setHasMoreTV(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove all watched TV series',
        variant: 'destructive',
      });
    }
  };

  const isWatched = (movieId: number) => {
    return watchedList.some((item) => item.movie_id === movieId);
  };

  const isTVWatched = (seriesId: number) => {
    return watchedTVList.some((item) => item.series_id === seriesId);
  };

  useEffect(() => {
    if (user) {
      fetchWatchedList();
      fetchTVWatchedList();
    } else {
      setWatchedList([]);
      setWatchedTVList([]);
      setMoviePage(1);
      setTVPage(1);
      setHasMoreMovies(true);
      setHasMoreTV(true);
    }
  }, [user]);

  return {
    watchedList,
    watchedTVList,
    loading,
    hasMoreMovies,
    hasMoreTV,
    loadMoreMovies,
    loadMoreTV,
    addToWatchedList,
    addToTVWatchedList,
    removeFromWatchedList,
    removeFromTVWatchedList,
    removeAllWatchedMovies,
    removeAllWatchedTVSeries,
    isWatched,
    isTVWatched,
    fetchWatchedList,
    fetchTVWatchedList,
  };
};
