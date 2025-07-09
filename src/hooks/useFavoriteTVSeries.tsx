
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { TVSeries } from '@/services/api';

interface FavoriteTVSeries {
  id: string;
  series_id: number;
  series_name: string;
  series_poster_path: string | null;
  series_first_air_date: string | null;
  series_vote_average: number | null;
  favorited_at: string;
}

export const useFavoriteTVSeries = () => {
  const [favoriteTVSeries, setFavoriteTVSeries] = useState<FavoriteTVSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFavoriteTVSeries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorite_tv_series')
        .select('*')
        .eq('user_id', user.id)
        .order('favorited_at', { ascending: false });

      if (error) throw error;
      setFavoriteTVSeries(data || []);
    } catch (error) {
      console.error('Error fetching favorite TV series:', error);
      toast({
        title: 'Error',
        description: 'Failed to load favorite TV series',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (series: TVSeries) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add TV series to favorites',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('favorite_tv_series').insert({
        user_id: user.id,
        series_id: series.id,
        series_name: series.name,
        series_poster_path: series.poster_path,
        series_first_air_date: series.first_air_date,
        series_vote_average: series.vote_average,
      });

      if (error) throw error;

      toast({
        title: 'Added to favorites',
        description: `${series.name} has been added to your favorites`,
      });

      fetchFavoriteTVSeries();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: 'Already favorited',
          description: `${series.name} is already in your favorites`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add TV series to favorites',
          variant: 'destructive',
        });
      }
    }
  };

  const removeFromFavorites = async (seriesId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorite_tv_series')
        .delete()
        .eq('user_id', user.id)
        .eq('series_id', seriesId);

      if (error) throw error;

      toast({
        title: 'Removed from favorites',
        description: 'TV series has been removed from your favorites',
      });

      fetchFavoriteTVSeries();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove TV series from favorites',
        variant: 'destructive',
      });
    }
  };

  const isFavorite = (seriesId: number) => {
    return favoriteTVSeries.some((item) => item.series_id === seriesId);
  };

  useEffect(() => {
    if (user) {
      fetchFavoriteTVSeries();
    } else {
      setFavoriteTVSeries([]);
    }
  }, [user]);

  return {
    favoriteTVSeries,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    fetchFavoriteTVSeries,
  };
};
