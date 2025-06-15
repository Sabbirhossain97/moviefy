
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, Movie, MovieVideo, IMAGE_SIZES, Cast } from '@/services/api';
import Header from '@/components/Header';
import { CalendarDays, PlayCircle, Film } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { WishlistButton } from '@/components/WishlistButton';
import MovieRating from "@/components/MovieRating";
import MovieReviews from "@/components/MovieReviews";
import MovieReviewAdminPanel from "@/components/MovieReviewAdminPanel";
import MovieReminderButton from "@/components/MovieReminderButton";
import MovieSlider from '@/components/MovieSlider';

interface CreditsResponse {
  cast: Cast[];
  crew: any[]; // Not used here
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const [movieDetails, movieVideos, creditsResp, similarResp] = await Promise.all([
          api.getMovie(movieId),
          api.getMovieVideos(movieId),
          api.getMovieCredits(movieId),
          api.getSimilarMovies(movieId)
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

  return (
    <div className="min-h-screen gradient-bg relative">
      <Header />
      {/* Backdrop and fade mask */}
      <div className="relative w-full h-[380px] md:h-[450px] flex items-end justify-center overflow-hidden">
        {backdropUrl ? (
          <>
            <img
              src={backdropUrl}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
            />
            {/* Bottom fade */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/65 to-[#141722]" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 text-gray-300 text-xl font-semibold">
            No Cover Available
          </div>
        )}
        {/* Poster and heart overlay */}
        <div className="relative z-20 mt-32 md:mt-40 ml-6 md:ml-12" style={{marginBottom: '-90px'}}>
          {posterUrl ? (
            <div className="relative group">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-36 md:w-56 rounded-lg shadow-lg border-4 border-white/10"
              />
              {/* Wishlist heart overlay */}
              <div className="absolute -top-2 -right-2 md:top-2 md:right-2 drop-shadow-md">
                <WishlistButton 
                  movie={movie}
                  size="icon"
                  variant="ghost"
                  showText={false}
                />
              </div>
            </div>
          ) : (
            <div className="w-36 md:w-56 h-56 bg-gray-700 rounded-md flex items-center justify-center">
              <Film className="w-12 h-12 text-gray-600" />
            </div>
          )}
        </div>
      </div>

      {/* Main info and meta */}
      <main className="container relative z-20 max-w-6xl px-4 md:px-6 mt-4 md:mt-12 flex flex-col md:flex-row gap-8">
        {/* Left: poster already shown above, empty for spacing on large screens */}
        <div className="hidden md:block w-[200px] shrink-0" />
        {/* Main detail block */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title} <span className="text-gray-400 font-light text-2xl">({releaseYear})</span></h1>
          {movie.tagline && (
            <div className="italic text-md text-gray-300 mb-2">{movie.tagline}</div>
          )}
          {/* Meta badges/row */}
          <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
            {movie.genres && movie.genres.map((genre) => (
              <span key={genre.id} className="mr-1">
                <Badge variant="secondary">{genre.name}</Badge>
              </span>
            ))}
            <span className="flex items-center text-gray-400">
              <CalendarDays className="inline-block w-4 h-4 mr-1" />
              {movie.release_date}
            </span>
            {movie.runtime && (
              <span className="text-gray-400">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
            )}
            {movie.status && (
              <Badge variant="secondary">{movie.status}</Badge>
            )}
          </div>
          {/* Vote, reminder, rating */}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <span className="flex items-center text-yellow-400 font-medium text-lg">
              <svg
                className="inline w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
              {movie.vote_average?.toFixed(1)}/10
            </span>
            <MovieReminderButton movieId={movie.id} releaseDate={movie.release_date} />
            <MovieRating movieId={movie.id} />
          </div>
          {/* Watch trailer button */}
          {videos.length > 0 && (
            <div className="mb-3">
              <a
                href={`https://www.youtube.com/watch?v=${videos[0].key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-red-600 hover:bg-red-700 text-white rounded px-5 py-2 transition-all font-semibold flex items-center gap-2 shadow-md">
                  <PlayCircle className="w-5 h-5" /> Watch Trailer
                </button>
              </a>
            </div>
          )}
          {/* Overview */}
          <div className="mt-6 mb-2">
            <h2 className="text-xl font-bold mb-1">Overview</h2>
            <p className="text-gray-300">{movie.overview}</p>
          </div>
          {/* More info (director, budget, etc) */}
          {(movie.production_companies || movie.budget || movie.revenue) && (
            <div className="mt-4 mb-3 flex flex-wrap gap-x-16 gap-y-2 text-sm text-gray-400">
              {movie.production_companies && movie.production_companies.length > 0 &&
                <span>
                  <span className="font-medium text-white">Production:</span> {movie.production_companies.map(pc => pc.name).join(', ')}
                </span>
              }
              {movie.budget ? (
                <span>
                  <span className="font-medium text-white">Budget:</span> ${movie.budget.toLocaleString()}
                </span>
              ) : null}
              {movie.revenue ? (
                <span>
                  <span className="font-medium text-white">Revenue:</span> ${movie.revenue.toLocaleString()}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </main>

      {/* Cast section */}
      {credits?.cast && credits.cast.length > 0 && (
        <section className="container mt-10 mb-2">
          <h2 className="text-2xl font-semibold mb-2">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {credits.cast.slice(0, 10).map(person => (
              <div key={person.id} className="flex flex-col items-center">
                {person.profile_path ? (
                  <img
                    src={`${IMAGE_SIZES.profile.medium}${person.profile_path}`}
                    alt={person.name}
                    className="w-20 h-20 rounded-full object-cover border-[3px] border-white/15 shadow mb-2"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-2 text-gray-400">N/A</div>
                )}
                <span className="text-sm font-semibold text-center">{person.name}</span>
                <span className="text-xs text-gray-400 text-center">{person.character}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar movies */}
      {similarMovies.length > 0 && (
        <section className="container mt-6 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Similar Movies</h2>
          <MovieSlider title="Similar Movies" movies={similarMovies.slice(0, 10)} />
        </section>
      )}

      {/* Reviews section */}
      <section className="container max-w-3xl mx-auto my-12">
        <MovieReviews movieId={movie.id} />
        <MovieReviewAdminPanel movieId={movie.id} />
      </section>
    </div>
  );
};

export default MovieDetails;
