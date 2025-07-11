
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTVSeriesWishlist } from "@/hooks/useTVSeriesWishlist";
import { TVSeries } from "@/services/api";
import { cn } from "@/lib/utils";

interface TVSeriesWishlistButtonProps {
  series: TVSeries;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function TVSeriesWishlistButton({ series, size = "default", variant = "default" }: TVSeriesWishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useTVSeriesWishlist();
  const inWishlist = isInWishlist(series.id);

  const handleClick = () => {
    if (inWishlist) {
      removeFromWishlist(series.id);
    } else {
      addToWishlist(series);
    }
  };

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant={variant}
      className={cn(
        "transition-colors",
        inWishlist && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
      {size !== "icon" && (
        <span className="ml-2">
          {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </Button>
  );
}
