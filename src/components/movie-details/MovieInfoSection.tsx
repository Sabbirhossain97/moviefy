
import React from "react";

interface MovieInfoSectionProps {
  overview: string;
  director: string;
  productionCompanies: { name: string }[];
  budget?: number;
  revenue?: number;
}

function formatCurrency(amount?: number) {
  if (!amount || isNaN(amount)) return "N/A";
  return "$" + amount.toLocaleString();
}

export const MovieInfoSection: React.FC<MovieInfoSectionProps> = ({
  overview,
  director,
  productionCompanies,
  budget,
  revenue,
}) => {
  return (
    <div className="mb-2 space-y-4 flex flex-col">
      <div>
        <h2 className="text-lg font-bold mb-0">Overview</h2>
        <p className="text-gray-300">{overview}</p>
      </div>
    
      {(!!budget || !!revenue) && (
        <div className="flex flex-row gap-16 mt-2 mb-1">
          <div>
            <span className="font-bold text-white block mb-0.5">Director</span>
            <span className="text-gray-300">{director}</span>
          </div>
          {budget !== undefined && (
            <div>
              <span className="block font-bold text-white mb-0.5">Budget</span>
              <span className="text-gray-300">{formatCurrency(budget)}</span>
            </div>
          )}
          {revenue !== undefined && (
            <div>
              <span className="block font-bold text-white mb-0.5">Revenue</span>
              <span className="text-gray-300">{formatCurrency(revenue)}</span>
            </div>
          )}
        </div>
      )}
      {productionCompanies && productionCompanies.length > 0 && (
        <div>
          <span className="font-bold text-white block mb-0.5">Production</span>
          <span className="text-gray-300">
            {productionCompanies.map((pc) => pc.name).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
};