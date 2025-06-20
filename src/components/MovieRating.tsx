import { useMovieRatings } from "@/hooks/useMovieRatings";
import { useAuth } from "@/hooks/useAuth";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MovieRating({ movieId }: { movieId: number }) {
  const { user } = useAuth();
  const { rating, submitRating, loading } = useMovieRatings(movieId);

  if (!user) return <div className="text-muted-foreground text-sm">Sign in to rate</div>;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="icon"
          disabled={loading}
          className={`p-0 ${rating && star <= rating ? "text-yellow-500" : "text-muted-foreground"}`}
          onClick={() => submitRating(star)}
          aria-label={`Rate ${star} star`}
        >
          <Star fill={rating && star <= rating ? "currentColor" : "none"} />
        </Button>
      ))}
      {rating && (
        <span className="ml-2 text-xs">{rating}/5</span>
      )}
    </div>
  );
}
