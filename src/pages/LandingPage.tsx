import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, Movie, Genre } from "@/services/api";
import Header from "@/components/Header";
import MovieSlider from "@/components/MovieSlider";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";
import { Brain, Heart, Search, Users, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Search className="w-8 h-8 text-movie-primary" />,
    title: "Explore Vast Library",
    description: "Dive into thousands of movies and TV shows. Your next favorite is just a click away.",
  },
  {
    icon: <Brain className="w-8 h-8 text-movie-primary" />,
    title: "AI-Powered Suggestions",
    description: "Our smart AI learns your taste to provide movie recommendations you'll actually love.",
  },
  {
    icon: <Heart className="w-8 h-8 text-movie-primary" />,
    title: "Curate Your Wishlist",
    description: "Never lose track of a movie you want to watch. Build and manage your personal wishlist.",
  },
  {
    icon: <Users className="w-8 h-8 text-movie-primary" />,
    title: "Join the Community",
    description: "Rate movies, write reviews, and see what fellow movie buffs are saying.",
  },
];

const LandingPage = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [trendingRes, genresRes] = await Promise.all([
          api.getTrending(),
          api.getGenres(),
        ]);
        setTrending(trendingRes.results);
        setGenres(genresRes.genres);
      } catch (error) {
        console.error("Error fetching landing page data:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading content. Please refresh the page.",
          variant: "destructive",
        });
      }
    };
    fetchLandingData();
  }, [toast]);

  return (
    <div className="bg-background text-foreground">
      <Header genres={genres} />
      <main>
        <section className="relative inset-0 bg-cover bg-left sm:bg-top [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] pt-24 pb-32 md:pt-32 md:pb-40 text-center bg-gradient-to-b from-background via-black/80 to-black"
          style={{ backgroundImage: `url(/moviefy-banner.png)` }}
        >
          <div className="container px-4 relative">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg animate-fade-up">
              Your Universe of Movies, Reimagined.
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Discover, track, and get personalized recommendations for films you'll love. Powered by AI.
            </p>
            <div className="flex justify-center items-center gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <AuthDialog>
                <Button size="lg" className="bg-movie-primary hover:bg-movie-primary/90 text-lg px-8 py-6">
                  Get Started
                </Button>
              </AuthDialog>
              <AuthDialog>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </AuthDialog>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container px-4 relative py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why You'll Love Moviefy</h2>
            <p className="text-muted-foreground mt-2">Everything you need for a perfect movie night.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center p-6 rounded-lg bg-muted/30 border border-border/50 animate-fade-up" style={{ animationDelay: `${0.2 * (index + 1)}s` }}>
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Movie Slider Section */}
        {trending.length > 0 && (
          <section className="container px-4 py-10">
            <MovieSlider title="Trending Now" movies={trending} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-movie-primary" />
            <span className="font-bold text-lg bg-gradient-to-r from-movie-primary to-yellow-500 bg-clip-text text-transparent">
              Moviefy <sup className="bg-gradient-to-r from-movie-primary to-yellow-500 bg-clip-text text-transparent">AI</sup>
            </span>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-4 md:mt-0">
            © {new Date().getFullYear()} Moviefy. All Rights Reserved. Data by{" "}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-movie-primary hover:underline">
              TMDb
            </a>.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm">Terms</Link>
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

