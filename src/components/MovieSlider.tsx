
import React, { useRef } from "react";
import { Movie } from "@/services/api";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  className?: string;
  cardSize?: "sm" | "md" | "lg";
}

const MovieSlider = ({ title, movies, className, cardSize = "md" }: MovieSliderProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" 
      ? -container.clientWidth / 1.5 
      : container.clientWidth / 1.5;
    
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (movies.length === 0) {
    return null;
  }

  return (
    <section className={cn("my-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="icon"
            aria-label="Scroll left"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Scroll right"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4 scrollbar-hide" ref={scrollContainerRef}>
        <div className="flex gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard movie={movie} size={cardSize} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSlider;
