
import React from "react";
import ReviewCard from "./ReviewCard";

interface ReviewListProps {
  reviews: any[];
  user: any;
  editingReviewId: string | null;
  editingInput: string;
  setEditingReviewId: (id: string | null) => void;
  setEditingInput: (val: string) => void;
  loading: boolean;
  onEditSubmit: (r: any) => void;
  onStartEdit: (r: any) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  user,
  editingReviewId,
  editingInput,
  setEditingReviewId,
  setEditingInput,
  loading,
  onEditSubmit,
  onStartEdit,
  onCancelEdit,
  onDelete,
}) => (
  <ul className="space-y-5 mb-4" data-testid="review-list">
    {(!reviews || reviews.length === 0) && (
      <div className="text-muted-foreground text-sm mb-4 py-6 text-center border rounded-lg bg-card/80">
        No reviews yet. Be the first to review!
      </div>
    )}
    {reviews.map((r) => (
      <li key={r.id}>
        <ReviewCard
          review={r}
          user={user}
          editingReviewId={editingReviewId}
          editingInput={editingInput}
          setEditingReviewId={setEditingReviewId}
          setEditingInput={setEditingInput}
          loading={loading}
          onEditSubmit={onEditSubmit}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
        />
      </li>
    ))}
  </ul>
);

export default ReviewList;
