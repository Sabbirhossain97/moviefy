
import React, { useState } from "react";
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
  return (
    <div className={`flex gap-2 rounded-lg p-4 bg-gradient-to-r from-card/70 to-background/60 shadow border hover:scale-[1.01] transition-all duration-150 group relative`}>
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
        {/* Actions for review owner */}
        {user && r.user_id === user.id && editingReviewId !== r.id && (
          <div className="flex gap-2 mt-2 items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onStartEdit(r)}
              disabled={loading}
              title="Edit review"
              className="text-primary hover:bg-primary/10"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onDelete(r.id)}
              disabled={loading}
              title="Delete review"
              className="ml-1"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ReviewCard;
