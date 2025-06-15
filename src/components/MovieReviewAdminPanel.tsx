
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminReviewsTable from "@/components/AdminReviewsTable";

export default function MovieReviewAdminPanel({ movieId }: { movieId: number }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  // now the panel just points admins to the dashboard for all-reviews view
  return (
    <div className="mt-4 text-muted-foreground text-sm">
      Admins can manage all reviews & ratings in the Admin Dashboard.
    </div>
  );
}
