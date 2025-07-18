import { useState, useEffect, useMemo } from "react";
import { useMovieReviews } from "@/hooks/useMovieReviews";
import { useAuth } from "@/hooks/useAuth";
import ReviewInput from "./ReviewInput";
import ReviewList from "./ReviewList";
import AverageRating from "./AverageRating";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function Reviews({ id, type }: { id: number, type: string }) {
  const { user, profile } = useAuth();
  const [input, setInput] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editingInput, setEditingInput] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { reviews, seriesReviews, submitReview, editReview, deleteReview, loading, error, refresh } = useMovieReviews(id, type);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [id, user]);

  const allReviews = type === 'movie' ? reviews : seriesReviews;

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...allReviews];

    // Filter by rating if a rating filter is selected
    if (filterRating !== null) {
      filtered = filtered.filter(review => review.user_rating === filterRating);
    }

    // Sort reviews
    filtered.sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [allReviews, filterRating, sortOrder]);

  // Move current user's reviews to the top and determine which reviews should show ratings
  const displayReviews = useMemo(() => {
    let processedReviews = [...filteredAndSortedReviews];
    
    // Separate current user's reviews from others
    if (user) {
      processedReviews = [
        ...processedReviews.filter(r => r.user_id === user.id),
        ...processedReviews.filter(r => r.user_id !== user.id),
      ];
    }

    // Track which users have already shown their rating
    const userRatingShown = new Set();
    
    // Add a flag to each review indicating whether to show the rating
    return processedReviews.map(review => {
      const shouldShowRating = !userRatingShown.has(review.user_id) && review.user_rating;
      if (shouldShowRating) {
        userRatingShown.add(review.user_id);
      }
      
      return {
        ...review,
        showRating: shouldShowRating
      };
    });
  }, [filteredAndSortedReviews, user]);

  const currentUserInfo = user
    ? {
      ...user,
      full_name: profile?.full_name || user.email || "User",
      avatar_url: profile?.avatar_url || null
    }
    : null;

  // Calculate average rating and total ratings count properly
  const ratingStats = useMemo(() => {
    // Get unique users who have given ratings
    const uniqueUserRatings = new Map();
    
    allReviews.forEach(review => {
      if (review.user_rating !== null && review.user_rating !== undefined) {
        // Only keep the most recent rating for each user
        if (!uniqueUserRatings.has(review.user_id) || 
            new Date(review.created_at) > new Date(uniqueUserRatings.get(review.user_id).created_at)) {
          uniqueUserRatings.set(review.user_id, review);
        }
      }
    });

    const ratingsArray = Array.from(uniqueUserRatings.values());
    const totalRatings = ratingsArray.length;
    const averageRating = totalRatings > 0
      ? ratingsArray.reduce((sum, review) => sum + (review.user_rating || 0), 0) / totalRatings
      : 0;

    return { averageRating, totalRatings };
  }, [allReviews]);

  // --- Handlers ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      submitReview(input.trim());
      setInput("");
      refresh();
      toast({ title: "Review posted!" });
    }
  };

  const handleEditSubmit = async (r: any) => {
    if (!editingInput.trim()) return;
    await editReview(editingInput.trim(), r.id);
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
      </div>

      <div className="mb-4 mt-4 flex justify-between gap-3 items-center flex-wrap">
        <div>
          <AverageRating
            averageRating={ratingStats.averageRating}
            totalReviews={ratingStats.totalRatings}
          />
        </div>
        <div className="flex gap-2">
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
            <SelectTrigger className="w-[140px] rounded-md text-xs border-muted-foreground/10 h-8 bg-card/80">
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
      </div>

      <ReviewInput
        user={currentUserInfo}
        input={input}
        setInput={setInput}
        loading={loading}
        onSubmit={handleSubmit}
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
        setEditingReviewId={(id: number) => setEditingReviewId(typeof id === "string" ? Number(id) : id)}
        setEditingInput={setEditingInput}
        loading={loading}
        onEditSubmit={handleEditSubmit}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onDelete={async (id: number) => {
          await deleteReview(id);
          setInput("");
          refresh();
          toast({ title: "Review deleted." });
        }}
        filterRating={filterRating}
      />

      {!user && (
        <div className="text-muted-foreground text-sm my-2 text-center">
          Sign in to write a review.
        </div>
      )}
    </div>
  );
}
