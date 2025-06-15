
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Returns: { rating, submitRating, loading }
export function useMovieRatings(movieId: number) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return setRating(null);
    setLoading(true);

    (async () => {
      try {
        const { data } = await supabase
          .from("movie_ratings")
          .select("rating")
          .eq("user_id", user.id)
          .eq("movie_id", movieId)
          .maybeSingle();
        setRating(data?.rating ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, movieId]);

  const submitRating = async (val: number) => {
    if (!user) return;
    setLoading(true);
    await supabase
      .from("movie_ratings")
      .upsert({ user_id: user.id, movie_id: movieId, rating: val });
    setRating(val);
    setLoading(false);
  };

  return { rating, submitRating, loading };
}
