import { useEffect, useState } from "react";
import { api, Movie, TVSeries, Genre } from "@/services/api";
import Header from "@/components/common/Header";
import HeroBanner from "@/components/movies/HeroBanner";
import MovieSlider from "@/components/movies/MovieSlider";
import TVSeriesSlider from "@/components/tv-series/TVSeriesSlider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/common/Footer";

const Dashboard = () => {
  const today = new Date().toISOString().split('T')[0];
  const [trending, setTrending] = useState<Movie[]>([]);
  const [trendingTVSeries, setTrendingTVSeries] = useState<TVSeries[]>([]);
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
        setUpcoming(upcomingRes.results.filter(movie => movie.release_date > today));
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

  useEffect(() => {
    const fetchTrendingTVSeries = async () => {
      try {
        const trendingTVRes = await api.getTvPopular();
        setTrendingTVSeries(trendingTVRes.results);
      } catch (error) {
        console.error("Error fetching trending TV series:", error);
      }
    };

    fetchTrendingTVSeries();
  }, []);

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
      {featuredMovie && <HeroBanner movie={featuredMovie} className="mb-8" />}
      <main className="container px-4 py-6">
        <div className="space-y-8">
          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="movies">Trending Movies</TabsTrigger>
              <TabsTrigger value="tv">Trending TV Series</TabsTrigger>
            </TabsList>
            
            <TabsContent value="movies" className="mt-6">
              <MovieSlider title="Trending Movies" movies={trending} />
            </TabsContent>
            
            <TabsContent value="tv" className="mt-6">
              <TVSeriesSlider name="Trending TV Series" series={trendingTVSeries} />
            </TabsContent>
          </Tabs>
          
          <Separator />
          <MovieSlider title="Popular Movies" movies={popular} />
          <Separator />
          <MovieSlider title="Top Rated" movies={topRated} />
          <Separator />
          <MovieSlider title="Upcoming Movies" movies={upcoming} />
        </div>
      </main>
      <Footer/>
    </>
  );
};

export default Dashboard;
