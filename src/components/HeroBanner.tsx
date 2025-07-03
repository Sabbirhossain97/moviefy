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
        "relative w-full aspect-[21/16] sm:aspect-[21/14] md:aspect-[21/12] lg:aspect-[21/10] xl:aspect-[21/7] overflow-hidden animate-fade-in",
        className
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-top [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
      </div>
      <div className="relative h-full container flex flex-col justify-end px-4 py-10">
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
