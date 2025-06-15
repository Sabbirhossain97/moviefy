
import React from "react";
import { useMovieReviews } from "@/hooks/useMovieReviews";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Check, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function MovieReviewAdminPanel({ movieId }: { movieId: number }) {
  const { isAdmin } = useAuth();
  const { reviews, refresh, loading } = useMovieReviews(movieId);

  if (!isAdmin) return null;

  const handleApprove = async (reviewId: string) => {
    await supabase.from("movie_reviews").update({ is_approved: true }).eq("id", reviewId);
    refresh();
  };

  const handleDelete = async (reviewId: string) => {
    await supabase.from("movie_reviews").delete().eq("id", reviewId);
    refresh();
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Admin: Pending Reviews</h4>
      <ul className="space-y-3">
        {reviews.filter(r => !r.is_approved).map(r => (
          <li key={r.id} className="border p-3 rounded flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-sm font-medium">{r.user?.full_name || "User"}:</span>
              <span className="ml-2">{r.review}</span>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button size="sm" onClick={() => handleApprove(r.id)} disabled={loading}>
                <Check className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)} disabled={loading}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          </li>
        ))}
        {reviews.filter(r => !r.is_approved).length === 0 && (
          <li className="text-muted-foreground text-sm">No pending reviews</li>
        )}
      </ul>
    </div>
  );
}
