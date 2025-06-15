
import React, { useState, useEffect } from "react";
import { useMovieReviews } from "@/hooks/useMovieReviews";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import MovieRating from "@/components/MovieRating";

export default function MovieReviews({ movieId }: { movieId: number }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);
  const { reviews, myReview, submitReview, deleteReview, loading, refresh } = useMovieReviews(movieId);

  // After mounting or user changes, always get latest reviews
  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [movieId, user]);

  // Show reviews instantly after submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await submitReview(input.trim());
      setInput("");
      setJustSubmitted(true);
      await refresh();
      setTimeout(() => setJustSubmitted(false), 1000);
    }
  };

  return (
    <div className="max-w-xl w-full ml-0">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <span className="text-muted-foreground text-xs">{reviews.length} reviews</span>
      </div>
      {/* Move MovieRating (star) to top here */}
      <div className="mb-2">
        <MovieRating movieId={movieId} />
      </div>
      <ul className="space-y-4 mb-4" data-testid="review-list">
        {reviews.length === 0 && (
          <div className="text-muted-foreground text-sm mb-4">No reviews yet.</div>
        )}
        {reviews.map((r) => (
          <li key={r.id} className="border rounded p-3 flex flex-col bg-background">
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
          <Button
            type="submit"
            disabled={loading}
            variant="outline"
            className="border"
          >
            Post
          </Button>
          {myReview && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={async () => {
                await deleteReview(myReview.id);
                setInput("");
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
      {!user && (
        <div className="text-muted-foreground text-sm my-2">Sign in to write a review.</div>
      )}
    </div>
  );
}
