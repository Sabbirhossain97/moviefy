import React from "react";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/WishlistButton";
import MovieReminderButton from "@/components/MovieReminderButton";
import { Button } from "@/components/ui/button";
import { Film, Clock4, Play, Clapperboard } from "lucide-react";
import Rating from "@/components/Rating";
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
}) => (
  <div className="flex flex-col md:flex-row gap-8 bg-transparent">
    <div className="w-full md:w-[350px] shrink-0 flex flex-col items-center md:items-start z-10">
      {posterUrl ? (
        <div className="relative group rounded-xl shadow-2xl">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-64 md:w-[330px] h-[550px] object-cover rounded-xl shadow-xl"
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
    <div className="flex-1">
      <h1 className="text-4xl font-bold mb-1 leading-tight items-center gap-2">
        {movie.title}
        <span className="text-gray-400 text-2xl font-normal ml-2">
          ({releaseYear})
        </span>
      </h1>
      {movie.tagline && (
        <div className="italic text-md text-gray-300 mb-2">{movie.tagline}</div>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {movie.genres?.map((genre: any) => (
          <Badge className="text-xs bg-gray-700" key={genre.id}>
            {genre.name}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <span className="flex items-center text-yellow-400 font-medium ">
          <span className="mr-1 font-bold rounded bg-[#f5c518] text-gray-900 px-2 py-0.5 text-xs shadow-sm">
            IMDb
          </span>
          <span className="ml-1">
            {movie.vote_average?.toFixed(1)}/10
          </span>
        </span>
        <span className="flex items-center text-gray-400">
          <span className="inline-block w-4 h-4 mr-1">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </span>
          {movie.release_date}
        </span>
        {movie.runtime !== null && movie.runtime !== undefined && (
          <div className="flex gap-1 items-center">
            <Clock4 className="text-gray-400 h-4 w-4" />
            <span className="text-gray-400">
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </span>
          </div>
        )}
        {movie.status && (
          <div className="flex gap-1 items-center">
            <Clapperboard className="text-gray-400 h-4 w-4" />
            <span className="text-gray-400">
              {movie.status}
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        {videos.length > 0 && (
          <Button
            className="min-w-[165px] text-white rounded px-5 py-4 font-semibold flex items-center gap-2 shadow-md"
            size="lg"
            onClick={onPlayTrailer}
          >
            <Play />
            Watch Trailer
          </Button>
        )}
        {!isReleased && (
          <div className="flex">
            <MovieReminderButton
              movieId={movie.id}
              releaseDate={movie.release_date}
              size="lg"
              className="min-w-[165px] rounded px-5 py-2 font-semibold flex items-center gap-2 shadow-md"
            />
          </div>
        )}
        <Button
          className="min-w-[165px] border border-primary bg-transparent hover:bg-accent text-primary font-semibold flex items-center gap-2 shadow-md"
          variant="outline"
          size="lg"
          onClick={onWriteReview}
        >
          Write a Review
        </Button>
      </div>
      <div className="mb-2 flex items-center gap-3">
        <Rating id={movie.id} type="movie" />
      </div>
      <MovieInfoSection
        overview={movie.overview}
        director={director}
        productionCountries={movie.production_countries || []}
        productionCompanies={movie.production_companies || []}
        spokenLanguages={movie.spoken_languages || []}
        originalLanguage={movie.original_language}
        budget={movie.budget}
        revenue={movie.revenue}
      />
    </div>
  </div>
);

export default MovieDetailsHeader;
