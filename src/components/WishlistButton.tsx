
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { Movie } from '@/services/api';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  movie: Movie;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const WishlistButton = ({ 
  movie, 
  size = 'default',
  variant = 'outline' 
}: WishlistButtonProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(movie.id);

  const handleClick = () => {
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
        "transition-colors",
        inWishlist && "text-red-500 border-red-500 hover:bg-red-50"
      )}
    >
      <Heart 
        className={cn(
          "w-4 h-4",
          size === 'sm' && "w-3 h-3",
          size === 'lg' && "w-5 h-5",
          inWishlist && "fill-current"
        )} 
      />
      {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    </Button>
  );
};
