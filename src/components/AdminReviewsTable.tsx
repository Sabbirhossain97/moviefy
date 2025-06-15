
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
      // Select all reviews and join movie title, user info, and ratings
      const { data, error } = await supabase.rpc("get_admin_review_table");
      // get_admin_review_table is a placeholder, user should implement it as a view or function
      if (!error && data) setRows(data);
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
