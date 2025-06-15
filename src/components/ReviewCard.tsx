
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Pencil, Trash2 } from "lucide-react";
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
}) => {
  // Check ownership
  const isOwner = user && r.user_id === user.id;

  return (
    <div className="flex gap-2 rounded-lg p-4 bg-gradient-to-r from-card/70 to-background/60 shadow border hover:scale-[1.01] transition-all duration-150 group relative">
      {/* Owner action buttons in corner */}
      {isOwner && editingReviewId !== r.id && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onStartEdit(r)}
            disabled={loading}
            title="Edit review"
            className="text-primary hover:bg-primary/10"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onDelete(r.id)}
            disabled={loading}
            title="Delete review"
            className="ml-1"
          >
            <Trash2 className="w-4 h-4" />
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
              <Button type="button" variant="default" size="sm" onClick={() => onEditSubmit(r)} disabled={loading}>
                Save
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onCancelEdit}>
                Cancel
              </Button>
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
