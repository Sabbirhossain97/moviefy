
import { useState } from 'react';
import { useWatchedList } from '@/hooks/useWatchedList';
import { useTVSeriesWatchedList } from '@/hooks/useTVSeriesWatchedList';
import { useFavoriteMovies } from '@/hooks/useFavoriteMovies';
import { useFavoriteTVSeries } from '@/hooks/useFavoriteTVSeries';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Eye, Film, Tv, Calendar, Star, Heart, List, Grid3x3, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/AuthDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IMAGE_SIZES } from '@/services/api';

const WatchedList = () => {
  const { user } = useAuth();
  const { watchedList: movieWatchedList, loading: movieLoading, removeFromWatchedList: removeMovie } = useWatchedList();
  const { watchedList: tvWatchedList, loading: tvLoading, removeFromWatchedList: removeTVSeries } = useTVSeriesWatchedList();
  const { addToFavorites: addMovieToFavorites, removeFromFavorites: removeMovieFromFavorites, isFavorite: isMovieFavorite } = useFavoriteMovies();
  const { addToFavorites: addTVToFavorites, removeFromFavorites: removeTVFromFavorites, isFavorite: isTVFavorite } = useFavoriteTVSeries();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [movieFilter, setMovieFilter] = useState<'all' | 'favorites'>('all');
  const [tvFilter, setTVFilter] = useState<'all' | 'favorites'>('all');

  const filteredMovies = movieWatchedList.filter(movie => 
    movieFilter === 'all' || isMovieFavorite(movie.movie_id)
  );

  const filteredTVSeries = tvWatchedList.filter(series => 
    tvFilter === 'all' || isTVFavorite(series.series_id)
  );

  const handleMovieFavoriteToggle = (item: any) => {
    const movieData = {
      id: item.movie_id,
      title: item.movie_title,
      poster_path: item.movie_poster_path,
      release_date: item.movie_release_date,
      vote_average: item.movie_vote_average,
      backdrop_path: null,
      overview: '',
      vote_count: 0,
      original_language: '',
    };

    if (isMovieFavorite(item.movie_id)) {
      removeMovieFromFavorites(item.movie_id);
    } else {
      addMovieToFavorites(movieData);
    }
  };

  const handleTVFavoriteToggle = (item: any) => {
    const tvData = {
      id: item.series_id,
      name: item.series_name,
      poster_path: item.series_poster_path,
      first_air_date: item.series_first_air_date,
      vote_average: item.series_vote_average,
      backdrop_path: null,
      overview: '',
      vote_count: 0,
      original_name: '',
      created_by: [],
      networks: [],
    };

    if (isTVFavorite(item.series_id)) {
      removeTVFromFavorites(item.series_id);
    } else {
      addTVToFavorites(tvData);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <main className="container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Your Watched List</h1>
            <p className="text-muted-foreground mb-6">
              Sign in to view and manage your watched movies and TV series
            </p>
            <AuthDialog>
              <Button size="lg">Sign In</Button>
            </AuthDialog>
          </div>
        </main>
      </div>
    );
  }

  const renderMovieItem = (item: any) => {
    const content = (
      <>
        <img
          src={item.movie_poster_path
            ? `${IMAGE_SIZES.poster.small}${item.movie_poster_path}`
            : '/placeholder.svg'}
          alt={item.movie_title}
          className={viewMode === 'grid' ? 'w-full h-48 object-cover rounded-md' : 'w-16 h-24 object-cover rounded-md'}
        />
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold group-hover:text-movie-primary transition-colors ${viewMode === 'grid' ? 'text-base mt-2' : 'text-lg mb-1'}`}>
            {item.movie_title}
          </h3>
          <div className={`flex items-center gap-4 text-sm text-muted-foreground ${viewMode === 'grid' ? 'flex-col items-start gap-1' : ''}`}>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {item.movie_release_date
                ? new Date(item.movie_release_date).getFullYear()
                : 'N/A'}
            </div>
            {item.movie_vote_average && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {item.movie_vote_average.toFixed(1)}
              </div>
            )}
          </div>
        </div>
        <div className={`flex gap-2 ${viewMode === 'grid' ? 'mt-2 justify-center' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleMovieFavoriteToggle(item);
            }}
          >
            <Heart className={`w-4 h-4 ${isMovieFavorite(item.movie_id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              removeMovie(item.movie_id);
            }}
          >
            Remove
          </Button>
        </div>
      </>
    );

    return (
      <div
        key={item.id}
        className={`${viewMode === 'grid' 
          ? 'p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 cursor-pointer group text-center' 
          : 'flex items-center gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 cursor-pointer group'
        }`}
        onClick={() => navigate(`/movie/${item.movie_id}`)}
      >
        {content}
      </div>
    );
  };

  const renderTVItem = (item: any) => {
    const content = (
      <>
        <img
          src={item.series_poster_path
            ? `${IMAGE_SIZES.poster.small}${item.series_poster_path}`
            : '/placeholder.svg'}
          alt={item.series_name}
          className={viewMode === 'grid' ? 'w-full h-48 object-cover rounded-md' : 'w-16 h-24 object-cover rounded-md'}
        />
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold group-hover:text-movie-primary transition-colors ${viewMode === 'grid' ? 'text-base mt-2' : 'text-lg mb-1'}`}>
            {item.series_name}
          </h3>
          <div className={`flex items-center gap-4 text-sm text-muted-foreground ${viewMode === 'grid' ? 'flex-col items-start gap-1' : ''}`}>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {item.series_first_air_date
                ? new Date(item.series_first_air_date).getFullYear()
                : 'N/A'}
            </div>
            {item.series_vote_average && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {item.series_vote_average.toFixed(1)}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Watched on {new Date(item.watched_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className={`flex gap-2 ${viewMode === 'grid' ? 'mt-2 justify-center' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleTVFavoriteToggle(item);
            }}
          >
            <Heart className={`w-4 h-4 ${isTVFavorite(item.series_id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              removeTVSeries(item.series_id);
            }}
          >
            Remove
          </Button>
        </div>
      </>
    );

    return (
      <div
        key={item.id}
        className={`${viewMode === 'grid' 
          ? 'p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 cursor-pointer group text-center' 
          : 'flex items-center gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 cursor-pointer group'
        }`}
        onClick={() => navigate(`/tv/${item.series_id}`)}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container px-4 py-8">
        <div className="mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Eye className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold">My Watched List</h1>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>

          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="movies" className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                Movies ({filteredMovies.length})
              </TabsTrigger>
              <TabsTrigger value="tv" className="flex items-center gap-2">
                <Tv className="w-4 h-4" />
                TV Series ({filteredTVSeries.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="movies" className="mt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                <Select value={movieFilter} onValueChange={(value: 'all' | 'favorites') => setMovieFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter movies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Movies</SelectItem>
                    <SelectItem value="favorites">Favorites Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {movieLoading && filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
                    <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
                  </div>
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold mb-2">
                    {movieFilter === 'favorites' ? 'No favorite movies found' : 'Your watched movies list is empty'}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {movieFilter === 'favorites' 
                      ? 'Mark some of your watched movies as favorites to see them here'
                      : 'Start marking movies as watched to keep track of what you\'ve seen'
                    }
                  </p>
                  <Link to="/">
                    <Button>Browse Movies</Button>
                  </Link>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-4'}>
                  {filteredMovies.map(renderMovieItem)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tv" className="mt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                <Select value={tvFilter} onValueChange={(value: 'all' | 'favorites') => setTVFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter TV series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All TV Series</SelectItem>
                    <SelectItem value="favorites">Favorites Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tvLoading && filteredTVSeries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
                    <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
                  </div>
                </div>
              ) : filteredTVSeries.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold mb-2">
                    {tvFilter === 'favorites' ? 'No favorite TV series found' : 'Your watched TV series list is empty'}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {tvFilter === 'favorites' 
                      ? 'Mark some of your watched TV series as favorites to see them here'
                      : 'Start marking TV series as watched to keep track of what you\'ve seen'
                    }
                  </p>
                  <Link to="/">
                    <Button>Browse TV Series</Button>
                  </Link>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-4'}>
                  {filteredTVSeries.map(renderTVItem)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default WatchedList;
