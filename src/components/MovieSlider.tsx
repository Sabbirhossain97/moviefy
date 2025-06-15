
import React, { useState, useRef, useEffect } from "react";
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

const SCROLL_STEP = 300;

const MovieSlider = ({ title, movies, className = "", renderActions }: MovieSliderProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Drag-related
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  // Validate movies
  const validMovies = movies.filter((movie): movie is Movie => 
    movie != null && typeof movie === 'object' && 'id' in movie && 'title' in movie
  );
  if (validMovies.length === 0) return null;

  // Arrow navigation
  const scrollLeft = () => {
    const container = sliderRef.current;
    if (container) {
      const newPosition = Math.max(0, container.scrollLeft - SCROLL_STEP);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      // In 'scroll' event handler we will updateScrollState, no need to set scrollPosition here.
    }
  };
  const scrollRight = () => {
    const container = sliderRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = Math.min(maxScroll, container.scrollLeft + SCROLL_STEP);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      // In 'scroll' event handler we will updateScrollState, no need to set scrollPosition here.
    }
  };

  // Track position & whether at start/end
  const updateScrollState = () => {
    const container = sliderRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
      const maxScroll = container.scrollWidth - container.clientWidth;
      setAtEnd(container.scrollLeft >= maxScroll - 1 || maxScroll <= 0);
    }
  };

  useEffect(() => {
    // On mount/resize: check if at end, in case items fit perfectly.
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Drag/Swipe Scroll Logic
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStartX.current = e.pageX;
    dragStartScroll.current = sliderRef.current?.scrollLeft ?? 0;
    document.body.style.userSelect = "none";
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    const dx = e.pageX - dragStartX.current;
    sliderRef.current.scrollLeft = dragStartScroll.current - dx;
  };
  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    // Attach global move/up when dragging
    if (isDragging.current) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line
  }, [isDragging.current]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].pageX;
    dragStartScroll.current = sliderRef.current?.scrollLeft ?? 0;
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sliderRef.current) return;
    const dx = e.touches[0].pageX - dragStartX.current;
    sliderRef.current.scrollLeft = dragStartScroll.current - dx;
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // On scroll: update state for arrows
  const handleScroll = () => updateScrollState();

  return (
    <section className={`relative ${className}`}>
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="relative group select-none">
        {/* Only show left scroll button if not at the very start */}
        {scrollPosition > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 transition-opacity gradient-card backdrop-blur-sm border-border/50 opacity-0 group-hover:opacity-100"
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
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 cursor-grab active:cursor-grabbing"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          draggable={false}
        >
          {validMovies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-[200px]">
              <Link to={`/movie/${movie.id}`} className="block">
                <div className="gradient-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border/50">
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
        {/* Only show right scroll button if not at the very end */}
        {!atEnd && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity gradient-card backdrop-blur-sm border-border/50"
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

