
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar } from 'lucide-react';
import { Movie } from '@/services/api';
import { WishlistButton } from '@/components/movies/WishlistButton';

interface MovieCardProps {
  movie: Movie;
  showWishlist?: boolean;
}

export const MovieCardWithWishlist = ({ movie, showWishlist = true }: MovieCardProps) => {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.svg';

  return (
    <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 hover:scale-105">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Link to={`/movie/${movie.id}`}>
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-white border-none">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {movie.vote_average.toFixed(1)}
          </Badge>
        </div>

        {/* Wishlist Button */}
        {showWishlist && (
          <div className="absolute top-2 right-2">
            <WishlistButton movie={movie} size="sm" variant="ghost" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <Link 
          to={`/movie/${movie.id}`}
          className="block hover:text-movie-primary transition-colors"
        >
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{movie.title}</h3>
        </Link>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 mr-1" />
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
        </div>
      </CardContent>
    </Card>
  );
};
