
import React from "react";
import { Movie, IMAGE_SIZES } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  movie: Movie;
  className?: string;
}

const HeroBanner = ({ movie, className }: HeroBannerProps) => {
  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_SIZES.backdrop.original}${movie.backdrop_path}`
    : "/placeholder.svg";

  return (
    <div 
      className={cn(
        "relative w-full aspect-[21/9] overflow-hidden rounded-lg animate-fade-in", 
        className
      )}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>
      
      <div className="relative h-full container flex flex-col justify-end p-6 md:p-10">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-shadow">{movie.title}</h1>
          <p className="text-sm md:text-base line-clamp-3 mb-6 text-gray-200 max-w-xl text-shadow">
            {movie.overview}
          </p>
          <Link to={`/movie/${movie.id}`}>
            <Button className="bg-movie-primary hover:bg-movie-primary/90">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
