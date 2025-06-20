import React, { useState, useEffect, useMemo } from "react";
import { useMovieReviews } from "@/hooks/useMovieReviews";
import { useAuth } from "@/hooks/useAuth";
import ReviewInput from "./ReviewInput";
import ReviewList from "./ReviewList";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useMovieRatings } from "@/hooks/useMovieRatings";
import { toast } from "@/hooks/use-toast";

function getAverageRating(reviews) {
  return null;
}

export default function MovieReviews({ movieId }: { movieId: number }) {
  const { user, profile } = useAuth();
  const [input, setInput] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingInput, setEditingInput] = useState(""); // For in-place edit
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const { reviews, myReview, submitReview, deleteReview, loading, error, refresh } = useMovieReviews(movieId);
  const { rating: userRating } = useMovieRatings(movieId);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [movieId, user]);

  const filteredReviews = useMemo(() => {
    let filtered = reviews;
    filtered = [...filtered].sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return filtered;
  }, [reviews, sortOrder]);

  let displayReviews = [...filteredReviews];
  if (user && myReview) {
    displayReviews = [
      ...displayReviews.filter(r => r.user_id === user.id),
      ...displayReviews.filter(r => r.user_id !== user.id),
    ];
  }

  const latestUserReviewId =
    user && displayReviews.filter(r => r.user_id === user.id).length
      ? displayReviews.filter(r => r.user_id === user.id)[0].id
      : null;

  const filterOptions = [
    { label: "All ratings", value: null },
    { label: "5 stars", value: "5" },
    { label: "4 stars", value: "4" },
    { label: "3 stars", value: "3" },
    { label: "2 stars", value: "2" },
    { label: "1 star", value: "1" }
  ];

  const currentUserInfo = user
    ? {
      ...user,
      full_name: profile?.full_name || user.email || "User",
      avatar_url: profile?.avatar_url || null
    }
    : null;

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
    <div className="w-full max-w-3xl">
      <h2 className="text-2xl font-bold mb-2">Reviews</h2>
      <div className="mb-4 flex gap-3 items-center flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="text-xs px-3 h-8 py-1 min-w-[120px] bg-card/80"
            >
              Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="z-[999] bg-background">
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
          value={filterRating !== null ? String(filterRating) : "all"}
          onValueChange={v => setFilterRating(v === "all" ? null : Number(v))}
        >
          <SelectTrigger className="w-[140px] text-xs h-8 bg-card/80">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent className="z-[999] bg-background">
            <SelectItem value="all">All ratings</SelectItem>
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

      <ReviewInput
        user={currentUserInfo}
        input={input}
        setInput={setInput}
        loading={loading}
        onSubmit={handleSubmit}
        myReview={myReview}
      />

      {/* Show errors */}
      {error && (
        <div className="text-destructive text-sm mb-2">
          Failed to load reviews: {error}
        </div>
      )}

      <ReviewList
        reviews={displayReviews}
        user={currentUserInfo}
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
        userRating={userRating}
      />

      {!user && (
        <div className="text-muted-foreground text-sm my-2 text-center">
          Sign in to write a review.
        </div>
      )}
    </div>
  );
}
