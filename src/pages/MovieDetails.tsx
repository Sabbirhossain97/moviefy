
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, Movie, MovieVideo, IMAGE_SIZES, Person } from '@/services/api';
import Header from '@/components/Header';
import { CalendarDays, PlayCircle, Film } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { WishlistButton } from '@/components/WishlistButton';
import MovieRating from "@/components/MovieRating";
import MovieReviews from "@/components/MovieReviews";
import MovieReviewAdminPanel from "@/components/MovieReviewAdminPanel";
import MovieReminderButton from "@/components/MovieReminderButton";
import MovieSlider from '@/components/MovieSlider';

// Add types for credits API response
interface CreditsResponse {
  cast: Person[];
  crew: Person[];
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

  // Cover images
  const backdropUrl = movie.backdrop_path ? `${IMAGE_SIZES.backdrop.original}${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}` : null;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";

  return (
    <div>
      <Header />
      {/* Stylish backdrop with fade-out at bottom */}
      <div className="relative h-64 md:h-96 w-full flex items-end justify-center">
        {backdropUrl ? (
          <>
            <img
              src={backdropUrl}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
              style={{ zIndex: 0 }}
            />
            {/* Fade mask */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#141722] pointer-events-none" style={{zIndex:1}} />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 text-gray-300 text-xl font-semibold">
            No Cover Available
          </div>
        )}
        {/* Poster card with wishlist overlay */}
        <div className="relative z-10 mt-24 md:mt-44 max-w-max" style={{marginBottom: '-48px'}}>
          {posterUrl ? (
            <div className="relative">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-32 md:w-52 rounded-lg shadow-lg border-4 border-white/10"
              />
              <div className="absolute top-2 right-2">
                <WishlistButton 
                  movie={movie}
                  size="icon"
                  variant="ghost"
                  showText={false}
                />
              </div>
            </div>
          ) : (
            <div className="w-32 md:w-52 h-44 md:h-72 bg-gray-700 rounded-md flex items-center justify-center">
              <Film className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>
      </div>

      <main className="container pt-8">
        <div className="md:flex md:gap-8 mb-4">
          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 text-sm">
              <Badge variant="secondary">{movie.status || 'Released'}</Badge>
              <span className="flex items-center text-gray-500">
                <CalendarDays className="inline-block w-4 h-4 mr-1" />
                {movie.release_date} ({releaseYear})
              </span>
              <span className="flex items-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.004 5.404.433c1.164.093 1.636 1.545.749 2.605l-4.117 3.529 1.254 5.26c.271 1.136-.964 2.033-1.96 1.425L12 18.354 8.627 21.235a1.049 1.049 0 01-1.96-1.425l1.254-5.26-4.117-3.529c-.887-1.06-.415-2.512.749-2.605l5.404-.433 2.082-5.003z"
                    clipRule="evenodd"
                  />
                </svg>
                {movie.vote_average} ({movie.vote_count} votes)
              </span>
            </div>
            {/* Actions */}
            <div className="flex gap-3 mb-4">
              <MovieReminderButton movieId={movie.id} releaseDate={movie.release_date} />
              <MovieRating movieId={movie.id} />
            </div>
            {/* Overview */}
            <p className="mb-5">{movie.overview}</p>
            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Link to={`/genre/${genre.id}`} key={genre.id}>
                      <Badge variant="secondary">{genre.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Trailers */}
            {videos.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Trailers</h4>
                <ScrollArea className="flex gap-4">
                  {videos.map((video) => (
                    <a
                      key={video.id}
                      href={`https://www.youtube.com/watch?v=${video.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-48 h-24 relative rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                        alt={video.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-50 hover:opacity-70 transition-opacity duration-200 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white" />
                      </div>
                    </a>
                  ))}
                </ScrollArea>
              </div>
            )}
            {/* Cast Section */}
            {credits?.cast && credits.cast.length > 0 && (
              <div className="mb-8">
                <h4 className="font-semibold mb-3">Cast</h4>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
                  {credits.cast.slice(0, 15).map((person) => (
                    <div
                      key={person.id}
                      className="flex flex-col items-center w-24"
                      title={person.name}
                    >
                      {person.profile_path ? (
                        <img
                          src={`${IMAGE_SIZES.profile.small}${person.profile_path}`}
                          alt={person.name}
                          className="w-16 h-16 rounded-full object-cover mb-1 border-2 border-white/20"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-full mb-1 flex items-center justify-center text-xs text-gray-400">N/A</div>
                      )}
                      <span className="truncate text-xs text-center">{person.name}</span>
                      <span className="truncate text-[11px] text-muted-foreground">{person.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Similar Movies */}
            {similarMovies.length > 0 && (
              <div className="mb-10">
                <h4 className="font-semibold mb-3">Similar Movies</h4>
                <MovieSlider title="Similar Movies" movies={similarMovies.slice(0, 10)} />
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="my-8 md:my-12 max-w-3xl mx-auto">
          <MovieReviews movieId={movie.id} />
          <MovieReviewAdminPanel movieId={movie.id} />
        </div>
      </main>
    </div>
  );
};
export default MovieDetails;
