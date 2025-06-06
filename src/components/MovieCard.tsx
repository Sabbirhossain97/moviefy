
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Movie } from "@/services/api";
import { IMAGE_SIZES } from "@/services/api";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  movie: Movie;
  size?: "sm" | "md" | "lg";
}

const MovieCard = ({ movie, size = "md" }: MovieCardProps) => {
  // Format release date to year only
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  
  // Generate poster URL or use placeholder
  const posterUrl = movie.poster_path 
    ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
    : "/placeholder.svg";
  
  const cardSizes = {
    sm: "w-[150px]",
    md: "w-[200px]",
    lg: "w-[250px]",
  };

  return (
    <Link to={`/movie/${movie.id}`}>
      <Card className={`overflow-hidden movie-card-hover ${cardSizes[size]} h-full bg-card`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.title}
            className="object-cover w-full h-full transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="flex items-center gap-1 font-medium">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold line-clamp-2 text-sm">{movie.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{releaseYear}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
