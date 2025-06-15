import React, { useState, useEffect, useMemo } from "react";
import { useMovieReviews } from "@/hooks/useMovieReviews";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Trash2, User, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MovieRating from "@/components/MovieRating";
import dayjs from "dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// Helper to calculate average rating from review objects (if ratings are implemented per review in future)
function getAverageRating(reviews) {
  // If reviews have a "rating" field, use it; else return null
  const ratingVals = reviews
    .map(r => r.rating)
    .filter(r => typeof r === "number");
  if (ratingVals.length === 0) return null;
  return (ratingVals.reduce((a, b) => a + b, 0) / ratingVals.length).toFixed(1);
}

export default function MovieReviews({ movieId }: { movieId: number }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingInput, setEditingInput] = useState(""); // For in-place edit
  const [filterRating, setFilterRating] = useState<number | null>(null); // Filter by rating
  const { reviews, myReview, submitReview, deleteReview, loading, error, refresh } = useMovieReviews(movieId);

  // Mimic review ratings for demo (since built-in review objects don't have rating)
  // This will be effective if reviews schema is extended to include rating per review.
  // For now, rely on MovieRating component for user's rating.

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [movieId, user]);

  // Compute average rating from reviews
  const averageRating = useMemo(() => getAverageRating(reviews), [reviews]);

  // Filtered reviews - currently just shows all, since "rating" not on review record.
  // When/if rating is added per review, can enable this.
  const filteredReviews = useMemo(() => {
    // REMOVED: Filtering by rating (since it doesn't exist)
    return reviews;
  }, [reviews, filterRating]);

  // Move myReview to top of list if not filtered out
  let displayReviews = [...filteredReviews];
  if (user && myReview) {
    displayReviews = [
      ...displayReviews.filter(r => r.user_id === user.id),
      ...displayReviews.filter(r => r.user_id !== user.id),
    ];
  }

  // --- Handlers ---

  // Submit new or update review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await submitReview(input.trim());
      setInput("");
      refresh();
      toast({ title: "Review posted!" });
    }
  };

  // Submit review edit
  const handleEditSubmit = async (r: any) => {
    if (!editingInput.trim()) return;
    await submitReview(editingInput.trim());
    setEditingReviewId(null);
    toast({ title: "Review updated!" });
    refresh();
  };

  // Start editing
  const startEdit = (r: any) => {
    setEditingReviewId(r.id);
    setEditingInput(r.review);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditingInput("");
  };

  // Review filter UI (if/when per-review rating exists, can enable)
  // For now, hide.
  // const ratingFilters = [5,4,3,2,1];

  return (
    <Card className="w-full max-w-xl mx-auto mt-8 mb-10 px-2 pb-6 pt-4 bg-gradient-to-t from-background/90 to-background/60 shadow-xl border-none">
      <CardContent className="p-0">
        <div className="flex items-center gap-3 mb-2 justify-between">
          <h3 className="text-lg font-bold tracking-tight">Reviews</h3>
          <span className="text-muted-foreground text-xs">{reviews.length} reviews</span>
        </div>

        {/* Your review input (write or edit) */}
        {user && (
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4 rounded-lg shadow bg-card px-3 py-2 border border-gray-800 items-center">
            <Avatar className="w-8 h-8 shrink-0">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt="Your avatar" />
              ) : (
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              )}
            </Avatar>
            <input
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground text-sm"
              placeholder={myReview ? "Edit your review…" : "Write a review…"}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              maxLength={500}
              autoFocus={false}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              variant="default"
              className="rounded shadow"
            >
              {myReview ? "Update" : "Post"}
            </Button>
          </form>
        )}

        {/* Show overall average rating */}
        <div className="mb-2 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <MovieRating movieId={movieId} />
            {averageRating ? (
              <span className="text-xs bg-yellow-200/10 px-2 py-1 rounded font-medium text-yellow-300 border border-yellow-700">
                Average: {averageRating}/5
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">No ratings yet</span>
            )}
          </div>
          {/* Optional: future rating filter */}
          {/* <div>
            <select
              className="rounded bg-muted text-muted-foreground px-2 py-1 text-xs border border-gray-700"
              value={filterRating ?? ""}
              onChange={e => setFilterRating(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All ratings</option>
              {ratingFilters.map(star => (
                <option value={star} key={star}>{star} star</option>
              ))}
            </select>
          </div> */}
        </div>

        {/* Show errors */}
        {error && (
          <div className="text-destructive text-sm mb-2">
            Failed to load reviews: {error}
          </div>
        )}

        {/* Review List */}
        <ul className="space-y-5 mb-4" data-testid="review-list">
          {(!displayReviews || displayReviews.length === 0) && !error && (
            <div className="text-muted-foreground text-sm mb-4 py-6 text-center border rounded-lg bg-card/80">
              No reviews yet. Be the first to review!
            </div>
          )}
          {displayReviews.map((r) => (
            <li key={r.id}>
              <div className={`flex gap-2 rounded-lg p-4 bg-gradient-to-r from-card/70 to-background/60 shadow border hover:scale-[1.01] transition-all duration-150 group relative`}>
                <Avatar className="w-10 h-10 shrink-0">
                  {r.user?.avatar_url ? (
                    <AvatarImage src={r.user.avatar_url} alt="User avatar" />
                  ) : (
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">{r.user?.full_name || "User"}</span>
                    <span className="text-xs text-gray-400">{dayjs(r.created_at).format("MMM D, YYYY")}</span>
                  </div>
                  {/* If this user is editing this review */}
                  {editingReviewId === r.id ? (
                    <div className="flex flex-col mt-1 gap-2">
                      <textarea
                        className="w-full rounded border bg-background text-white p-2 text-sm resize-none focus:ring focus:outline-none"
                        value={editingInput}
                        onChange={e => setEditingInput(e.target.value)}
                        maxLength={500}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button type="button" variant="default" size="sm" onClick={() => handleEditSubmit(r)} disabled={loading}>
                          Save
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm mt-1 text-muted-foreground whitespace-pre-line">{r.review}</div>
                  )}
                  {/* Actions for review owner */}
                  {user && r.user_id === user.id && editingReviewId !== r.id && (
                    <div className="flex gap-2 mt-2 items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(r)}
                        disabled={loading}
                        title="Edit review"
                        className="text-primary hover:bg-primary/10"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await deleteReview(r.id);
                          setInput("");
                          refresh();
                          toast({ title: "Review deleted." });
                        }}
                        disabled={loading}
                        title="Delete review"
                        className="ml-1"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {!user && (
          <div className="text-muted-foreground text-sm my-2 text-center">Sign in to write a review.</div>
        )}
      </CardContent>
    </Card>
  );
}
