
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Search } from "lucide-react";
import { geminiAI } from "@/services/geminiAI";
import { api, Movie } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import MovieSlider from "./MovieSlider";

const AIMovieSearch = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [reasoning, setReasoning] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    try {
      // Get AI recommendations
      const aiResponse = await geminiAI.getMovieRecommendations({
        userInput: userInput.trim()
      });

      // Search for each recommended movie
      const moviePromises = aiResponse.recommendations.map(async (title) => {
        try {
          const searchResult = await api.searchMovies(title, 1);
          return searchResult.results[0]; // Get the first match
        } catch (error) {
          console.error(`Error searching for movie: ${title}`, error);
          return null;
        }
      });

      const movies = await Promise.all(moviePromises);
      const validMovies = movies.filter(movie => movie !== null) as Movie[];

      setRecommendations(validMovies);
      setReasoning(aiResponse.reasoning);

      toast({
        title: "AI Recommendations Ready!",
        description: `Found ${validMovies.length} movies based on your preferences.`,
      });
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      toast({
        title: "Error getting recommendations",
        description: "There was a problem getting AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">AI Movie Recommendations</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="movie-description" className="block text-sm font-medium mb-2">
              Describe what kind of movie you want to watch:
            </label>
            <Textarea
              id="movie-description"
              placeholder="e.g., I want a romantic comedy with a happy ending, or a sci-fi thriller with time travel, or something like Inception but lighter..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !userInput.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting AI Recommendations...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </form>
      </Card>

      {reasoning && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Why these movies?</h3>
          <p className="text-muted-foreground">{reasoning}</p>
        </Card>
      )}

      {recommendations.length > 0 && (
        <MovieSlider 
          title="AI Recommended Movies"
          movies={recommendations}
        />
      )}
    </div>
  );
};

export default AIMovieSearch;
