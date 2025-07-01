
import { Badge } from "../ui/badge";

interface MovieInfoSectionProps {
  overview: string;
  director: string;
  productionCountries: { name: string }[]
  productionCompanies: { name: string }[];
  spokenLanguages: { english_name: string, iso_639_1: string }[],
  originalLanguage: string;
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
  productionCountries,
  productionCompanies,
  spokenLanguages,
  originalLanguage,
  budget,
  revenue,
}) => {
  return (
    <div className="mb-2 space-y-4 flex flex-col">
      {overview && <div>
        <h2 className="text-lg font-bold mb-0">Overview</h2>
        <p className="text-gray-400">{overview}</p>
      </div>}

      {(!!budget || !!revenue) && (
        <div className="flex flex-row gap-16 mt-2 mb-1">
          <div>
            <span className="font-bold text-white block mb-0.5">Director</span>
            <span className="text-gray-400">{director}</span>
          </div>
          {budget !== undefined && (
            <div>
              <span className="block font-bold text-white mb-0.5">Budget</span>
              <span className="text-gray-400">{formatCurrency(budget)}</span>
            </div>
          )}
          {revenue !== undefined && (
            <div>
              <span className="block font-bold text-white mb-0.5">Revenue</span>
              <span className="text-gray-400">{formatCurrency(revenue)}</span>
            </div>
          )}
        </div>
      )}
      {productionCompanies && productionCompanies.length > 0 && (
        <div>
          <p className="font-bold text-white mb-0.5 flex items-center">Production
            {productionCountries.map((pc) =>
            (
              <Badge className="text-[10px] bg-gray-700 ml-2 py-0" >
                {pc.name}
              </Badge>
            ))}
          </p>
          <span className="text-gray-400">
            {productionCompanies.map((pc) => pc.name).join(", ")}
          </span>
        </div>
      )}
      {spokenLanguages && spokenLanguages.length > 0 && (
        <div>
          <p className="font-bold text-white mb-0.5 flex items-center">Spoken Languages</p>
          <span className="text-gray-400">
            {spokenLanguages.map((pc) => {
              if (pc.iso_639_1 === originalLanguage) {
                return `${pc.english_name}(Original)`
              } else {
                return pc.english_name
              }
            }).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};