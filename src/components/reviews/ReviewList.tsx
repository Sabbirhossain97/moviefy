
import React from "react";
import ReviewCard from "./ReviewCard";

interface ReviewListProps {
  reviews: any[];
  user: any;
  editingReviewId: number | null;
  editingInput: string;
  setEditingReviewId: (id: string | number | null) => void;
  setEditingInput: (val: string) => void;
  loading: boolean;
  onEditSubmit: (r: any) => void;
  onStartEdit: (r: any) => void;
  onCancelEdit: () => void;
  onDelete: (id: string | number) => void;
  filterRating?: number | null;
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
}) => {
  return (
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
            rating={r.showRating ? r.user_rating : null}
          />
        </li>
      ))}
    </ul>
  );
};

export default ReviewList;
