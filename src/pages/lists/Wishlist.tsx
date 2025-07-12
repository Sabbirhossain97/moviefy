import { useWishlist } from '@/hooks/useWishlist';
import { useTVSeriesWishlist } from '@/hooks/useTVSeriesWishlist';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import { Heart, Film, Tv } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WishlistMovieCard from '@/components/movies/WishlistMovieCard';
import WishlistTVCard from '@/components/tv-series/WishlistTVCard';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist: movieWishlist, loading: movieLoading, removeFromWishlist: removeMovie } = useWishlist();
  const { wishlist: tvWishlist, loading: tvLoading, removeFromWishlist: removeTVSeries } = useTVSeriesWishlist();
  const navigate = useNavigate();

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
        <div className="mx-auto">
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
                <div className="grid [@media(max-width:450px)]:grid-cols-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {movieWishlist.map((item) => (
                    <WishlistMovieCard
                      key={item.id}
                      item={item}
                      onRemove={removeMovie}
                      onClick={(movieId) => navigate(`/movie/${movieId}`)}
                    />
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
                <div className="grid [@media(max-width:450px)]:grid-cols-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {tvWishlist.map((item) => (
                    <WishlistTVCard
                      key={item.id}
                      item={item}
                      onRemove={removeTVSeries}
                      onClick={(movieId) => navigate(`/tv-series/${movieId}`)}
                    />
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
