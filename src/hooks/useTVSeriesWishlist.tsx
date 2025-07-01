
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { TVSeries } from '@/services/api';

interface WishlistTVSeries {
  id: string;
  series_id: number;
  series_name: string;
  series_poster_path: string | null;
  series_first_air_date: string | null;
  series_vote_average: number | null;
  added_at: string;
}

export const useTVSeriesWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistTVSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tv_wishlists')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;
      setWishlist(data || []);
    } catch (error) {
      console.error('Error fetching TV series wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load TV series wishlist',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (series: TVSeries) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add TV series to your wishlist',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('tv_wishlists').insert({
        user_id: user.id,
        series_id: series.id,
        series_name: series.name,
        series_poster_path: series.poster_path,
        series_first_air_date: series.first_air_date,
        series_vote_average: series.vote_average,
      });

      if (error) throw error;

      toast({
        title: 'Added to wishlist',
        description: `${series.name} has been added to your wishlist`,
      });

      fetchWishlist();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: 'Already in wishlist',
          description: `${series.name} is already in your wishlist`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add TV series to wishlist',
          variant: 'destructive',
        });
      }
    }
  };

  const removeFromWishlist = async (seriesId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tv_wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('series_id', seriesId);

      if (error) throw error;

      toast({
        title: 'Removed from wishlist',
        description: 'TV series has been removed from your wishlist',
      });

      fetchWishlist();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove TV series from wishlist',
        variant: 'destructive',
      });
    }
  };

  const isInWishlist = (seriesId: number) => {
    return wishlist.some((item) => item.series_id === seriesId);
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
