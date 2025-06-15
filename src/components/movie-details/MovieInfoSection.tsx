
import React from "react";

interface MovieInfoSectionProps {
  overview: string;
  director: string;
  productionCompanies: { name: string }[];
}

export const MovieInfoSection: React.FC<MovieInfoSectionProps> = ({
  overview,
  director,
  productionCompanies,
}) => {
  return (
    <div className="mb-2 space-y-4 flex flex-col">
      <div>
        <h2 className="text-lg font-bold mb-0">Overview</h2>
        <p className="text-gray-300">{overview}</p>
      </div>
      <div>
        <span className="font-medium text-white">Director: </span>
        <span className="text-gray-300">{director}</span>
      </div>
      {productionCompanies && productionCompanies.length > 0 && (
        <div>
          <span className="font-medium text-white">Production: </span>
          <span className="text-gray-300">
            {productionCompanies.map((pc) => pc.name).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
};
