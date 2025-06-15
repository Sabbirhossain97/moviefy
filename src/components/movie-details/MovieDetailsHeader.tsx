
import React, { RefObject } from "react";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/WishlistButton";
import MovieReminderButton from "@/components/MovieReminderButton";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import MovieRating from "@/components/MovieRating";
import { MovieInfoSection } from "@/components/movie-details/MovieInfoSection";
import { Movie } from "@/services/api";

interface MovieDetailsHeaderProps {
  movie: Movie;
  posterUrl: string | null;
  isReleased: boolean;
  videos: any[];
  onPlayTrailer: () => void;
  onWriteReview: () => void;
  releaseYear: string | number;
  director: string;
  reviewSectionRef: RefObject<HTMLDivElement>;
}

const MovieDetailsHeader: React.FC<MovieDetailsHeaderProps> = ({
  movie,
  posterUrl,
  isReleased,
  videos,
  onPlayTrailer,
  onWriteReview,
  releaseYear,
  director,
  reviewSectionRef,
}) => (
  <div className="flex flex-col md:flex-row gap-8 bg-transparent">
    {/* LEFT: Poster */}
    <div className="w-full md:w-[350px] shrink-0 flex flex-col items-center md:items-start z-10">
      {posterUrl ? (
        <div className="relative group rounded-xl shadow-2xl">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-64 md:w-[330px] h-[500px] object-cover rounded-xl border-[5px] border-white/10 shadow-xl"
            style={{ background: "#1a1a1a" }}
          />
          <div className="absolute top-3 right-3 drop-shadow-md">
            <WishlistButton
              movie={movie}
              size="icon"
              variant="ghost"
              showText={false}
            />
          </div>
        </div>
      ) : (
        <div className="w-64 h-[500px] bg-gray-700 rounded-xl flex items-center justify-center">
          <Film className="w-16 h-16 text-gray-600" />
        </div>
      )}
    </div>
    {/* RIGHT: Info */}
    <div className="flex-1 pt-2">
      <h1 className="text-4xl font-bold mb-1 leading-tight flex items-center gap-2">
        {movie.title}
        <span className="text-gray-400 text-2xl font-normal ml-2">
          ({releaseYear})
        </span>
      </h1>
      {movie.tagline && (
        <div className="italic text-md text-gray-300 mb-2">{movie.tagline}</div>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {movie.genres?.map((genre: any) => (
          <Badge variant="secondary" className="text-xs" key={genre.id}>
            {genre.name}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        {/* IMDb Rating */}
        <span className="flex items-center text-yellow-400 font-medium text-lg">
          <svg
            className="inline w-5 h-5 mr-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
          <span className="mr-1 font-bold rounded bg-[#f5c518] text-gray-900 px-2 py-0.5 text-xs shadow-sm">
            IMDb
          </span>
          <span className="ml-1">
            {movie.vote_average?.toFixed(1)}/10
          </span>
        </span>
        <span className="flex items-center text-gray-400">
          <span className="inline-block w-4 h-4 mr-1">
            {/* Calendar Icon */}
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </span>
          {movie.release_date}
        </span>
        {movie.runtime !== null && movie.runtime !== undefined && (
          <span className="text-gray-400">
            {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
          </span>
        )}
        {movie.status && (
          <Badge variant="secondary">{movie.status}</Badge>
        )}
      </div>
      {/* Actions Row */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {/* Only show Set Reminder if NOT released */}
        {!isReleased && (
          <div className="flex">
            <MovieReminderButton movieId={movie.id} releaseDate={movie.release_date} />
          </div>
        )}
        {videos.length > 0 && (
          <Button
            className="min-w-[165px] h-10 bg-red-600 hover:bg-red-700 text-white rounded px-5 py-2 font-semibold flex items-center gap-2 shadow-md"
            style={{ backgroundColor: "#E50914" }}
            onClick={onPlayTrailer}
          >
            <span className="inline-block w-5 h-5">
              {/* Play Icon */}
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            Watch Trailer
          </Button>
        )}
        <Button
          className="min-w-[165px] h-10 border border-primary bg-transparent hover:bg-accent text-primary font-semibold flex items-center gap-2 shadow-md"
          variant="outline"
          onClick={onWriteReview}
        >
          Write a Review
        </Button>
      </div>
      {/* Movie rating star interface */}
      <div className="mb-2 flex items-center gap-3">
        <MovieRating movieId={movie.id} />
      </div>
      {/* Overview Section */}
      <MovieInfoSection
        overview={movie.overview}
        director={director}
        productionCompanies={movie.production_companies || []}
      />
    </div>
  </div>
);

export default MovieDetailsHeader;
