
import  { useState } from "react";
import { useMovieReminders } from "@/hooks/useMovieReminders";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface MovieReminderButtonProps {
  movieId: number;
  releaseDate: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function MovieReminderButton({
  movieId,
  releaseDate,
  size = "sm",
  className = "",
}: MovieReminderButtonProps) {
  const { user } = useAuth();
  const { hasReminder, setReminder, removeReminder, loading } = useMovieReminders(movieId);
  const [date, setDate] = useState(releaseDate);

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      {hasReminder ? (
        <Button
          variant="secondary"
          size={size}
          className={className}
          onClick={removeReminder}
          disabled={loading}
        >
          <Calendar className="w-4 h-4 mr-1" />
          Reminder set!
        </Button>
      ) : (
        <Button
          variant={size === "lg" ? "default" : "outline"}
          size={size}
          className={className}
          onClick={() => setReminder(date, true)}
          disabled={loading}
        >
          <Calendar className="w-4 h-4 mr-1" />
          Set Reminder for Release
        </Button>
      )}
    </div>
  );
}
