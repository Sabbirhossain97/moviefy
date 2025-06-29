import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Review {
  id: string;
  user_id: string;
  movie_id: number;
  review: string;
  created_at: string;
  user?: { full_name: string | null; avatar_url?: string | null };
}

export interface SeriesReview {
  id: string;
  user_id: string;
  series_id: number;
  review: string;
  created_at: string;
  user?: { full_name: string | null; avatar_url?: string | null };
}

export function useMovieReviews(id: number, type: string) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [seriesReviews, setSeriesReviews] = useState<SeriesReview[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    if (type === 'movie') {
      try {
        const { data, error } = await supabase
          .from("movie_reviews")
          .select("*, user:profiles(full_name, avatar_url)")
          .eq("movie_id", id)
          .order("created_at", { ascending: false });

        if (error) {
          setError(error.message || "Failed to fetch reviews.");
          setReviews([]);
          console.error("Supabase fetch error:", error);
          return;
        }

        const safeData: Review[] = (data || []).map((r: any) => ({
          ...r,
          user: r.user && typeof r.user === "object"
            ? { full_name: r.user.full_name, avatar_url: r.user.avatar_url }
            : { full_name: null, avatar_url: null }
        }));
        setReviews(safeData);
      } catch (err: any) {
        setError(err.message || "Error fetching reviews.");
        setReviews([]);
        console.error("Catch error in fetchReviews:", err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const { data, error } = await (supabase as any)
          .from("series_reviews")
          .select("*, user:profiles(full_name, avatar_url)")
          .eq("series_id", id)
          .order("created_at", { ascending: false })

        if (error) {
          setError(error.message || "Failed to fetch reviews.");
          setReviews([]);
          console.error("Supabase fetch error:", error);
          return;
        }
        console.log(data)

        const safeData: SeriesReview[] = (data || []).map((r: any) => ({
          ...r,
          user: r.user && typeof r.user === "object"
            ? { full_name: r.user.full_name, avatar_url: r.user.avatar_url }
            : { full_name: null, avatar_url: null }
        }));
        setSeriesReviews(safeData);
      } catch (err: any) {
        setError(err.message || "Error fetching reviews.");
        setReviews([]);
        console.error("Catch error in fetchReviews:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch user's own review if exists
  const fetchMyReview = async () => {
    if (!user) return setMyReview(null);
    if (type === 'movie') {
      const { data } = await supabase
        .from("movie_reviews")
        .select("*")
        .eq("movie_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      setMyReview(data || null);
    } else {
      const { data } = await (supabase as any)
        .from("series_reviews")
        .select("*")
        .eq("series_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      setMyReview(data || null);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchMyReview();
  }, [id, user]);

  const submitReview = async (review: string) => {
    if (!user) return;
    setLoading(true);
    const table = type === 'movie' ? 'movie_reviews' : 'series_reviews'
    const idType = type === 'movie' ? 'movie_id' : 'series_id'
    await supabase
      .from(table as any)
      .insert({ user_id: user.id, [idType]: id, review });
    await fetchReviews();
    await fetchMyReview();
    setLoading(false);
  };

  const editReview = async (review: string, reviewId: number) => {
    if (!user) return;
    setLoading(true);
    const table = type === 'movie' ? 'movie_reviews' : 'series_reviews'
    await supabase
      .from(table as any)
      .update({ review: review })
      .eq('id', reviewId)
    await fetchReviews();
    await fetchMyReview();
    setLoading(false);
  };

  const deleteReview = async (id: string) => {
    setLoading(true);
    if (type === 'movie') {
      await supabase.from("movie_reviews").delete().eq("id", id);
      await fetchReviews();
      await fetchMyReview();
      setLoading(false);
    } else {
      await (supabase as any).from("series_reviews").delete().eq("id", id);
      await fetchReviews();
      await fetchMyReview();
      setLoading(false);
    }

  };

  return { reviews, seriesReviews, myReview, submitReview, editReview, deleteReview, loading, error, refresh: fetchReviews };
}
