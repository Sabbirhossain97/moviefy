
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Pencil } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ReviewCardProps {
  review: any;
  user: any;
  editingReviewId: number | null;
  editingInput: string;
  setEditingReviewId: (id: number | null) => void;
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
    <div className="flex flex-col gap-3 rounded-lg p-4 bg-gradient-to-r from-card/70 to-background/60 shadow border hover:scale-[1.01] transition-all duration-150 group relative">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 shrink-0">
          {r.user?.avatar_url ? (
            <AvatarImage src={r.user?.avatar_url} alt="User avatar" />
          ) : (
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-base">{r.user?.full_name || "User"}</span>
              <span className="text-xs text-gray-400">{dayjs(r.created_at).format("MMM D, YYYY")}</span>
            </div>
            
            {/* Show user rating only on latest user review */}
            {showUserRating && rating ? (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < rating ? "text-yellow-400" : "text-muted-foreground"}
                    fill={i < rating ? "currentColor" : "none"}
                  />
                ))}
                <span className="text-xs font-semibold text-yellow-500 ml-1">{rating}/5</span>
              </div>
            ) : null}
          </div>

          {/* Review content or edit form */}
          {editingReviewId === r.id ? (
            <div className="flex flex-col gap-3">
              <Textarea
                className="w-full rounded border bg-background text-white p-2 text-sm resize-none focus:ring focus:outline-none"
                value={editingInput}
                onChange={e => setEditingInput(e.target.value)}
                maxLength={500}
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors"
                  onClick={() => onEditSubmit(r)}
                  disabled={loading}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="border border-muted-foreground/20 text-muted-foreground bg-transparent px-4 py-2 rounded text-sm hover:bg-muted/50 transition-colors"
                  onClick={onCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {r.review}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons - positioned differently on mobile */}
      {isOwner && editingReviewId !== r.id && (
        <div className="flex justify-end gap-2 pt-2 border-t border-muted/20 sm:absolute sm:top-3 sm:right-3 sm:border-t-0 sm:pt-0">
          <Button
            size="sm"
            variant="ghost"
            type="button"
            className="h-8 w-8 p-0 hover:bg-muted/50"
            title="Edit review"
            onClick={() => onStartEdit(r)}
            aria-label="Edit review"
          >
            <Pencil className="w-4 h-4 text-primary" />
          </Button>
          <Button
            size="sm"
            variant="ghost" 
            type="button"
            className="h-8 w-8 p-0 hover:bg-muted/50"
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
    </div>
  );
};

export default ReviewCard;
