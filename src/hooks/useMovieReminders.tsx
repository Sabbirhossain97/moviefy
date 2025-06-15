
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useMovieReminders(movieId: number) {
  const { user } = useAuth();
  const [hasReminder, setHasReminder] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch if the user has a reminder for this movie
  useEffect(() => {
    if (!user) return setHasReminder(false);
    setLoading(true);
    supabase
      .from("movie_reminders")
      .select("*")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .maybeSingle()
      .then(({ data }) => setHasReminder(!!data))
      .finally(() => setLoading(false));
  }, [movieId, user]);

  const setReminder = async (remindOn: string, byEmail = true) => {
    if (!user) return;
    setLoading(true);
    await supabase.from("movie_reminders").upsert({
      user_id: user.id,
      movie_id: movieId,
      remind_on: remindOn,
      remind_by_email: byEmail,
    });
    setHasReminder(true);
    setLoading(false);
  };

  const removeReminder = async () => {
    if (!user) return;
    setLoading(true);
    await supabase
      .from("movie_reminders")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId);
    setHasReminder(false);
    setLoading(false);
  };

  return { hasReminder, setReminder, removeReminder, loading };
}
