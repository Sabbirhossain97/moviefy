
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Review {
  id: string;
  user_id: string;
  movie_id: number;
  review: string;
  is_approved: boolean | null;
  created_at: string;
  user?: { full_name: string | null };
}

// Returns: { reviews, myReview, submitReview, deleteReview, loading, refresh }
export function useMovieReviews(movieId: number) {
  const { user, isAdmin } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all reviews (no approval logic)
  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("movie_reviews")
      .select("*, user:profiles(full_name)")
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false });
    // Defensive mapping: ensure user field always has { full_name }
    const safeData: Review[] = (data || []).map((r: any) => ({
      ...r,
      user: r.user && typeof r.user === "object" && "full_name" in r.user
        ? { full_name: r.user.full_name }
        : { full_name: null }
    }));
    setReviews(safeData);
    setLoading(false);
  };

  // Fetch user's review if exists
  const fetchMyReview = async () => {
    if (!user) return setMyReview(null);
    const { data } = await supabase
      .from("movie_reviews")
      .select("*")
      .eq("movie_id", movieId)
      .eq("user_id", user.id)
      .maybeSingle();
    setMyReview(data || null);
  };

  useEffect(() => {
    fetchReviews();
    fetchMyReview();
    // eslint-disable-next-line
  }, [movieId, user, isAdmin]);

  const submitReview = async (review: string) => {
    if (!user) return;
    setLoading(true);
    await supabase
      .from("movie_reviews")
      .upsert({ user_id: user.id, movie_id: movieId, review, is_approved: true });
    await fetchReviews();
    await fetchMyReview();
    setLoading(false);
  };

  const deleteReview = async (reviewId: string) => {
    setLoading(true);
    await supabase.from("movie_reviews").delete().eq("id", reviewId);
    await fetchReviews();
    await fetchMyReview();
    setLoading(false);
  };

  return { reviews, myReview, submitReview, deleteReview, loading, refresh: fetchReviews };
}
