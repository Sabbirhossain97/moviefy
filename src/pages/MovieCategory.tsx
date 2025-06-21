import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, Movie } from "@/services/api";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type CategoryType = "popular" | "top-rated" | "upcoming";

const categoryMap = {
  "popular": {
    title: "Popular Movies",
    apiCall: api.getPopular,
  },
  "top-rated": {
    title: "Top Rated Movies",
    apiCall: api.getTopRated,
  },
  "upcoming": {
    title: "Upcoming Movies",
    apiCall: api.getUpcoming,
  },
};

const MovieCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  const categoryType = (category || "popular") as CategoryType;
  const categoryInfo = categoryMap[categoryType] || categoryMap.popular;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await categoryInfo.apiCall(1);
        setMovies(response.results);
        setTotalPages(response.total_pages);
        setPage(1);
      } catch (error) {
        console.error(`Error fetching ${categoryType} movies:`, error);
        toast({
          title: "Error loading movies",
          description: "There was a problem loading movies. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [categoryType, toast]);

  const loadMore = async () => {
    if (page >= totalPages) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await categoryInfo.apiCall(nextPage);
      setMovies(prev => [...prev, ...response.results]);
      setPage(nextPage);
    } catch (error) {
      console.error(`Error loading more ${categoryType} movies:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && movies.length === 0) {
    return (
      <>
        <Header />
        <main className="container py-8 px-4">
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
              <p className="text-muted-foreground">Loading movies...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">
          {categoryInfo.title}
        </h1>

        {movies.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">No movies found</h2>
            <p className="text-muted-foreground">
              We couldn't find any movies in this category.
              Try browsing our other categories.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map(movie => (
                <div key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  className="min-w-[150px]"
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default MovieCategory;
