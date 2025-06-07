
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import MovieSlider from "@/components/MovieSlider";
import AIMovieSearch from "@/components/AIMovieSearch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movie } from "@/services/api";
import { aiRecommendations, UserPreference } from "@/services/aiRecommendations";
import { useToast } from "@/hooks/use-toast";
import { Brain, Heart, ThumbsUp, ThumbsDown, Sparkles, MessageSquare } from "lucide-react";

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [moodRecommendations, setMoodRecommendations] = useState<Movie[]>([]);
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const moods = [
    { value: "happy", label: "Happy 😊", description: "Feel-good movies" },
    { value: "sad", label: "Sad 😢", description: "Emotional dramas" },
    { value: "excited", label: "Excited 🔥", description: "Action-packed adventures" },
    { value: "relaxed", label: "Relaxed 😌", description: "Calm and peaceful" },
    { value: "romantic", label: "Romantic 💕", description: "Love stories" },
    { value: "thrilled", label: "Thrilled 😱", description: "Suspenseful thrillers" },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userPrefs = aiRecommendations.loadPreferences();
        setPreferences(userPrefs);
        
        const recs = await aiRecommendations.generateRecommendations();
        setRecommendations(recs);
      } catch (error) {
        console.error("Error loading recommendations:", error);
        toast({
          title: "Error loading recommendations",
          description: "There was a problem loading your recommendations.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleMoodChange = async (mood: string) => {
    setSelectedMood(mood);
    try {
      const moodRecs = await aiRecommendations.getMoodRecommendations(mood);
      setMoodRecommendations(moodRecs);
    } catch (error) {
      console.error("Error loading mood recommendations:", error);
      toast({
        title: "Error loading mood recommendations",
        description: "There was a problem loading mood-based recommendations.",
        variant: "destructive",
      });
    }
  };

  const handleFeedback = async (movie: Movie, liked: boolean) => {
    try {
      aiRecommendations.updatePreferences(
        movie.id,
        liked,
        movie.genre_ids || []
      );
      
      const newRecs = await aiRecommendations.generateRecommendations();
      setRecommendations(newRecs);
      
      toast({
        title: liked ? "Added to preferences" : "Noted your dislike",
        description: `We'll ${liked ? 'recommend more' : 'avoid'} movies like "${movie.title}".`,
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error updating preferences",
        description: "There was a problem updating your preferences.",
        variant: "destructive",
      });
    }
  };

  const refreshRecommendations = async () => {
    try {
      setLoading(true);
      const newRecs = await aiRecommendations.generateRecommendations();
      setRecommendations(newRecs);
      toast({
        title: "Recommendations refreshed",
        description: "Got new movie recommendations just for you!",
      });
    } catch (error) {
      console.error("Error refreshing recommendations:", error);
      toast({
        title: "Error refreshing recommendations",
        description: "There was a problem getting new recommendations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container py-8">
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <Brain className="h-12 w-12 text-movie-primary mb-4" />
              <p className="text-muted-foreground">AI is analyzing your preferences...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="container py-8">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="h-8 w-8 text-movie-primary" />
          <h1 className="text-3xl font-bold">AI Movie Recommendations</h1>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>

        <Tabs defaultValue="ai-search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-search" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Search
            </TabsTrigger>
            <TabsTrigger value="smart-recommendations" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Smart Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-search">
            <AIMovieSearch />
          </TabsContent>

          <TabsContent value="smart-recommendations" className="space-y-8">
            {preferences && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Your Preferences
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-500">{preferences.likedMovies.length}</p>
                    <p className="text-sm text-muted-foreground">Liked Movies</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-500">{preferences.dislikedMovies.length}</p>
                    <p className="text-sm text-muted-foreground">Disliked Movies</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-500">{preferences.likedGenres.length}</p>
                    <p className="text-sm text-muted-foreground">Preferred Genres</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-500">{preferences.dislikedGenres.length}</p>
                    <p className="text-sm text-muted-foreground">Avoided Genres</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">What's Your Mood?</h2>
              <Select value={selectedMood} onValueChange={handleMoodChange}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select your current mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <div>
                        <div className="font-medium">{mood.label}</div>
                        <div className="text-sm text-muted-foreground">{mood.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {moodRecommendations.length > 0 && (
              <>
                <MovieSlider 
                  title={`Movies for your ${selectedMood} mood`} 
                  movies={moodRecommendations}
                  renderActions={(movie) => (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFeedback(movie, true)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Like
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFeedback(movie, false)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsDown className="h-3 w-3" />
                        Dislike
                      </Button>
                    </div>
                  )}
                />
                <Separator />
              </>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recommendations For You</h2>
              <Button onClick={refreshRecommendations} variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {recommendations.length > 0 ? (
              <MovieSlider 
                title="" 
                movies={recommendations}
                renderActions={(movie) => (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFeedback(movie, true)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      Like
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFeedback(movie, false)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      Dislike
                    </Button>
                  </div>
                )}
              />
            ) : (
              <Card className="p-8 text-center">
                <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Start Building Your Profile</h3>
                <p className="text-muted-foreground mb-4">
                  Like or dislike some movies to get personalized recommendations!
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Explore Movies
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
};

export default AIRecommendations;
