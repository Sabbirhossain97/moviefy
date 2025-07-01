
import { useWishlist } from '@/hooks/useWishlist';
import { useTVSeriesWishlist } from '@/hooks/useTVSeriesWishlist';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Heart, Film, Tv } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/AuthDialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import WishlistMovieCard from '@/components/WishlistMovieCard';
import { useState } from 'react';
import { IMAGE_SIZES } from '@/services/api';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist: movieWishlist, loading: movieLoading, removeFromWishlist: removeMovie } = useWishlist();
  const { wishlist: tvWishlist, loading: tvLoading, removeFromWishlist: removeTVSeries } = useTVSeriesWishlist();
  const navigate = useNavigate();
  const [showTVSeries, setShowTVSeries] = useState(false);

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

  const currentWishlist = showTVSeries ? tvWishlist : movieWishlist;
  const currentLoading = showTVSeries ? tvLoading : movieLoading;

  // Show loading skeleton ONLY if wishlist is empty and loading.
  if (currentLoading && currentWishlist.length === 0) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
              <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Film className="w-5 h-5" />
              <Label htmlFor="wishlist-switch" className="text-lg font-semibold">
                Movies
              </Label>
            </div>
            <Switch
              id="wishlist-switch"
              checked={showTVSeries}
              onCheckedChange={setShowTVSeries}
            />
            <div className="flex items-center space-x-2">
              <Tv className="w-5 h-5" />
              <Label htmlFor="wishlist-switch" className="text-lg font-semibold">
                TV Series
              </Label>
            </div>
            <span className="text-muted-foreground">
              ({currentWishlist.length} {showTVSeries ? 'series' : 'movies'})
            </span>
            {currentLoading && currentWishlist.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground animate-pulse">
                (Refreshing...)
              </span>
            )}
          </div>

          {currentWishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding {showTVSeries ? 'TV series' : 'movies'} you want to watch to your wishlist
              </p>
              <Link to="/">
                <Button>Browse {showTVSeries ? 'TV Series' : 'Movies'}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {showTVSeries ? (
                tvWishlist.map((item) => (
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
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          removeTVSeries(item.series_id);
                        }}
                        className="rounded-full bg-white/70 hover:bg-red-100 p-2 text-red-600 shadow-xl"
                        title="Remove"
                      >
                        <Heart className="w-5 h-5 fill-red-500" />
                      </button>
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
                ))
              ) : (
                movieWishlist.map((item) => (
                  <WishlistMovieCard
                    key={item.id}
                    item={item}
                    onRemove={removeMovie}
                    onClick={(movieId) => navigate(`/movie/${movieId}`)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
