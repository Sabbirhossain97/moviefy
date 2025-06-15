import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/AuthDialog';
import WishlistMovieCard from '@/components/WishlistMovieCard';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist, loading, removeFromWishlist } = useWishlist();
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
              Sign in to view and manage your movie wishlist
            </p>
            <AuthDialog>
              <Button size="lg">Sign In</Button>
            </AuthDialog>
          </div>
        </main>
      </div>
    );
  }

  // Show loading skeleton ONLY if wishlist is empty and loading.
  if (loading && wishlist.length === 0) {
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
            <span className="text-muted-foreground">
              ({wishlist.length} movies)
            </span>
            {loading && wishlist.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground animate-pulse">
                (Refreshing...)
              </span>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding movies you want to watch to your wishlist
              </p>
              <Link to="/">
                <Button>Browse Movies</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <WishlistMovieCard
                  key={item.id}
                  item={item}
                  onRemove={removeFromWishlist}
                  onClick={(movieId) => navigate(`/movie/${movieId}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
