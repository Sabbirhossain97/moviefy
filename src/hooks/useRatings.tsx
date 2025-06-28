import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useRatings(id: number, type: string) {
  const { user } = useAuth();
  const [currentRatingId, setCurrentRatingId] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const table = type === "movie" ? "movie_ratings" : 'series_ratings';
  const idType = type === "movie" ? 'movie_id' : 'series_id';

  useEffect(() => {
    if (!user) return setRating(null);
    setLoading(true);

    (async () => {
      try {
        const { data } = await (supabase as any)
          .from(table)
          .select("*")
          .eq("user_id", user.id)
          .eq(idType, id)
          .maybeSingle();
        setCurrentRatingId(data?.id ?? null)
        setRating(data?.rating ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id]);

  const submitRating = async (val: number) => {
    if (!user) return;
    setLoading(true);
    if (!rating) {
      await (supabase as any)
        .from(table)
        .insert({ user_id: user.id, [idType]: id, rating: val });
      setRating(val);
      setLoading(false);
    } else {
      await (supabase as any)
        .from(table)
        .update({ rating: val })
        .eq('id', currentRatingId)
      setRating(val);
      setLoading(false);
    }

  };

  return { rating, submitRating, loading };
}
