import { Star } from "lucide-react";

interface AverageRatingProps {
  averageRating: number;
  totalReviews: number;
}

const AverageRating: React.FC<AverageRatingProps> = ({ averageRating, totalReviews }) => {
  if (totalReviews === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={16}
              className="text-muted-foreground/40"
              fill="none"
            />
          ))}
        </div>
        <span className="text-sm">No ratings yet</span>
      </div>
    );
  }

  const roundedRating = Math.round(averageRating * 2) / 2; 
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;

  return (
    <div className="flex items-center gap-2 py-0 rounded-lg">
      <span className="text-[14px] font-bold text-yellow-600 dark:text-yellow-400">
        {averageRating.toFixed(1)}
      </span>
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }, (_, i) => {
          if (i < fullStars) {
            return (
              <Star
                key={i}
                size={14}
                className="text-yellow-400"
                fill="currentColor"
              />
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <div key={i} className="relative">
                <Star
                  size={14}
                  className="text-muted-foreground/30"
                  fill="none"
                />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    size={14}
                    className="text-yellow-400"
                    fill="currentColor"
                  />
                </div>
              </div>
            );
          } else {
            return (
              <Star
                key={i}
                size={14}
                className="text-muted-foreground/30"
                fill="none"
              />
            );
          }
        })}
      </div>
      <div className="flex flex-col items-center py-2">
        <span className="text-xs text-muted-foreground">
          ({totalReviews} rating{totalReviews !== 1 ? 's' : ''})
        </span>
      </div>
    </div>
  );
};

export default AverageRating;
