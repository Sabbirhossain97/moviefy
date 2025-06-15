import React, { useState, useEffect, useMemo } from "react";
import { useMovieReviews } from "@/hooks/useMovieReviews";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ReviewInput from "./ReviewInput";
import ReviewList from "./ReviewList";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

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

  // Compute user's most recent review for rating chip logic
  const latestUserReviewId =
    user && displayReviews.filter(r => r.user_id === user.id).length
      ? displayReviews.filter(r => r.user_id === user.id)[0].id
      : null;

  // List of ratings for filter
  const filterOptions = [
    { label: "All ratings", value: null },
    { label: "5 stars", value: "5" },
    { label: "4 stars", value: "4" },
    { label: "3 stars", value: "3" },
    { label: "2 stars", value: "2" },
    { label: "1 star", value: "1" }
  ];

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

        {/* Filters Row with dropdowns */}
        <div className="mb-4 flex gap-3 items-center flex-wrap">
          {/* Sort order dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="text-xs px-3 py-1 min-w-[120px]"
              >
                Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Sort reviews by</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setSortOrder("newest")}
                className={sortOrder === "newest" ? "bg-accent" : ""}
              >
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOrder("oldest")}
                className={sortOrder === "oldest" ? "bg-accent" : ""}
              >
                Oldest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Rating filter dropdown */}
          <Select
            value={filterRating !== null ? String(filterRating) : ""}
            onValueChange={v => setFilterRating(v === "" ? null : Number(v))}
          >
            <SelectTrigger className="w-[140px] text-xs h-8">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All ratings</SelectItem>
              <SelectItem value="5">5 stars</SelectItem>
              <SelectItem value="4">4 stars</SelectItem>
              <SelectItem value="3">3 stars</SelectItem>
              <SelectItem value="2">2 stars</SelectItem>
              <SelectItem value="1">1 star</SelectItem>
            </SelectContent>
          </Select>
          {filterRating !== null && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground px-2"
              onClick={() => setFilterRating(null)}
              type="button"
            >
              Clear
            </Button>
          )}
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
          latestUserReviewId={latestUserReviewId}
        />

        {!user && (
          <div className="text-muted-foreground text-sm my-2 text-center">
            Sign in to write a review.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
