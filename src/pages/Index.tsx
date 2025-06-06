
import React, { useEffect, useState } from "react";
import { api, Movie, Genre } from "@/services/api";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MovieSlider from "@/components/MovieSlider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [trendingRes, popularRes, topRatedRes, upcomingRes, genresRes] = await Promise.all([
          api.getTrending(),
          api.getPopular(),
          api.getTopRated(),
          api.getUpcoming(),
          api.getGenres(),
        ]);

        setTrending(trendingRes.results);
        setPopular(popularRes.results);
        setTopRated(topRatedRes.results);
        setUpcoming(upcomingRes.results);
        setGenres(genresRes.genres);
      } catch (error) {
        console.error("Error fetching data:", error);
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
  }, [toast]);

  // Feature movie is the first trending movie
  const featuredMovie = trending[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header genres={genres} />
      
      <main className="container py-6">
        {featuredMovie && <HeroBanner movie={featuredMovie} className="mb-8" />}
        
        <div className="space-y-8">
          <MovieSlider title="Trending Now" movies={trending} />
          <Separator />
          <MovieSlider title="Popular Movies" movies={popular} />
          <Separator />
          <MovieSlider title="Top Rated" movies={topRated} />
          <Separator />
          <MovieSlider title="Upcoming Movies" movies={upcoming} />
        </div>
      </main>
      
      <footer className="mt-12 py-6 border-t">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Movie data provided by{" "}
            <a 
              href="https://www.themoviedb.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-movie-primary hover:underline"
            >
              The Movie Database (TMDb)
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Index;
