
import { useWishlist } from '@/hooks/useWishlist';
import { useTVSeriesWishlist } from '@/hooks/useTVSeriesWishlist';
import { useWatchedList } from '@/hooks/useWatchedList';
import { useTVSeriesWatchedList } from '@/hooks/useTVSeriesWatchedList';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Heart, Film, Tv, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/AuthDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WishlistMovieCard from '@/components/WishlistMovieCard';
import { TVSeriesWatchedButton } from '@/components/TVSeriesWatchedButton';
import { IMAGE_SIZES } from '@/services/api';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist: movieWishlist, loading: movieLoading, removeFromWishlist: removeMovie } = useWishlist();
  const { wishlist: tvWishlist, loading: tvLoading, removeFromWishlist: removeTVSeries } = useTVSeriesWishlist();
  const { addToWatchedList: addMovieToWatched } = useWatchedList();
  const navigate = useNavigate();

  const handleMarkMovieAsWatched = (item: any) => {
    const movieData = {
      id: item.movie_id,
      title: item.movie_title,
      poster_path: item.movie_poster_path,
      release_date: item.movie_release_date,
      vote_average: item.movie_vote_average,
      overview: '',
      genre_ids: [],
      adult: false,
      backdrop_path: null,
      original_language: '',
      original_title: item.movie_title,
      popularity: 0,
      video: false,
      vote_count: 0
    };
    addMovieToWatched(movieData);
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <main className="container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
            <p className="text-muted-foreground mb-6">
              Sign in to view and manage your movie and TV series wishlist
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>

          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="movies" className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                Movies ({movieWishlist.length})
              </TabsTrigger>
              <TabsTrigger value="tv" className="flex items-center gap-2">
                <Tv className="w-4 h-4" />
                TV Series ({tvWishlist.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="movies" className="mt-6">
              {movieLoading && movieWishlist.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
                    <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
                  </div>
                </div>
              ) : movieWishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold mb-2">Your movie wishlist is empty</h2>
                  <p className="text-muted-foreground mb-6">
                    Start adding movies you want to watch to your wishlist
                  </p>
                  <Link to="/">
                    <Button>Browse Movies</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {movieWishlist.map((item) => (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all duration-200 bg-card/50"
                      onClick={() => navigate(`/movie/${item.movie_id}`)}
                    >
                      <img
                        src={item.movie_poster_path
                          ? `${IMAGE_SIZES.poster.medium}${item.movie_poster_path}`
                          : '/placeholder.svg'}
                        alt={item.movie_title}
                        className="object-cover w-full h-64"
                      />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            removeMovie(item.movie_id);
                          }}
                          className="rounded-full bg-white/70 hover:bg-red-100 p-2 text-red-600 shadow-xl"
                          title="Remove from wishlist"
                        >
                          <Heart className="w-5 h-5 fill-red-500" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleMarkMovieAsWatched(item);
                          }}
                          className="rounded-full bg-white/70 hover:bg-green-100 p-2 text-green-600 shadow-xl"
                          title="Mark as watched"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="font-semibold mb-1 line-clamp-2">{item.movie_title}</div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {item.movie_release_date
                            ? new Date(item.movie_release_date).getFullYear()
                            : 'N/A'}
                        </div>
                        {item.movie_vote_average !== null && (
                          <div className="text-xs text-yellow-500 font-medium">
                            {item.movie_vote_average.toFixed(1)} / 10
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tv" className="mt-6">
              {tvLoading && tvWishlist.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
                    <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
                  </div>
                </div>
              ) : tvWishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold mb-2">Your TV series wishlist is empty</h2>
                  <p className="text-muted-foreground mb-6">
                    Start adding TV series you want to watch to your wishlist
                  </p>
                  <Link to="/">
                    <Button>Browse TV Series</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tvWishlist.map((item) => (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all duration-200 bg-card/50"
                      onClick={() => navigate(`/tv/${item.series_id}`)}
                    >
                      <img
                        src={item.series_poster_path
                          ? `${IMAGE_SIZES.poster.medium}${item.series_poster_path}`
                          : '/placeholder.svg'}
                        alt={item.series_name}
                        className="object-cover w-full h-64"
                      />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            removeTVSeries(item.series_id);
                          }}
                          className="rounded-full bg-white/70 hover:bg-red-100 p-2 text-red-600 shadow-xl"
                          title="Remove from wishlist"
                        >
                          <Heart className="w-5 h-5 fill-red-500" />
                        </button>
                        <div onClick={e => e.stopPropagation()}>
                          <TVSeriesWatchedButton
                            series={{
                              id: item.series_id,
                              name: item.series_name,
                              poster_path: item.series_poster_path,
                              first_air_date: item.series_first_air_date,
                              vote_average: item.series_vote_average,
                              overview: '',
                              genre_ids: [],
                              adult: false,
                              backdrop_path: null,
                              origin_country: [],
                              original_language: '',
                              original_name: item.series_name,
                              popularity: 0,
                              vote_count: 0,
                              created_by: [],
                              networks: []
                            }}
                            size="icon"
                            variant="ghost"
                            showText={false}
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="font-semibold mb-1 line-clamp-2">{item.series_name}</div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {item.series_first_air_date
                            ? new Date(item.series_first_air_date).getFullYear()
                            : 'N/A'}
                        </div>
                        {item.series_vote_average !== null && (
                          <div className="text-xs text-yellow-500 font-medium">
                            {item.series_vote_average.toFixed(1)} / 10
                          </div>
                        )}
                      </div>
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

export default Wishlist;
