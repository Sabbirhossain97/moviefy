import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Pencil } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

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
  rating?: number | null; 
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
  rating,
}) => {
  const isOwner = user && r.user_id === user.id;

  return (
    <div className="flex gap-2 rounded-lg p-4 bg-gradient-to-r from-card/70 to-background/60 shadow border hover:scale-[1.01] transition-all duration-150 group relative">
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
          <Button
            size="icon"
            variant="ghost"
            type="button"
            className="ml-1"
            title="Delete review"
            onClick={() => onDelete(r.id)}
            aria-label="Delete review"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
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
          {/* Show user rating only on latest user review */}
          {showUserRating && rating ? (
            <span className="ml-2 flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < rating ? "text-yellow-400" : "text-muted-foreground"}
                  fill={i < rating ? "currentColor" : "none"}
                />
              ))}
              <span className="text-xs font-semibold text-yellow-500">{rating}/5</span>
            </span>
          ) : null}
        </div>
        {/* If this user is editing this review */}
        {editingReviewId === r.id ? (
          <div className="flex flex-col mt-1 gap-2">
            <Textarea
              className="w-full rounded border bg-background text-white p-2 text-sm resize-none focus:ring focus:outline-none"
              value={editingInput}
              onChange={e => setEditingInput(e.target.value)}
              maxLength={500}
              rows={2}
              autoFocus
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

