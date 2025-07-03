
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Pencil, MoreVertical, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  onDelete: (id: string | number) => void; // Updated to accept both string and number
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
      <div className="flex justify-between items-start">
        <div className="flex gap-3 flex-1 min-w-0">
          <div className="">
            <Avatar className="w-10 h-10 shrink-0">
              {r.user?.avatar_url ? (
                <AvatarImage src={r.user?.avatar_url} alt="User avatar" />
              ) : (
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center [@media(max-width:500px)]:items-start gap-2 mb-1">
              <div className="flex [@media(max-width:500px)]:flex-col [@media(max-width:500px)]:gap-1 gap-2 [@media(max-width:500px)]:items-start items-center">
                <span className="font-bold text-base">{r.user?.full_name || "User"}</span>
                {rating && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < rating ? "text-yellow-400" : "text-muted-foreground"}
                        fill={i < rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs text-gray-400 whitespace-nowrap`}>
                  {dayjs(r.created_at).format("MMM D, YYYY")}
                </span>
                {isOwner && editingReviewId !== r.id && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-2 w-2 p-0"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4 hover:text-red-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2" align="end">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start h-8 px-2"
                          onClick={() => onStartEdit(r)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start h-8 px-2 text-destructive hover:text-destructive"
                          onClick={() => onDelete(r.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            {editingReviewId === r.id ? (
              <div className="flex flex-col gap-3 ">
                <Textarea
                  className="w-full rounded border bg-background text-white transition duration-300 p-2 text-sm resize-none focus:outline-none"
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
              <div className="text-sm text-muted-foreground whitespace-wrap leading-relaxed ">
                {r.review}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
