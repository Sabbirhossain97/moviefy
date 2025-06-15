
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

  // Fetch all approved reviews (or all if admin)
  const fetchReviews = async () => {
    setLoading(true);
    let query = supabase
      .from("movie_reviews")
      .select("*, user:profiles(full_name)")
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      query = query.eq("is_approved", true);
    }
    const { data } = await query;
    setReviews(data || []);
    setLoading(false);
  };

  // Fetch user's unapproved review if exists
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
      .upsert({ user_id: user.id, movie_id: movieId, review, is_approved: false });
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
