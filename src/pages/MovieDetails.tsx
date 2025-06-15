import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api, Movie, MovieVideo, IMAGE_SIZES, Cast } from '@/services/api';
import Header from '@/components/Header';
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from '@/components/WishlistButton';
import MovieReviews from "@/components/MovieReviews";
import MovieReviewAdminPanel from "@/components/MovieReviewAdminPanel";
import { MovieHeader } from "@/components/movie-details/MovieHeader";
import { MovieInfoSection } from "@/components/movie-details/MovieInfoSection";
import { TrailerDialog } from "@/components/movie-details/TrailerDialog";
import { CastSection } from "@/components/movie-details/CastSection";
import { SimilarMoviesSection } from "@/components/movie-details/SimilarMoviesSection";

interface CreditsResponse {
  cast: Cast[];
  crew: any[];
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const reviewSectionRef = useRef<HTMLDivElement>(null);

  const isReleased = movie?.release_date
    ? new Date(movie.release_date) <= new Date()
    : false;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) {
        setError('Invalid movie ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const movieId = parseInt(id, 10);
        const [movieDetails, movieVideos, creditsResp, similarResp] =
          await Promise.all([
            api.getMovie(movieId),
            api.getMovieVideos(movieId),
            api.getMovieCredits(movieId),
            api.getSimilarMovies(movieId),
          ]);
        setMovie(movieDetails);
        setVideos(movieVideos.results);
        setCredits(creditsResp);
        setSimilarMovies(similarResp.results || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <main className="container py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-md mb-4"></div>
            <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <p className="text-muted-foreground">Could not retrieve movie details.</p>
          </div>
        </main>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path ? `${IMAGE_SIZES.backdrop.original}${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `${IMAGE_SIZES.poster.large}${movie.poster_path}` : null;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const director = credits?.crew?.find((c: any) => c.job === "Director")?.name ?? "Unknown";

  return (
    <div className="min-h-screen gradient-bg relative">
      <Header />
      {/* Cover Photo */}
      <div className="relative w-full h-[36vh] min-h-[220px] max-h-[320px] flex items-end overflow-hidden">
        {backdropUrl ? (
          <>
            <img
              src={backdropUrl}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
              style={{ filter: "brightness(0.8)" }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/80 to-[#141722]" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 text-gray-300 text-xl font-semibold">
            No Cover Available
          </div>
        )}
      </div>

      {/* Main Movie Card and Info Row */}
      <main className="container relative z-20 max-w-6xl px-4 md:px-6 -mt-24">
        <MovieHeader
          movie={movie}
          posterUrl={posterUrl}
          backdropUrl={backdropUrl}
          videos={videos}
          director={director}
          isReleased={isReleased}
          onWatchTrailer={() => setShowTrailer(true)}
          onWriteReview={() => {
            if (reviewSectionRef.current) {
              reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
          showTrailer={showTrailer}
          setShowTrailer={setShowTrailer}
          releaseYear={releaseYear}
        />
        {/* Move MovieRating above MovieInfoSection */}
        <div className="mb-2 flex items-center gap-3">
          <MovieRating movieId={movie.id} />
        </div>
        <MovieInfoSection
          overview={movie.overview}
          director={director}
          productionCompanies={movie.production_companies || []}
        />
      </main>

      {/* Trailer - detached as modal */}
      <TrailerDialog
        show={showTrailer && videos.length > 0}
        onClose={() => setShowTrailer(false)}
        videoKey={videos.length > 0 ? videos[0].key : ""}
      />

      {/* Cast Section */}
      <CastSection cast={credits?.cast || []} />

      {/* Similar movies */}
      <SimilarMoviesSection movies={similarMovies} />

      {/* Reviews section */}
      <section ref={reviewSectionRef} className="container max-w-3xl mx-0 my-12">
        <MovieReviews movieId={movie.id} />
        <MovieReviewAdminPanel movieId={movie.id} />
      </section>
    </div>
  );
};

export default MovieDetails;
