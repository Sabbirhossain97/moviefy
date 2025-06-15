import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, Movie, MovieVideo, IMAGE_SIZES } from '@/services/api';
import Header from '@/components/Header';
import { CalendarDays, PlayCircle, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { WishlistButton } from '@/components/WishlistButton';
import MovieRating from "@/components/MovieRating";
import MovieReviews from "@/components/MovieReviews";
import MovieReviewAdminPanel from "@/components/MovieReviewAdminPanel";
import MovieReminderButton from "@/components/MovieReminderButton";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
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
        const movieDetails = await api.getMovie(movieId);
        const movieVideos = await api.getMovieVideos(movieId);

        setMovie(movieDetails);
        setVideos(movieVideos.results);
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
  const posterUrl = movie.poster_path ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}` : null;
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div>
      <Header />
      {backdropUrl ? (
        <div className="relative">
          <div
            className="h-64 md:h-96 w-full object-cover object-center"
            style={{
              backgroundImage: `url('${backdropUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
      ) : (
        <div className="h-64 md:h-96 w-full bg-gray-800"></div>
      )}

      <main className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} className="w-full rounded-md shadow-md" />
            ) : (
              <div className="w-full h-64 bg-gray-700 rounded-md flex items-center justify-center">
                <Film className="w-16 h-16 text-gray-500" />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">{movie.status || 'Released'}</Badge>
              <span className="text-gray-500">
                <CalendarDays className="inline-block w-4 h-4 mr-1" />
                {movie.release_date} ({releaseYear})
              </span>
              <span className="text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 inline-block mr-1"
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

            {/* Insert below movie title/metadata */}
            <MovieRating movieId={movie.id} />
            <MovieReminderButton movieId={movie.id} releaseDate={movie.release_date} />

            {/* Reviews */}
            <div className="my-8">
              <MovieReviews movieId={movie.id} />
              <MovieReviewAdminPanel movieId={movie.id} />
            </div>

            <p className="mb-4">{movie.overview}</p>

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
            <WishlistButton movie={movie} />
          </div>
        </div>
      </main>
    </div>
  );
};
export default MovieDetails;
