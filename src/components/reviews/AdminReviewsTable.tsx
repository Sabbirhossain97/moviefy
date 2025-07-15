
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";

interface MovieReviewRow {
  id: string;
  movie_title: string;
  movie_id: number;
  rating: number | null;
  review: string | null;
  user_name: string | null;
  created_at: string;
  type: 'movie';
}

interface TVReviewRow {
  id: string;
  series_name: string;
  series_id: number;
  rating: number | null;
  review: string | null;
  user_name: string | null;
  created_at: string;
  type: 'tv';
}

export default function AdminReviewsTable() {
  const [movieRows, setMovieRows] = useState<MovieReviewRow[]>([]);
  const [tvRows, setTvRows] = useState<TVReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMovieTitle = async (movieId: number): Promise<string> => {
    try {
      const movie = await api.getMovie(movieId);
      return movie.title;
    } catch (error) {
      console.error(`Error fetching movie ${movieId}:`, error);
      return `Movie ID: ${movieId}`;
    }
  };

  const fetchSeriesTitle = async (seriesId: number): Promise<string> => {
    try {
      const series = await api.getTvSeries(seriesId);
      return series.name;
    } catch (error) {
      console.error(`Error fetching series ${seriesId}:`, error);
      return `Series ID: ${seriesId}`;
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      
      try {
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

        // Process movie reviews
        if (!movieError && movieReviews) {
          const movieReviewsWithTitles = await Promise.all(
            movieReviews.map(async (r: any) => ({
              id: r.id,
              movie_title: await fetchMovieTitle(r.movie_id),
              movie_id: r.movie_id,
              rating: null,
              review: r.review,
              user_name: r.profiles?.full_name || "Unknown User",
              created_at: r.created_at,
              type: 'movie' as const,
            }))
          );
          setMovieRows(movieReviewsWithTitles);
        }

        // Process movie ratings
        if (!ratingError && movieRatings) {
          const movieRatingsWithTitles = await Promise.all(
            movieRatings.map(async (r: any) => ({
              id: `rating-${r.movie_id}-${r.user_id}`,
              movie_title: await fetchMovieTitle(r.movie_id),
              movie_id: r.movie_id,
              rating: r.rating,
              review: null,
              user_name: r.profiles?.full_name || "Unknown User",
              created_at: r.created_at,
              type: 'movie' as const,
            }))
          );
          setMovieRows(prev => [...prev, ...movieRatingsWithTitles].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ));
        }

        // Process TV reviews
        if (!tvError && tvReviews) {
          const tvReviewsWithTitles = await Promise.all(
            tvReviews.map(async (r: any) => ({
              id: r.id.toString(),
              series_name: await fetchSeriesTitle(r.series_id),
              series_id: r.series_id,
              rating: null,
              review: r.review,
              user_name: r.profiles?.full_name || "Unknown User",
              created_at: r.created_at,
              type: 'tv' as const,
            }))
          );
          setTvRows(tvReviewsWithTitles);
        }

        // Process TV ratings
        if (!tvRatingError && tvRatings) {
          const tvRatingsWithTitles = await Promise.all(
            tvRatings.map(async (r: any) => ({
              id: `tv-rating-${r.series_id}-${r.user_id}`,
              series_name: await fetchSeriesTitle(r.series_id),
              series_id: r.series_id,
              rating: r.rating,
              review: null,
              user_name: r.profiles?.full_name || "Unknown User",
              created_at: r.created_at,
              type: 'tv' as const,
            }))
          );
          setTvRows(prev => [...prev, ...tvRatingsWithTitles].sort((a, b) => 
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

  const handleViewMovie = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleViewSeries = (seriesId: number) => {
    navigate(`/tv/${seriesId}`);
  };

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
            <th className="px-2 py-2 text-left font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border-t whitespace-nowrap">
              <td className="px-2 py-1 max-w-[200px] truncate" title={row.movie_title}>
                {row.movie_title}
              </td>
              <td className="px-2 py-1">{row.user_name}</td>
              <td className="px-2 py-1">{row.rating ?? "-"}</td>
              <td className="px-2 py-1 max-w-[300px] truncate" title={row.review || "-"}>
                {row.review ?? "-"}
              </td>
              <td className="px-2 py-1">{new Date(row.created_at).toLocaleString()}</td>
              <td className="px-2 py-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleViewMovie(row.movie_id)}
                  className="h-6 w-6 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </td>
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
            <th className="px-2 py-2 text-left font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border-t whitespace-nowrap">
              <td className="px-2 py-1 max-w-[200px] truncate" title={row.series_name}>
                {row.series_name}
              </td>
              <td className="px-2 py-1">{row.user_name}</td>
              <td className="px-2 py-1">{row.rating ?? "-"}</td>
              <td className="px-2 py-1 max-w-[300px] truncate" title={row.review || "-"}>
                {row.review ?? "-"}
              </td>
              <td className="px-2 py-1">{new Date(row.created_at).toLocaleString()}</td>
              <td className="px-2 py-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleViewSeries(row.series_id)}
                  className="h-6 w-6 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </td>
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
