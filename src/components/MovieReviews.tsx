
// Movie Reviews: Improved, showing all reviews publicly and in a beautiful style

import React, { useState, useEffect } from "react";
import { useMovieReviews } from "@/hooks/useMovieReviews";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MovieRating from "@/components/MovieRating";
import dayjs from "dayjs";

export default function MovieReviews({ movieId }: { movieId: number }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);
  const { reviews, myReview, submitReview, deleteReview, loading, refresh } = useMovieReviews(movieId);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [movieId, user]);

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
    <div className="max-w-xl w-full ml-0 md:ml-0">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <span className="text-muted-foreground text-xs">{reviews.length} reviews</span>
      </div>
      {/* Movie rating summary */}
      <div className="mb-2">
        <MovieRating movieId={movieId} />
      </div>
      <ul className="space-y-4 mb-4" data-testid="review-list">
        {reviews.length === 0 && (
          <div className="text-muted-foreground text-sm mb-4">No reviews yet. Be the first to review!</div>
        )}
        {reviews.map((r) => (
          <li key={r.id} className="border rounded-lg p-4 flex  bg-background shadow-sm hover:shadow-lg transition">
            <div className="flex items-start gap-3 w-full">
              <Avatar className="w-11 h-11 shrink-0">
                {r.user?.avatar_url ? (
                  <AvatarImage src={r.user.avatar_url} alt="User avatar" />
                ) : (
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base">{r.user?.full_name || "User"}</span>
                  <span className="text-xs text-gray-400">{dayjs(r.created_at).format("MMM D, YYYY")}</span>
                </div>
                <div className="text-sm mt-1 text-muted-foreground whitespace-pre-line">{r.review}</div>
                {/* Show delete button for owner's review */}
                {user && r.user_id === user.id && (
                  <div className="mt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        await deleteReview(r.id);
                        setInput("");
                        await refresh();
                      }}
                      disabled={loading}
                      title="Delete review"
                      className="text-destructive hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            className="flex-1 border rounded px-3 py-1 text-black bg-white"
            placeholder={myReview ? "Edit your review…" : "Write a review…"}
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
            {myReview ? "Update" : "Post"}
          </Button>
        </form>
      )}
      {!user && (
        <div className="text-muted-foreground text-sm my-2">Sign in to write a review.</div>
      )}
    </div>
  );
}

