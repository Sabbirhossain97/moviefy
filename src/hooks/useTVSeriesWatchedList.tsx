
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TVSeries } from "@/services/api";

export interface WatchedTVSeries {
  id: string;
  series_id: number;
  series_name: string;
  series_poster_path: string | null;
  series_first_air_date: string | null;
  series_vote_average: number | null;
  watched_at: string;
  user_id: string;
}

export const useTVSeriesWatchedList = () => {
  const [watchedSeries, setWatchedSeries] = useState<WatchedTVSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWatchedSeries = async (offset = 0, limit = 20) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: [], hasMore: false };

      const { data, error } = await supabase
        .from("watched_tv_series")
        .select("*")
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { 
        data: data as WatchedTVSeries[], 
        hasMore: data.length === limit 
      };
    } catch (error) {
      console.error("Error fetching watched TV series:", error);
      toast({
        title: "Error",
        description: "Failed to fetch watched TV series",
        variant: "destructive",
      });
      return { data: [], hasMore: false };
    }
  };

  const loadWatchedSeries = async (reset = false) => {
    setLoading(true);
    const offset = reset ? 0 : watchedSeries.length;
    const { data, hasMore } = await fetchWatchedSeries(offset);
    
    if (reset) {
      setWatchedSeries(data);
    } else {
      setWatchedSeries(prev => [...prev, ...data]);
    }
    
    setLoading(false);
    return hasMore;
  };

  const addToWatched = async (series: TVSeries) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add TV series to your watched list",
          variant: "destructive",
        });
        return;
      }

      // Remove from wishlist if exists
      await supabase
        .from("tv_wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("series_id", series.id);

      const { error } = await supabase
        .from("watched_tv_series")
        .insert({
          user_id: user.id,
          series_id: series.id,
          series_name: series.name,
          series_poster_path: series.poster_path,
          series_first_air_date: series.first_air_date,
          series_vote_average: series.vote_average,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${series.name} added to your watched list`,
      });

      loadWatchedSeries(true);
    } catch (error) {
      console.error("Error adding to watched:", error);
      toast({
        title: "Error",
        description: "Failed to add TV series to watched list",
        variant: "destructive",
      });
    }
  };

  const removeFromWatched = async (seriesId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("watched_tv_series")
        .delete()
        .eq("user_id", user.id)
        .eq("series_id", seriesId);

      if (error) throw error;

      setWatchedSeries(prev => prev.filter(s => s.series_id !== seriesId));
      
      toast({
        title: "Success",
        description: "TV series removed from watched list",
      });
    } catch (error) {
      console.error("Error removing from watched:", error);
      toast({
        title: "Error",
        description: "Failed to remove TV series from watched list",
        variant: "destructive",
      });
    }
  };

  const removeAllWatched = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("watched_tv_series")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setWatchedSeries([]);
      
      toast({
        title: "Success",
        description: "All TV series removed from watched list",
      });
    } catch (error) {
      console.error("Error removing all watched:", error);
      toast({
        title: "Error",
        description: "Failed to remove all TV series from watched list",
        variant: "destructive",
      });
    }
  };

  const isWatched = (seriesId: number) => {
    return watchedSeries.some(s => s.series_id === seriesId);
  };

  useEffect(() => {
    loadWatchedSeries(true);
  }, []);

  return {
    watchedSeries,
    loading,
    addToWatched,
    removeFromWatched,
    removeAllWatched,
    isWatched,
    loadMore: () => loadWatchedSeries(false),
  };
};
