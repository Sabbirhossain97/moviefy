
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { TVSeries } from '@/services/api';

interface WatchedTVSeries {
  id: string;
  series_id: number;
  series_name: string;
  series_poster_path: string | null;
  series_first_air_date: string | null;
  series_vote_average: number | null;
  watched_at: string;
}

export const useTVSeriesWatchedList = () => {
  const [watchedList, setWatchedList] = useState<WatchedTVSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWatchedList = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('watched_tv_series')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false });

      if (error) throw error;
      setWatchedList(data || []);
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

  const addToWatchedList = async (series: TVSeries) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to mark TV series as watched',
        variant: 'destructive',
      });
      return;
    }

    try {
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

  const removeFromWatchedList = async (seriesId: number) => {
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

      fetchWatchedList();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove TV series from watched list',
        variant: 'destructive',
      });
    }
  };

  const isWatched = (seriesId: number) => {
    return watchedList.some((item) => item.series_id === seriesId);
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
