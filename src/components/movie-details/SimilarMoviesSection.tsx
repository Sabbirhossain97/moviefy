
import React from "react";
import MovieSlider from "@/components/MovieSlider";

interface SimilarMoviesSectionProps {
  movies: any[];
}

export const SimilarMoviesSection: React.FC<SimilarMoviesSectionProps> = ({
  movies,
}) => {
  if (!movies || movies.length === 0) return null;
  return (
    <section className="container mt-10 mb-4">
      <MovieSlider title="Similar Movies" movies={movies.slice(0, 10)} />
    </section>
  );
};
