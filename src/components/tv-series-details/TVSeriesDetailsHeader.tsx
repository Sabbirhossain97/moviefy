import React from "react";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/WishlistButton";
import MovieReminderButton from "@/components/MovieReminderButton";
import { Button } from "@/components/ui/button";
import { Film, Clock4, Play, Clapperboard } from "lucide-react";
import MovieRating from "@/components/MovieRating";
import { TVSeries } from "@/services/api";
import { TVSeriesInfoSection } from "./TVSeriesInfoSection";

interface TVSeriesDetailsHeaderProps {
  series: TVSeries;
  posterUrl: string | null;
  videos: any[];
  onPlayTrailer: () => void;
  onWriteReview: () => void;
  releaseYear: string | number;
  endYear: string | number;
}

const TVSeriesDetailsHeader: React.FC<TVSeriesDetailsHeaderProps> = ({
  series,
  posterUrl,
  videos,
  onPlayTrailer,
  onWriteReview,
  releaseYear,
  endYear,
}) => (
  <div className="flex flex-col md:flex-row gap-8 bg-transparent">
    <div className="w-full md:w-[350px] shrink-0 flex flex-col items-center md:items-start z-10">
      {posterUrl ? (
        <div className="relative group rounded-xl shadow-2xl">
          <img
            src={posterUrl}
            alt={series.name}
            className="w-64 md:w-[330px] h-[550px] object-cover rounded-xl shadow-xl"
            style={{ background: "#1a1a1a" }}
          />
          {/* <div className="absolute top-3 right-3 drop-shadow-md">
            <WishlistButton
              movie={movie}
              size="icon"
              variant="ghost"
              showText={false}
            />
          </div> */}
        </div>
      ) : (
        <div className="w-64 h-[500px] bg-gray-700 rounded-xl flex items-center justify-center">
          <Film className="w-16 h-16 text-gray-600" />
        </div>
      )}
    </div>
    <div className="flex-1">
      <h1 className="text-4xl font-bold mb-1 leading-tight items-center gap-2">
        {series.name}
      </h1>
      {series.tagline && (
        <div className="italic text-md text-gray-300 mb-2">{series.tagline}</div>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {series.genres?.map((genre: any) => (
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
            {series.vote_average?.toFixed(1)}/10
          </span>
        </span>
        <span className="flex items-center text-gray-400">
          <span className="inline-block w-4 h-4 mr-1">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </span>
          {releaseYear} - {endYear}
        </span>
        {series.status && (
          <div className="flex gap-1 items-center">
            <Clapperboard className="text-gray-400 h-4 w-4" />
            <span className="text-gray-400">
              {series.status}
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
        <MovieRating movieId={series.id} />
      </div>
      <TVSeriesInfoSection
        overview={series.overview}
        productionCountries={series.production_countries || []}
        productionCompanies={series.production_companies || []}
        spokenLanguages={series.spoken_languages || []}
        originalLanguage={series.original_language}
        seasons={series.number_of_seasons}
        networks={series.networks}
        creators={series.created_by}
      />
    </div>
  </div>
);

export default TVSeriesDetailsHeader;
