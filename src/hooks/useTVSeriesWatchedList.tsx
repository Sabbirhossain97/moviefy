
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { TVSeries } from '@/services/api';

export const useTVSeriesWatchedList = () => {
  const { user } = useAuth();
  const [watchedList, setWatchedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWatchedList();
    } else {
      setWatchedList([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWatchedList = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('watched_tv_series')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false });

      if (error) throw error;
      setWatchedList(data || []);
    } catch (error) {
      console.error('Error fetching watched TV series:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchedList = async (series: TVSeries) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watched_tv_series')
        .insert([{
          user_id: user.id,
          series_id: series.id,
          series_name: series.name,
          series_poster_path: series.poster_path,
          series_first_air_date: series.first_air_date,
          series_vote_average: series.vote_average,
        }]);

      if (error) throw error;
      await fetchWatchedList();
    } catch (error) {
      console.error('Error adding to watched list:', error);
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
      await fetchWatchedList();
    } catch (error) {
      console.error('Error removing from watched list:', error);
    }
  };

  const isWatched = (seriesId: number) => {
    return watchedList.some(item => item.series_id === seriesId);
  };

  return {
    watchedList,
    loading,
    addToWatchedList,
    removeFromWatchedList,
    isWatched,
  };
};
