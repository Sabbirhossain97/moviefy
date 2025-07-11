
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useTVSeriesWishlist } from '@/hooks/useTVSeriesWishlist';
import { TVSeries } from '@/services/api';
import { cn } from '@/lib/utils';

interface TVSeriesWishlistButtonProps {
  series: TVSeries;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export const TVSeriesWishlistButton = ({ 
  series, 
  size = 'default',
  variant = 'outline',
}: TVSeriesWishlistButtonProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useTVSeriesWishlist();
  const inWishlist = isInWishlist(series.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(series.id);
    } else {
      addToWishlist(series);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      onClick={handleClick}
      className={cn(
        "transition-all duration-200 flex items-center rounded-full p-0 w-9 h-9 justify-center shadow hover:bg-red-100/30",
        inWishlist 
          ? "text-red-500 bg-red-100/50 border-red-500"
          : "hover:text-red-500",
        variant === 'ghost' && "bg-black/70 hover:bg-black/90 backdrop-blur-sm",
        size === 'icon' && "w-9 h-9 p-0"
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          "transition-all duration-200",
          size === 'sm' || size === 'icon' 
            ? "w-4 h-4" 
            : size === 'lg' 
            ? "w-5 h-5" 
            : "w-4 h-4",
          inWishlist && "fill-red-500 text-red-500",
          !inWishlist && "fill-none"
        )} 
        fill={inWishlist ? "currentColor" : "none"}
      />
    </Button>
  );
};
