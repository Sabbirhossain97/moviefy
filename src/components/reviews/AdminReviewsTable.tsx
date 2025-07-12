
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MovieReviewRow {
  id: string;
  movie_title: string;
  rating: number | null;
  review: string | null;
  user_name: string | null;
  created_at: string;
  type: 'movie';
}

interface TVReviewRow {
  id: string;
  series_name: string;
  rating: number | null;
  review: string | null;
  user_name: string | null;
  created_at: string;
  type: 'tv';
}

type ReviewRow = MovieReviewRow | TVReviewRow;

export default function AdminReviewsTable() {
  const [movieRows, setMovieRows] = useState<MovieReviewRow[]>([]);
  const [tvRows, setTvRows] = useState<TVReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      
      try {
        // Fetch movie reviews and ratings
        const { data: movieReviews, error: movieError } = await supabase
          .from("movie_reviews")
          .select(`
            id, 
            review, 
            created_at, 
            movie_id, 
            user_id,
            profiles(full_name)
          `)
          .order("created_at", { ascending: false });

        const { data: movieRatings, error: ratingError } = await supabase
          .from("movie_ratings")
          .select(`
            movie_id,
            rating,
            user_id,
            created_at,
            profiles(full_name)
          `)
          .order("created_at", { ascending: false });

        // Fetch TV series reviews and ratings
        const { data: tvReviews, error: tvError } = await supabase
          .from("series_reviews")
          .select(`
            id,
            review,
            created_at,
            series_id,
            user_id,
            profiles(full_name)
          `)
          .order("created_at", { ascending: false });

        const { data: tvRatings, error: tvRatingError } = await supabase
          .from("series_ratings")
          .select(`
            series_id,
            rating,
            user_id,
            created_at,
            profiles(full_name)
          `)
          .order("created_at", { ascending: false });

        if (!movieError && movieReviews) {
          const mappedMovieRows = movieReviews.map((r: any) => ({
            id: r.id,
            movie_title: `ID: ${r.movie_id}`,
            rating: null,
            review: r.review,
            user_name: r.profiles?.full_name || "Unknown User",
            created_at: r.created_at,
            type: 'movie' as const,
          }));
          setMovieRows(mappedMovieRows);
        }

        if (!ratingError && movieRatings) {
          const mappedRatings = movieRatings.map((r: any) => ({
            id: `rating-${r.movie_id}-${r.user_id}`,
            movie_title: `ID: ${r.movie_id}`,
            rating: r.rating,
            review: null,
            user_name: r.profiles?.full_name || "Unknown User",
            created_at: r.created_at,
            type: 'movie' as const,
          }));
          setMovieRows(prev => [...prev, ...mappedRatings].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ));
        }

        if (!tvError && tvReviews) {
          const mappedTVRows = tvReviews.map((r: any) => ({
            id: r.id.toString(),
            series_name: `ID: ${r.series_id}`,
            rating: null,
            review: r.review,
            user_name: r.profiles?.full_name || "Unknown User",
            created_at: r.created_at,
            type: 'tv' as const,
          }));
          setTvRows(mappedTVRows);
        }

        if (!tvRatingError && tvRatings) {
          const mappedTVRatings = tvRatings.map((r: any) => ({
            id: `tv-rating-${r.series_id}-${r.user_id}`,
            series_name: `ID: ${r.series_id}`,
            rating: r.rating,
            review: null,
            user_name: r.profiles?.full_name || "Unknown User",
            created_at: r.created_at,
            type: 'tv' as const,
          }));
          setTvRows(prev => [...prev, ...mappedTVRatings].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ));
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  if (loading) return <div>Loading reviews and ratings…</div>;

  const MovieReviewsTable = ({ rows }: { rows: MovieReviewRow[] }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs border border-muted">
        <thead>
          <tr className="bg-muted whitespace-nowrap">
            <th className="px-2 py-2 text-left font-medium">Movie</th>
            <th className="px-2 py-2 text-left font-medium">User</th>
            <th className="px-2 py-2 text-left font-medium">Rating</th>
            <th className="px-2 py-2 text-left font-medium">Review</th>
            <th className="px-2 py-2 text-left font-medium">Posted At</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border-t whitespace-nowrap">
              <td className="px-2 py-1">{row.movie_title}</td>
              <td className="px-2 py-1">{row.user_name}</td>
              <td className="px-2 py-1">{row.rating ?? "-"}</td>
              <td className="px-2 py-1">{row.review ?? "-"}</td>
              <td className="px-2 py-1">{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const TVReviewsTable = ({ rows }: { rows: TVReviewRow[] }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs border border-muted">
        <thead>
          <tr className="bg-muted whitespace-nowrap">
            <th className="px-2 py-2 text-left font-medium">TV Series</th>
            <th className="px-2 py-2 text-left font-medium">User</th>
            <th className="px-2 py-2 text-left font-medium">Rating</th>
            <th className="px-2 py-2 text-left font-medium">Review</th>
            <th className="px-2 py-2 text-left font-medium">Posted At</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border-t whitespace-nowrap">
              <td className="px-2 py-1">{row.series_name}</td>
              <td className="px-2 py-1">{row.user_name}</td>
              <td className="px-2 py-1">{row.rating ?? "-"}</td>
              <td className="px-2 py-1">{row.review ?? "-"}</td>
              <td className="px-2 py-1">{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Tabs defaultValue="movies" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="movies">Movie</TabsTrigger>
        <TabsTrigger value="tv">TV Series</TabsTrigger>
      </TabsList>
      
      <TabsContent value="movies" className="mt-4">
        {movieRows.length === 0 ? (
          <div>No movie reviews or ratings found.</div>
        ) : (
          <MovieReviewsTable rows={movieRows} />
        )}
      </TabsContent>
      
      <TabsContent value="tv" className="mt-4">
        {tvRows.length === 0 ? (
          <div>No TV series reviews or ratings found.</div>
        ) : (
          <TVReviewsTable rows={tvRows} />
        )}
      </TabsContent>
    </Tabs>
  );
}
