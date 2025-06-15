
import React from 'react';
import { IMAGE_SIZES } from '@/services/api';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WishlistMovieCardProps {
  item: {
    movie_id: number;
    movie_title: string;
    movie_poster_path: string | null;
    movie_release_date: string | null;
    movie_vote_average: number | null;
  };
  onRemove: (movieId: number) => void;
  onClick: (movieId: number) => void;
}

export default function WishlistMovieCard({ item, onRemove, onClick }: WishlistMovieCardProps) {
  const posterUrl = item.movie_poster_path
    ? `${IMAGE_SIZES.poster.medium}${item.movie_poster_path}`
    : '/placeholder.svg';

  return (
    <div
      className={cn(
        "relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all duration-200 bg-card/50"
      )}
      onClick={() => onClick(item.movie_id)}
      tabIndex={0}
      aria-label={`View details for ${item.movie_title}`}
    >
      <img
        src={posterUrl}
        alt={item.movie_title}
        className="object-cover w-full h-64"
      />
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={e => {
            e.stopPropagation();
            onRemove(item.movie_id);
          }}
          className="rounded-full bg-white/70 hover:bg-red-100 p-2 text-red-600 shadow-xl"
          title="Remove"
        >
          <Heart className="w-5 h-5 fill-red-500" />
        </button>
      </div>
      <div className="p-4">
        <div className="font-semibold mb-1 line-clamp-2">{item.movie_title}</div>
        <div className="text-xs text-muted-foreground mb-1">
          {item.movie_release_date
            ? new Date(item.movie_release_date).getFullYear()
            : 'N/A'}
        </div>
        {item.movie_vote_average !== null && (
          <div className="text-xs text-yellow-500 font-medium">
            {item.movie_vote_average.toFixed(1)} / 10
          </div>
        )}
      </div>
    </div>
  );
}
