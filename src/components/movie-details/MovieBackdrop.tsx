
import React from "react";

interface MovieBackdropProps {
  backdropUrl: string | null;
  title: string;
}

const MovieBackdrop: React.FC<MovieBackdropProps> = ({ backdropUrl, title }) => (
  <div className="relative w-full h-[48vh] min-h-[300px] max-h-[520px] flex items-end overflow-hidden">
    {backdropUrl ? (
      <>
        <img
          src={backdropUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
          style={{ filter: "brightness(0.8)" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/80 to-[#141722]" />
      </>
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 text-gray-300 text-xl font-semibold">
        No Cover Available
      </div>
    )}
  </div>
);

export default MovieBackdrop;
