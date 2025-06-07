
import React, { useState } from "react";
import { Movie, IMAGE_SIZES } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  className?: string;
  renderActions?: (movie: Movie) => React.ReactNode;
}

const MovieSlider = ({ title, movies, className = "", renderActions }: MovieSliderProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrollable, setIsScrollable] = useState(true);

  // Filter out any undefined, null, or invalid movie objects
  const validMovies = movies.filter((movie): movie is Movie => 
    movie != null && 
    typeof movie === 'object' && 
    'id' in movie && 
    'title' in movie
  );

  // Don't render if no valid movies
  if (validMovies.length === 0) {
    return null;
  }

  const scrollLeft = () => {
    const container = document.getElementById(`slider-${title.replace(/\s+/g, '-')}`);
    if (container) {
      const newPosition = Math.max(0, scrollPosition - 300);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById(`slider-${title.replace(/\s+/g, '-')}`);
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + 300);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };

  return (
    <section className={`relative ${className}`}>
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      
      <div className="relative group">
        {/* Left scroll button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
          onClick={scrollLeft}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Movie cards container */}
        <div
          id={`slider-${title.replace(/\s+/g, '-')}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {validMovies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-48">
              <Link to={`/movie/${movie.id}`} className="block">
                <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={
                        movie.poster_path
                          ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
                          : "/placeholder.svg"
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"}
                    </p>
                    {movie.vote_average > 0 && (
                      <p className="text-xs text-yellow-500 mt-1">
                        ★ {movie.vote_average.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
              {renderActions && (
                <div className="mt-2 px-3">
                  {renderActions(movie)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default MovieSlider;
