import { useState, useRef, useEffect } from "react";
import { Movie, IMAGE_SIZES } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { WishlistButton } from "./WishlistButton";

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  className?: string;
  renderActions?: (movie: Movie) => React.ReactNode;
}

const SCROLL_STEP = 300;

const MovieSlider = ({ title, movies, className = "", renderActions }: MovieSliderProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);


  const validMovies = movies.filter((movie): movie is Movie =>
    movie != null && typeof movie === 'object' && 'id' in movie && 'title' in movie
  );
  if (validMovies.length === 0) return null;

  const scrollLeft = () => {
    const container = sliderRef.current;
    if (container) {
      const newPosition = Math.max(0, container.scrollLeft - SCROLL_STEP);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    const container = sliderRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = Math.min(maxScroll, container.scrollLeft + SCROLL_STEP);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const updateScrollState = () => {
    const container = sliderRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
      const maxScroll = container.scrollWidth - container.clientWidth;
      setAtEnd(container.scrollLeft >= maxScroll - 1 || maxScroll <= 0);
    }
  };

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleScroll = () => updateScrollState();

  return (
    <section className={`relative ${className}`}>
      {title !== "Trending Movies" && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="relative group/slider select-none">
        {scrollPosition > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 transition-opacity gradient-card backdrop-blur-sm border-border/50 opacity-0 group-hover/slider:opacity-100"
            onClick={scrollLeft}
            tabIndex={0}
            aria-disabled={false}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div
          ref={sliderRef}
          id={`slider-${title.replace(/\s+/g, '-')}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          draggable={false}
        >
          {validMovies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-[200px] sm:w-[240px] h-full group/movie">
              <Link to={`/movie/${movie.id}`} className="block">
                <div className="gradient-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border/50 h-full">
                  <div className="overflow-hidden h-full relative">
                    <img
                      src={
                        movie.poster_path
                          ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
                          : "/placeholder.svg"
                      }
                      alt={movie.title}
                      className="w-full min-h-[357px] object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover/movie:opacity-100 transition-opacity z-10 flex flex-col gap-2">
                      <WishlistButton
                        movie={movie}
                        size="icon"
                        variant="ghost"
                        showText={false}
                      />
                    </div>
                  </div>
                  <div className="p-3 h-[60px] flex flex-col justify-between">
                    <h3
                      className="font-medium text-sm line-clamp-2 leading-tight"
                      title={movie.title}
                    >
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"}
                      </p>
                      {movie.vote_average > 0 && (
                        <p className="text-xs text-yellow-500">
                          ★ {movie.vote_average.toFixed(1)}
                        </p>
                      )}
                    </div>
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
        {!atEnd && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity gradient-card backdrop-blur-sm border-border/50"
            onClick={scrollRight}
            tabIndex={0}
            aria-disabled={false}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </section>
  );
};

export default MovieSlider;
