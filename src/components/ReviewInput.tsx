
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface ReviewInputProps {
  user: any;
  input: string;
  setInput: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  myReview: any | null;
}
const ReviewInput: React.FC<ReviewInputProps> = ({
  user,
  input,
  setInput,
  loading,
  onSubmit,
  myReview,
}) => {
  if (!user) return null;
  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-4 rounded-lg shadow bg-card px-3 py-2 border border-gray-800 items-center">
      <Avatar className="w-8 h-8 shrink-0">
        {user?.avatar_url ? (
          <AvatarImage src={user.avatar_url} alt="Your avatar" />
        ) : (
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        )}
      </Avatar>
      <input
        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground text-sm"
        placeholder={myReview ? "Edit your review…" : "Write a review…"}
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={loading}
        maxLength={500}
        autoFocus={false}
      />
      <Button
        type="submit"
        disabled={loading || !input.trim()}
        variant="default"
        className="rounded shadow"
      >
        {myReview ? "Update" : "Post"}
      </Button>
    </form>
  );
};
export default ReviewInput;
