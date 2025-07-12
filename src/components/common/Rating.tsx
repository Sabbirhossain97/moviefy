import { useRatings } from "@/hooks/useRatings";
import { useAuth } from "@/hooks/useAuth";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Rating({ id, type }: { id: number, type: string }) {
  const { user } = useAuth();
  const { rating, submitRating, loading } = useRatings(id, type);

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
