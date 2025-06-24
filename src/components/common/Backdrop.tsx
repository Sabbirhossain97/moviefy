
import React from "react";

interface BackdropProps {
  backdropUrl: string | null;
  title: string;
}

const Backdrop: React.FC<BackdropProps> = ({ backdropUrl, title }) => (
  <div className="relative w-full h-[100vh] min-h-[300px] max-h-[520px] flex items-end overflow-hidden">
    {backdropUrl ? (
      <>
        <img
          src={backdropUrl}
          alt={title}
          className="absolute inset-0 w-full [mask-image:linear-gradient(to_bottom,gray_60%,transparent_100%)] h-full object-cover object-top pointer-events-none select-none z-0"
          style={{ filter: "brightness(0.8)" }}

        />
      </>
    ) : (
        <div className="w-full h-full flex items-center [mask-image:linear-gradient(to_bottom,gray_60%,transparent_100%)] justify-center bg-gradient-to-r from-gray-900 to-gray-700 text-gray-300 text-xl font-semibold">
        No Cover Available
      </div>
    )}
  </div>
);

export default Backdrop;
