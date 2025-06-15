
import React, { useState, useEffect } from "react";
import { useMovieReviews } from "@/hooks/useMovieReviews";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function MovieReviews({ movieId }: { movieId: number }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const { reviews, myReview, submitReview, deleteReview, loading, refresh } = useMovieReviews(movieId);

  // Make sure to refresh reviews after a new review is submitted by current user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await submitReview(input);
      setInput("");
      await refresh(); // Force update to fetch latest reviews
    }
  };

  // After mounting, always get latest reviews as a safeguard
  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [movieId]);

  return (
    <div className="max-w-xl w-full ml-0">
      <h3 className="text-lg font-semibold mb-2">Reviews</h3>
      {reviews.length === 0 && <div className="text-muted-foreground text-sm mb-4">No reviews yet.</div>}

      <ul className="space-y-4 mb-4">
        {reviews.map((r) => (
          <li key={r.id} className="border rounded p-3 flex flex-col">
            <div className="flex items-center gap-2 font-medium">{r.user?.full_name || "User"}</div>
            <span className="text-sm text-muted-foreground">{r.review}</span>
          </li>
        ))}
      </ul>

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            className="flex-1 border rounded px-3 py-1 text-black bg-white"
            placeholder="Write a review …"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            maxLength={500}
          />
          <Button type="submit" disabled={loading}>
            Post
          </Button>
          {myReview && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={async () => {
                await deleteReview(myReview.id);
                await refresh();
              }}
              disabled={loading}
              title="Delete review"
            >
              <Trash2 />
            </Button>
          )}
        </form>
      )}
    </div>
  );
}
