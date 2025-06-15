
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReviewRow {
  id: string;
  movie_title: string;
  rating: number | null;
  review: string | null;
  user_name: string | null;
  created_at: string;
}

export default function AdminReviewsTable() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      // Fetch all reviews with user and movie details, joining relevant tables
      const { data, error } = await supabase
        .from("movie_reviews")
        .select(`id, review, rating:movie_ratings(rating), created_at, movie_id, user_id,
          movie:movies(title), user:profiles(full_name)`)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Defensive map: ensure user_name, movie_title, rating are handled
        const mappedRows = (data as any[]).map((r: any) => ({
          id: r.id,
          movie_title: r.movie?.title || "Unknown",
          rating: Array.isArray(r.rating) ? (r.rating[0]?.rating ?? null) : r.rating ?? null,
          review: r.review,
          user_name: r.user?.full_name || "Unknown",
          created_at: r.created_at,
        }));
        setRows(mappedRows);
      } else {
        setRows([]); // Fallback, never boolean
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  if (loading) return <div>Loading reviews…</div>;
  if (rows.length === 0) return <div>No reviews found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs border border-muted">
        <thead>
          <tr className="bg-muted">
            <th className="px-2 py-2 text-left font-medium">Movie</th>
            <th className="px-2 py-2 text-left font-medium">User</th>
            <th className="px-2 py-2 text-left font-medium">Rating</th>
            <th className="px-2 py-2 text-left font-medium">Review</th>
            <th className="px-2 py-2 text-left font-medium">Posted At</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border-t">
              <td className="px-2 py-1">{row.movie_title}</td>
              <td className="px-2 py-1">{row.user_name}</td>
              <td className="px-2 py-1">{row.rating ?? "-"}</td>
              <td className="px-2 py-1">{row.review}</td>
              <td className="px-2 py-1">{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
