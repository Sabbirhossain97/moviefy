
import { useEffect, useState } from "react";
import { api, Movie, TVSeries, Genre } from "@/services/api";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MovieSlider from "@/components/MovieSlider";
import TVSeriesSlider from "@/components/TVSeriesSlider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Video } from "lucide-react";

const Dashboard = () => {
  const today = new Date().toISOString().split('T')[0];
  const [trending, setTrending] = useState<Movie[]>([]);
  const [trendingTVSeries, setTrendingTVSeries] = useState<TVSeries[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTVSeries, setShowTVSeries] = useState(false);
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
      if (showTVSeries) {
        try {
          const trendingTVRes = await api.getTvPopular();
          setTrendingTVSeries(trendingTVRes.results);
        } catch (error) {
          console.error("Error fetching trending TV series:", error);
        }
      }
    };

    fetchTrendingTVSeries();
  }, [showTVSeries]);

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
      <main className="container py-6">
        <div className="space-y-8">
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="trending-switch"
              checked={showTVSeries}
              onCheckedChange={setShowTVSeries}
            />
            <Label htmlFor="trending-switch" className="text-lg font-semibold">
              {showTVSeries ? "Trending TV Series" : "Trending Movies"}
            </Label>
          </div>
          
          {showTVSeries ? (
            <TVSeriesSlider name="Trending TV Series" series={trendingTVSeries} />
          ) : (
            <MovieSlider title="Trending Now" movies={trending} />
          )}
          
          <Separator />
          <MovieSlider title="Popular Movies" movies={popular} />
          <Separator />
          <MovieSlider title="Top Rated" movies={topRated} />
          <Separator />
          <MovieSlider title="Upcoming Movies" movies={upcoming} />
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-movie-primary" />
            <span className="font-bold text-lg">Moviefy</span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            © {new Date().getFullYear()} Moviefy. All Rights Reserved. Data by{" "}
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

export default Dashboard;
