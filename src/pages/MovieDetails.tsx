import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, Movie, Cast, Crew, MovieVideo, IMAGE_SIZES } from "@/services/api";
import Header from "@/components/Header";
import MovieSlider from "@/components/MovieSlider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Calendar, Clock, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { aiRecommendations } from "@/services/aiRecommendations";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [director, setDirector] = useState<Crew | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { toast } = useToast();

  const handleFeedback = async (liked: boolean) => {
    if (!movie) return;
    
    try {
      aiRecommendations.updatePreferences(
        movie.id,
        liked,
        movie.genres?.map(g => g.id) || movie.genre_ids || []
      );
      
      toast({
        title: liked ? "Added to preferences" : "Noted your dislike",
        description: `We'll ${liked ? 'recommend more' : 'avoid'} movies like "${movie.title}".`,
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error updating preferences",
        description: "There was a problem updating your preferences.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const movieId = parseInt(id);
        const [movieData, creditsData, similarData, videosData] = await Promise.all([
          api.getMovie(movieId),
          api.getMovieCredits(movieId),
          api.getSimilarMovies(movieId),
          api.getMovieVideos(movieId),
        ]);

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 10));
        
        // Find director
        const director = creditsData.crew.find(person => person.job === "Director");
        setDirector(director || null);
        
        setSimilarMovies(similarData.results);
        
        // Filter videos to get trailers
        const trailers = videosData.results.filter(
          video => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser")
        );
        setVideos(trailers);
        
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast({
          title: "Error loading movie details",
          description: "There was a problem loading this movie. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    // Scroll to top when movie changes
    window.scrollTo(0, 0);
  }, [id, toast]);

  // Format runtime to hours and minutes
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format revenue and budget
  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <p className="mb-6 text-muted-foreground">The movie you're looking for doesn't exist.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_SIZES.backdrop.original}${movie.backdrop_path}`
    : null;
  
  const posterUrl = movie.poster_path
    ? `${IMAGE_SIZES.poster.large}${movie.poster_path}`
    : "/placeholder.svg";

  // Get trailer
  const trailer = videos.length > 0 ? videos[0] : null;

  return (
    <>
      <Header />
      
      <main>
        {/* Backdrop header */}
        {backdropUrl && (
          <div 
            className="relative w-full h-[50vh] bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
        )}
        
        <div className="container relative -mt-28 z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="lg:w-1/3">
              <img 
                src={posterUrl} 
                alt={movie.title} 
                className="rounded-lg shadow-lg w-full max-w-[350px] mx-auto"
              />
            </div>
            
            {/* Details */}
            <div className="lg:w-2/3">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {movie.title} 
                  <span className="text-muted-foreground font-normal">
                    {movie.release_date && ` (${new Date(movie.release_date).getFullYear()})`}
                  </span>
                </h1>
                
                {movie.tagline && (
                  <p className="text-lg italic text-muted-foreground">{movie.tagline}</p>
                )}
                
                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map(genre => (
                    <Link key={genre.id} to={`/genre/${genre.id}`}>
                      <Badge variant="outline">{genre.name}</Badge>
                    </Link>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {movie.vote_average && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{movie.vote_average.toFixed(1)}/10</span>
                    </div>
                  )}
                  
                  {movie.release_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  
                  {movie.status && (
                    <div className="flex items-center gap-1">
                      <Film className="h-4 w-4" />
                      <span>{movie.status}</span>
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-4">
                  {trailer && (
                    <Button 
                      className="bg-movie-primary hover:bg-movie-primary/90"
                      onClick={() => setShowTrailer(true)}
                    >
                      Watch Trailer
                    </Button>
                  )}
                  
                  {/* Feedback buttons */}
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback(true)}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    I Like This
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback(false)}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Not For Me
                  </Button>
                </div>
                
                {/* Overview */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {movie.overview || "No overview available."}
                  </p>
                </div>
                
                {/* Director */}
                {director && (
                  <div>
                    <h3 className="text-lg font-semibold">Director</h3>
                    <p>{director.name}</p>
                  </div>
                )}
                
                {/* Budget & Revenue */}
                <div className="grid grid-cols-2 gap-4">
                  {movie.budget ? (
                    <div>
                      <h3 className="text-sm font-semibold">Budget</h3>
                      <p className="text-gray-300">{formatCurrency(movie.budget)}</p>
                    </div>
                  ) : null}
                  
                  {movie.revenue ? (
                    <div>
                      <h3 className="text-sm font-semibold">Revenue</h3>
                      <p className="text-gray-300">{formatCurrency(movie.revenue)}</p>
                    </div>
                  ) : null}
                </div>
                
                {/* Production companies */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Production</h3>
                    <div className="flex flex-wrap gap-4">
                      {movie.production_companies.map(company => (
                        <div key={company.id} className="text-sm">
                          {company.name}
                          {company.origin_country ? ` (${company.origin_country})` : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Cast section */}
          {cast.length > 0 && (
            <section className="my-12">
              <h2 className="text-2xl font-semibold mb-6">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.map(person => (
                  <div key={person.id} className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
                      {person.profile_path ? (
                        <img
                          src={`${IMAGE_SIZES.profile.medium}${person.profile_path}`}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-sm">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.character}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          <Separator className="my-8" />
          
          {/* Similar movies */}
          {similarMovies.length > 0 && (
            <MovieSlider title="Similar Movies" movies={similarMovies} className="my-12" />
          )}
        </div>
      </main>
      
      <footer className="mt-12 py-6 border-t">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Movie data provided by{" "}
            <a 
              href="https://www.themoviedb.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-movie-primary hover:underline"
            >
              The Movie Database (TMDb)
            </a>
          </p>
        </div>
      </footer>

      {/* Trailer Dialog */}
      {trailer && (
        <Dialog open={showTrailer} onOpenChange={setShowTrailer}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MovieDetails;
