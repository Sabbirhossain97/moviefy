
import { Card, CardContent } from "@/components/ui/card";
import { Movie } from "@/services/api";
import { IMAGE_SIZES } from "@/services/api";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/WishlistButton";
import { WatchedButton } from "@/components/WatchedButton";

interface MovieCardProps {
  movie: Movie;
  size?: "sm" | "md" | "lg";
}

const MovieCard = ({ movie, size = "md" }: MovieCardProps) => {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const posterUrl = movie.poster_path
    ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
    : "/placeholder.svg";
  const cardSizes = {
    sm: "w-[150px]",
    md: "w-[200px]",
    lg: "w-[250px]",
  };

  return (
    <Card className={`overflow-hidden movie-card-hover pb-2 gradient-card border-border/50`}>
      <div className="relative aspect-[2/3] overflow-hidden group">
        <Link to={`/movie/${movie.id}`}>
          <img
            src={posterUrl}
            alt={movie.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col gap-2">
          <WishlistButton
            movie={movie}
            size="icon"
            variant="ghost"
            showText={false}
          />
          <WatchedButton
            movie={movie}
            size="icon"
            variant="ghost"
            showText={false}
          />
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="flex items-center gap-1 font-medium gradient-secondary">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3 space-y-3">
        <div className="h-[40px] flex flex-col justify-between">
          <Link to={`/movie/${movie.id}`}>
            <h3
              className="font-semibold text-sm line-clamp-2 leading-tight hover:underline"
              title={movie.title}
            >
              {movie.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground">{releaseYear}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
