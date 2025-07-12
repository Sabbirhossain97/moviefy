import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, Movie } from "@/services/api";
import Header from "@/components/common/Header";
import MovieCard from "@/components/movies/MovieCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/common/Footer";
import YearFilter from "@/components/common/YearFilter";

type CategoryType = "trending-now" | "popular" | "top-rated" | "upcoming";

const categoryMap: Record<CategoryType, {
  title: string;
  apiCall: (page: number) => Promise<{ results: Movie[]; total_pages: number }>;
}> = {
  "trending-now": {
    title: "Trending Now",
    apiCall: (page: number) => api.getTrending("week").then(res => ({
      results: res.results,
      total_pages: res.total_pages,
    })),
  },
  "popular": {
    title: "Popular Movies",
    apiCall: (page: number) => api.getPopular(page),
  },
  "top-rated": {
    title: "Top Rated Movies",
    apiCall: (page: number) => api.getTopRated(page),
  },
  "upcoming": {
    title: "Upcoming Movies",
    apiCall: (page: number) => api.getUpcoming(page),
  },
};

const MovieCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const { toast } = useToast();
  const categoryType = (category || "trending-now") as CategoryType;
  const categoryInfo = categoryMap[categoryType] || categoryMap.popular;
  const canFilterByYear = categoryType !== "trending-now";

  useEffect(() => {
    if (!selectedYear) {
      setFilteredMovies(allMovies);
      return;
    }

    const filtered = allMovies.filter(movie => {
      if (!movie.release_date) return false;
      const movieYear = new Date(movie.release_date).getFullYear();
      return movieYear === selectedYear;
    });
    setFilteredMovies(filtered);
  }, [allMovies, selectedYear]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await categoryInfo.apiCall(1);
        setAllMovies(response.results);
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
    setSelectedYear(undefined); 
  }, [categoryType, toast]);

  const loadMore = async () => {
    if (page >= totalPages) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await categoryInfo.apiCall(nextPage);
      setAllMovies(prev => [...prev, ...response.results]);
      setPage(nextPage);
    } catch (error) {
      console.error(`Error loading more ${categoryType} movies:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && allMovies.length === 0) {
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

  const moviesToShow = filteredMovies;

  return (
    <>
      <Header />
      <main className="container py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {categoryInfo.title}
            {selectedYear && ` (${selectedYear})`}
          </h1>
          {canFilterByYear && (
            <YearFilter
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          )}
        </div>

        {moviesToShow.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">No movies found</h2>
            <p className="text-muted-foreground">
              {selectedYear
                ? `We couldn't find any movies from ${selectedYear} in this category.`
                : "We couldn't find any movies in this category."
              }
              Try browsing our other categories or different years.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {moviesToShow.map(movie => (
                <div key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {!selectedYear && page < totalPages && (
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
      <Footer />
    </>
  );
};

export default MovieCategory;
