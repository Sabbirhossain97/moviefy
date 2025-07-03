import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, Key } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "./ui/select";
import { geminiAI } from "@/services/geminiAI";
import { api, Movie, TVSeries } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserApiKeys } from "@/hooks/useUserApiKeys";
import { ApiKeyModal } from "./ApiKeyModal";
import MovieSlider from "./MovieSlider";
import TVSeriesSlider from "./TVSeriesSlider";

const AIMovieSearch = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<"movie" | "tv">("movie")
  const [movieRecommendations, setMovieRecommendations] = useState<Movie[]>([]);
  const [tvSeriesRecommendations, setTVSeriesRecommendations] = useState<TVSeries[]>([]);
  const [reasoning, setReasoning] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { geminiApiKey, loading: apiKeyLoading } = useUserApiKeys();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (!geminiApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setLoading(true);
    try {
      const aiResponse = await geminiAI.getRecommendations({
        userInput: userInput.trim(),
        type: searchType,
      });

      const contentPromises = aiResponse.recommendations.map(async (title) => {
        try {
          const searchResult =
            searchType === "tv"
              ? await api.searchTVSeries(title, 1)
              : await api.searchMovies(title, 1);

          const content = searchResult.results[0];
          return content || null;
        } catch (error) {
          console.error(`Error searching for ${searchType}: ${title}`, error);
          return null;
        }
      });

      const contentResults = await Promise.all(contentPromises);

      const validItems = contentResults.filter((item): item is Movie | TVSeries =>
        item != null &&
        typeof item === 'object' &&
        'id' in item &&
        (searchType === 'movie' ? 'title' in item : 'name' in item) &&
        typeof item.id === 'number'
      );

      if (searchType === 'movie') {
        const movieItems = validItems.filter((item): item is Movie => 'title' in item);
        setMovieRecommendations(movieItems);
        setTVSeriesRecommendations([]);
        setReasoning(aiResponse.reasoning);
      } else {
        const tvItems = validItems.filter((item): item is TVSeries => 'name' in item);
        setTVSeriesRecommendations(tvItems);
        setMovieRecommendations([]);
        setReasoning(aiResponse.reasoning);
      }

      toast({
        title: `AI ${searchType === 'tv' ? 'TV Series' : 'Movie'} Recommendations Ready!`,
        description: `Found ${validItems.length} ${searchType === 'tv' ? 'series' : 'movies'} based on your preferences.`,
      });
    } catch (error: any) {
      console.error("Error getting AI recommendations:", error);
      toast({
        title: "Error getting recommendations",
        description: error.message || "There was a problem getting AI recommendations. Please try again.",
        variant: "destructive",
      });

      if (error.message && error.message.includes('API key')) {
        setShowApiKeyModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMovieRecommendations([]);
    setTVSeriesRecommendations([]);
    setReasoning("");
  }, [searchType]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Sign In Required</h2>
        <p className="text-muted-foreground">
          Please sign in to use AI-powered movie and TV series recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <Select
              value={searchType}
              required
              onValueChange={(v) => setSearchType(v as 'movie' | 'tv')}
            >
              <SelectTrigger className="w-[150px] rounded-md">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Series</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center bg-input/50 gap-2"
              disabled={apiKeyLoading}
            >
              <Key className="h-4 w-4" />
              {geminiApiKey ? 'Manage API Key' : 'Add API Key'}
              {geminiApiKey && (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </Button>
          </div>

          <div>
            <Textarea
              id="movie-description"
              placeholder="e.g., I want a romantic comedy with a happy ending, or a sci-fi thriller with time travel, or something like Inception but lighter..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[100px] border outline-none gradient-card text-muted-foreground transition duration-300 focus:outline-none focus:border-red-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !userInput.trim() || !geminiApiKey}
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting AI Recommendations...
              </>
            ) : !geminiApiKey ? (
              <>
                <Key className="h-4 w-4 mr-2" />
                Add API Key to Search
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </form>

        {reasoning && (
          <div className="mt-6 gradient-card rounded-lg border border-border/50 shadow-lg p-4">
            <h3 className="font-semibold mb-2">Why these {searchType === 'movie' ? 'movies' : 'series'}?</h3>
            <p className="text-muted-foreground">{reasoning}</p>
          </div>
        )}
      </div>

      {searchType === 'movie' && movieRecommendations.length > 0 ? (
        <MovieSlider
          title="AI Recommended Movies"
          movies={movieRecommendations}
        />
      ) :
        searchType === 'tv' && tvSeriesRecommendations.length > 0 && (
          <TVSeriesSlider
            name="AI Recommended Series"
            series={tvSeriesRecommendations}
          />
        )}

      <ApiKeyModal
        open={showApiKeyModal}
        onOpenChange={setShowApiKeyModal}
      />
    </div>
  );
};

export default AIMovieSearch;
