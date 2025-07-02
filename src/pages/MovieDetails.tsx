import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api, Movie, MovieVideo, IMAGE_SIZES, Cast } from '@/services/api';
import Header from '@/components/Header';
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import Backdrop from "@/components/common/Backdrop";
import MovieDetailsHeader from "@/components/movie-details/MovieDetailsHeader";
import { CastSection } from "@/components/common/CastSection";
import { SimilarMoviesSection } from "@/components/movie-details/SimilarMoviesSection";
import { TrailerDialog } from "@/components/common/TrailerDialog";

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
        <Footer />
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
        <Footer />
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
        <Footer />
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path ? `${IMAGE_SIZES.backdrop.original}${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `${IMAGE_SIZES.poster.large}${movie.poster_path}` : null;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const director = credits?.crew?.find((c: any) => c.job === "Director")?.name ?? "Unknown";

  return (
    <>
      <Header />
      <div className="min-h-screen overflow-hidden gradient-bg relative">
        <Backdrop backdropUrl={backdropUrl} title={movie.title} />
        <main className="container relative z-20 max-w-6xl px-4 -mt-48">
          <MovieDetailsHeader
            movie={movie}
            posterUrl={posterUrl}
            isReleased={isReleased}
            videos={videos}
            onPlayTrailer={() => setShowTrailer(true)}
            onWriteReview={() => {
              if (reviewSectionRef.current) {
                reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }}
            releaseYear={releaseYear}
            director={director}
          />
        </main>

        <TrailerDialog
          show={showTrailer && videos.length > 0}
          onClose={() => setShowTrailer(false)}
          videoKey={videos.length > 0 ? videos[0].key : ""}
        />

        <CastSection cast={credits?.cast || []} />

        <SimilarMoviesSection movies={similarMovies} />

        <section
          ref={reviewSectionRef}
          className="container relative z-20 px-4 my-12"
        >
          <Reviews id={movie.id} type='movie' />
        </section>

        <Footer />
      </div>
    </>
  );
};

export default MovieDetails;
