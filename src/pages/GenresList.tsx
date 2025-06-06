
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, Genre } from "@/services/api";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const GenresList = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await api.getGenres();
        setGenres(response.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
        toast({
          title: "Error loading genres",
          description: "There was a problem loading genre list. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [toast]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="container py-8">
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
              <p className="text-muted-foreground">Loading genres...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header genres={genres} />
      
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Movie Genres</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map(genre => (
            <Link key={genre.id} to={`/genre/${genre.id}`}>
              <Card className="bg-card h-24 flex items-center justify-center hover:bg-accent transition-colors duration-200">
                <h2 className="text-lg font-medium">{genre.name}</h2>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default GenresList;
