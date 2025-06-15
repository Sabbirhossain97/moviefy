
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { Movie } from '@/services/api';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  movie: Movie;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
}

export const WishlistButton = ({ 
  movie, 
  size = 'default',
  variant = 'outline',
  showText = true
}: WishlistButtonProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(movie.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleClick}
      className={cn(
        "transition-all duration-200",
        inWishlist 
          ? "text-red-500 border-red-500 hover:bg-red-50 bg-red-50/50" 
          : "hover:text-red-500 hover:border-red-500",
        variant === 'ghost' && "bg-black/50 hover:bg-black/70 backdrop-blur-sm"
      )}
    >
      <Heart 
        className={cn(
          "transition-all duration-200",
          size === 'sm' ? "w-3 h-3" : size === 'lg' ? "w-5 h-5" : "w-4 h-4",
          showText && (size === 'sm' ? "mr-1" : "mr-2"),
          inWishlist && "fill-current"
        )} 
      />
      {showText && (
        <span className={cn(size === 'sm' && "text-xs")}>
          {inWishlist ? 'Remove' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
};
