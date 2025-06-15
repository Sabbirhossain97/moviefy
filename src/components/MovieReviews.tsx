
import React, { useState, useEffect, useMemo } from "react";
import { useMovieReviews } from "@/hooks/useMovieReviews";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ReviewInput from "./ReviewInput";
import ReviewList from "./ReviewList";
import MovieRating from "@/components/MovieRating";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

// Helper to calculate average rating from reviews
function getAverageRating(reviews) {
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
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const { reviews, myReview, submitReview, deleteReview, loading, error, refresh } = useMovieReviews(movieId);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [movieId, user]);

  // Compute average rating from reviews
  const averageRating = useMemo(() => getAverageRating(reviews), [reviews]);

  // Filtering and sorting logic
  const filteredReviews = useMemo(() => {
    let filtered = reviews;
    if (filterRating) {
      filtered = filtered.filter((r) => r.rating === filterRating);
    }
    // Sort reviews by created_at ASC or DESC
    filtered = [...filtered].sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return filtered;
  }, [reviews, filterRating, sortOrder]);

  // Move myReview to top of list if not filtered out
  let displayReviews = [...filteredReviews];
  if (user && myReview) {
    displayReviews = [
      ...displayReviews.filter(r => r.user_id === user.id),
      ...displayReviews.filter(r => r.user_id !== user.id),
    ];
  }

  // --- Handlers ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await submitReview(input.trim());
      setInput("");
      refresh();
      toast({ title: "Review posted!" });
    }
  };

  const handleEditSubmit = async (r: any) => {
    if (!editingInput.trim()) return;
    await submitReview(editingInput.trim());
    setEditingReviewId(null);
    toast({ title: "Review updated!" });
    refresh();
  };

  const startEdit = (r: any) => {
    setEditingReviewId(r.id);
    setEditingInput(r.review);
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditingInput("");
  };

  const ratingFilters = [5, 4, 3, 2, 1];

  return (
    <Card className="w-full max-w-xl mx-auto mt-8 mb-10 px-2 pb-6 pt-4 bg-gradient-to-t from-background/90 to-background/60 shadow-xl border-none">
      <CardContent className="p-0">
        <div className="flex items-center gap-3 mb-2 justify-between">
          <h3 className="text-lg font-bold tracking-tight">Reviews</h3>
          <span className="text-muted-foreground text-xs">{reviews.length} reviews</span>
        </div>

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

        {/* Filters Row */}
        <div className="mb-4 flex gap-3 items-center flex-wrap">
          <span className="font-semibold text-xs text-muted-foreground mr-1">Filter by rating:</span>
          {ratingFilters.map((r) => (
            <Button
              key={r}
              size="icon"
              variant={filterRating === r ? "default" : "outline"}
              className={`w-8 h-8 px-0 rounded-full border ${filterRating === r ? "bg-yellow-500 text-black border-yellow-600" : "text-yellow-500"}`}
              onClick={() => setFilterRating(filterRating === r ? null : r)}
              title={`Show only ${r}-star reviews`}
              type="button"
            >
              <span className="text-lg">{r}★</span>
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            className="ml-2 text-xs text-muted-foreground px-2"
            onClick={() => setFilterRating(null)}
            disabled={filterRating == null}
            type="button"
          >
            Clear
          </Button>

          {/* Sort order filter */}
          <span className="font-semibold text-xs text-muted-foreground ml-6">Sort:</span>
          <Button
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            size="sm"
            variant="outline"
            className="flex items-center gap-1 border border-primary/30 ml-1"
            type="button"
          >
            {sortOrder === "newest" ? (
              <>
                <ChevronDown className="w-4 h-4" />
                Newest
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4" />
                Oldest
              </>
            )}
          </Button>
        </div>

        {/* Show errors */}
        {error && (
          <div className="text-destructive text-sm mb-2">
            Failed to load reviews: {error}
          </div>
        )}

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
          filterRating={filterRating}
        />

        {!user && (
          <div className="text-muted-foreground text-sm my-2 text-center">Sign in to write a review.</div>
        )}
      </CardContent>
    </Card>
  );
}
