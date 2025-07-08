
import { useWatchedList } from '@/hooks/useWatchedList';
import { useTVSeriesWatchedList } from '@/hooks/useTVSeriesWatchedList';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Eye, Film, Tv, Calendar, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/AuthDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IMAGE_SIZES } from '@/services/api';

const WatchedList = () => {
  const { user } = useAuth();
  const { watchedList: movieWatchedList, loading: movieLoading, removeFromWatchedList: removeMovie } = useWatchedList();
  const { watchedList: tvWatchedList, loading: tvLoading, removeFromWatchedList: removeTVSeries } = useTVSeriesWatchedList();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container px-4 py-8">
        <div className="mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Eye className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold">My Watched List</h1>
          </div>

          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="movies" className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                Movies ({movieWatchedList.length})
              </TabsTrigger>
              <TabsTrigger value="tv" className="flex items-center gap-2">
                <Tv className="w-4 h-4" />
                TV Series ({tvWatchedList.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="movies" className="mt-6">
              {movieLoading && movieWatchedList.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
                    <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
                  </div>
                </div>
              ) : movieWatchedList.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold mb-2">Your watched movies list is empty</h2>
                  <p className="text-muted-foreground mb-6">
                    Start marking movies as watched to keep track of what you've seen
                  </p>
                  <Link to="/">
                    <Button>Browse Movies</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {movieWatchedList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/movie/${item.movie_id}`)}
                    >
                      <img
                        src={item.movie_poster_path
                          ? `${IMAGE_SIZES.poster.small}${item.movie_poster_path}`
                          : '/placeholder.svg'}
                        alt={item.movie_title}
                        className="w-16 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-movie-primary transition-colors">
                          {item.movie_title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMovie(item.movie_id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tv" className="mt-6">
              {tvLoading && tvWatchedList.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
                    <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
                  </div>
                </div>
              ) : tvWatchedList.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold mb-2">Your watched TV series list is empty</h2>
                  <p className="text-muted-foreground mb-6">
                    Start marking TV series as watched to keep track of what you've seen
                  </p>
                  <Link to="/">
                    <Button>Browse TV Series</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {tvWatchedList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/tv/${item.series_id}`)}
                    >
                      <img
                        src={item.series_poster_path
                          ? `${IMAGE_SIZES.poster.small}${item.series_poster_path}`
                          : '/placeholder.svg'}
                        alt={item.series_name}
                        className="w-16 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-movie-primary transition-colors">
                          {item.series_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTVSeries(item.series_id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
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
