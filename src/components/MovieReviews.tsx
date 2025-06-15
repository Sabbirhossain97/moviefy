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
import ReviewInput from "./ReviewInput";
import ReviewList from "./ReviewList";

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
        <ReviewInput
          user={user}
          input={input}
          setInput={setInput}
          loading={loading}
          onSubmit={handleSubmit}
          myReview={myReview}
        />

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
        </div>

        {/* Show errors */}
        {error && (
          <div className="text-destructive text-sm mb-2">
            Failed to load reviews: {error}
          </div>
        )}

        {/* Review List */}
        <ReviewList
          reviews={displayReviews}
          user={user}
          editingReviewId={editingReviewId}
          editingInput={editingInput}
          setEditingReviewId={setEditingReviewId}
          setEditingInput={setEditingInput}
          loading={loading}
          onEditSubmit={handleEditSubmit}
          onStartEdit={startEdit}
          onCancelEdit={cancelEdit}
          onDelete={async (id: string) => {
            await deleteReview(id);
            setInput("");
            refresh();
            toast({ title: "Review deleted." });
          }}
        />

        {!user && (
          <div className="text-muted-foreground text-sm my-2 text-center">Sign in to write a review.</div>
        )}
      </CardContent>
    </Card>
  );
}
