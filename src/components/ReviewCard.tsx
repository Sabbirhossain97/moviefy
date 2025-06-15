
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Pencil, Trash2, Star } from "lucide-react";
import dayjs from "dayjs";

interface ReviewCardProps {
  review: any;
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
  showUserRating?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review: r,
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
  showUserRating,
}) => {
  const isOwner = user && r.user_id === user.id;

  return (
    <div className="flex gap-2 rounded-lg p-4 bg-gradient-to-r from-card/70 to-background/60 shadow border hover:scale-[1.01] transition-all duration-150 group relative">
      {/* Owner action icons in corner */}
      {isOwner && editingReviewId !== r.id && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <span
            onClick={() => onStartEdit(r)}
            title="Edit review"
            className="cursor-pointer text-primary hover:text-yellow-400 transition"
            style={{ display: "flex", alignItems: "center" }}
            tabIndex={0}
            aria-label="Edit review"
          >
            <Pencil className="w-4 h-4" />
          </span>
          <span
            onClick={() => onDelete(r.id)}
            title="Delete review"
            className="cursor-pointer text-primary hover:text-red-400 transition ml-2"
            style={{ display: "flex", alignItems: "center" }}
            tabIndex={0}
            aria-label="Delete review"
          >
            <Trash2 className="w-4 h-4" />
          </span>
        </div>
      )}

      <Avatar className="w-10 h-10 shrink-0">
        {r.user?.avatar_url ? (
          <AvatarImage src={r.user?.avatar_url} alt="User avatar" />
        ) : (
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base">{r.user?.full_name || "User"}</span>
          <span className="text-xs text-gray-400">{dayjs(r.created_at).format("MMM D, YYYY")}</span>
          {/* Show user rating only on latest review */}
          {showUserRating && r.rating && (
            <span className="flex items-center ml-2 bg-yellow-200/10 px-2 py-0.5 rounded font-medium text-yellow-400 text-xs border border-yellow-700">
              <Star className="w-4 h-4 mr-1" fill="currentColor" />
              {r.rating}/5
            </span>
          )}
        </div>
        {/* If this user is editing this review */}
        {editingReviewId === r.id ? (
          <div className="flex flex-col mt-1 gap-2">
            <textarea
              className="w-full rounded border bg-background text-white p-2 text-sm resize-none focus:ring focus:outline-none"
              value={editingInput}
              onChange={e => setEditingInput(e.target.value)}
              maxLength={500}
              rows={2}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-primary text-white px-3 py-1 rounded text-sm"
                onClick={() => onEditSubmit(r)}
                disabled={loading}
                style={{ minWidth: 64 }}
              >
                Save
              </button>
              <button
                type="button"
                className="border border-gray-300 text-gray-400 bg-transparent px-3 py-1 rounded text-sm"
                onClick={onCancelEdit}
                style={{ minWidth: 64 }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm mt-1 text-muted-foreground whitespace-pre-line">{r.review}</div>
        )}
      </div>
    </div>
  );
};
export default ReviewCard;
