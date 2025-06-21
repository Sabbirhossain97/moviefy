import Header from "@/components/Header";
import AIMovieSearch from "@/components/AIMovieSearch";
import { Brain, Sparkles } from "lucide-react";

const AIRecommendations = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-movie-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Movie Search
              </h1>
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-muted-foreground text-lg">
              Describe the perfect movie for your mood and let AI find it for you
            </p>
          </div>
          <AIMovieSearch />
        </div>
      </main>
    </div>
  );
};

export default AIRecommendations;
