import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, Movie, TVSeries } from "@/services/api";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import TVCard from "@/components/TVCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const searchType = searchParams.get("searchType");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvSeries, setTvSeries] = useState<TVSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        if (searchType === "movie") {
          const response = await api.searchMovies(query, 1);
          setMovies(response.results);
          setTotalPages(response.total_pages);
          setPage(1);
        } else {
          const response = await api.searchTVSeries(query, 1);
          setTvSeries(response.results);
          setTotalPages(response.total_pages);
          setPage(1);
        }

      } catch (error) {
        console.error("Error searching movies:", error);
        toast({
          title: "Search failed",
          description: "There was a problem searching for movies. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, searchType, toast]);

  const loadMore = async () => {
    if (page >= totalPages) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      if (searchType === "movie") {
        const response = await api.searchMovies(query, nextPage);
        setMovies(prev => [...prev, ...response.results]);
        setPage(nextPage);
      } else {
        const response = await api.searchTVSeries(query, nextPage);
        setTvSeries(prev => [...prev, ...response.results]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">
          Search results for: <span className="text-movie-primary">"{query}"</span>
        </h1>
        {loading && ((searchType === "movie" && movies.length === 0) || (searchType === "tv" && tvSeries.length === 0)) ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
              <p className="text-muted-foreground">
                Searching {searchType === "movie" ? "movies" : "TV series"}...
              </p>
            </div>
          </div>
        ) : ((searchType === "movie" && movies.length === 0) || (searchType === "tv" && tvSeries.length === 0)) ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">
              No {searchType === "movie" ? "movies" : "TV series"} found
            </h2>
            <p className="text-muted-foreground">
              We couldn't find any {searchType === "movie" ? "movies" : "TV series"} matching your search.
              Try different keywords or browse our categories.
            </p>
          </div>
        ) : (
          <>
            <div className="grid [@media(max-width:400px)]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchType === "movie"
                ? movies.map((movie) => (
                  <div key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))
                : tvSeries.map((series) => (
                  <div key={series.id}>
                    <TVCard series={series} />
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

export default Search;
