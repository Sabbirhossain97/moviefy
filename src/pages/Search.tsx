
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, Movie, TVSeries } from "@/services/api";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import TVCard from "@/components/TVCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const searchTypeFromUrl = searchParams.get("searchType") || "movie";
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvSeries, setTvSeries] = useState<TVSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        if (searchTypeFromUrl === "movie") {
          const response = await api.searchMovies(query, 1);
          setMovies(response.results);
          setTvSeries([]); // Clear TV series when searching movies
          setTotalPages(response.total_pages);
          setPage(1);
        } else {
          const response = await api.searchTVSeries(query, 1);
          setTvSeries(response.results);
          setMovies([]); // Clear movies when searching TV series
          setTotalPages(response.total_pages);
          setPage(1);
        }
      } catch (error) {
        console.error("Error searching:", error);
        toast({
          title: "Search failed",
          description: `There was a problem searching for ${searchTypeFromUrl === "movie" ? "movies" : "TV series"}. Please try again later.`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, searchTypeFromUrl, toast]);

  const loadMore = async () => {
    if (page >= totalPages) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      if (searchTypeFromUrl === "movie") {
        const response = await api.searchMovies(query, nextPage);
        setMovies(prev => [...prev, ...response.results]);
        setPage(nextPage);
      } else {
        const response = await api.searchTVSeries(query, nextPage);
        setTvSeries(prev => [...prev, ...response.results]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more results:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentResults = searchTypeFromUrl === "movie" ? movies : tvSeries;
  const isInitialLoading = loading && currentResults.length === 0;
  const hasNoResults = !loading && currentResults.length === 0 && query;

  return (
    <>
      <Header />
      <main className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">
          Search results for: <span className="text-movie-primary">"{query}"</span>
          <span className="text-lg font-normal text-muted-foreground ml-2">
            in {searchTypeFromUrl === "movie" ? "Movies" : "TV Series"}
          </span>
        </h1>
        
        {isInitialLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
              <p className="text-muted-foreground">
                Searching {searchTypeFromUrl === "movie" ? "movies" : "TV series"}...
              </p>
            </div>
          </div>
        ) : hasNoResults ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">
              No {searchTypeFromUrl === "movie" ? "movies" : "TV series"} found
            </h2>
            <p className="text-muted-foreground">
              We couldn't find any {searchTypeFromUrl === "movie" ? "movies" : "TV series"} matching your search.
              Try different keywords or browse our categories.
            </p>
          </div>
        ) : (
          <>
            <div className="grid [@media(max-width:400px)]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchTypeFromUrl === "movie"
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
      <Footer />
    </>
  );
};

export default Search;
