
import React, { useState } from "react";
import { useMovieReminders } from "@/hooks/useMovieReminders";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function MovieReminderButton({ movieId, releaseDate }: { movieId: number; releaseDate: string }) {
  const { user } = useAuth();
  const { hasReminder, setReminder, removeReminder, loading } = useMovieReminders(movieId);
  const [date, setDate] = useState(releaseDate);

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      {hasReminder ? (
        <Button variant="secondary" size="sm" onClick={removeReminder} disabled={loading}>
          <Calendar className="w-4 h-4 mr-1" />
          Reminder set!
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
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
