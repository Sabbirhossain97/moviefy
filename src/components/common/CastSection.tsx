
import React from "react";
import { IMAGE_SIZES } from "@/services/api";

interface CastPerson {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastSectionProps {
  cast: CastPerson[];
}

export const CastSection: React.FC<CastSectionProps> = ({ cast }) => {
  if (!cast || cast.length === 0) return null;
  return (
    <section className="container px-4 mt-12 mb-2">
      <h2 className="text-2xl font-semibold mb-2">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mt-4">
        {cast.slice(0, 10).map((person) => (
          <div key={person.id} className="flex flex-col items-center">
            {person.profile_path ? (
              <img
                src={`${IMAGE_SIZES.profile.medium}${person.profile_path}`}
                alt={person.name}
                className="w-20 h-20 rounded-full object-cover border-[3px] border-white/15 shadow mb-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-2 text-gray-400">
                N/A
              </div>
            )}
            <span className="text-sm font-semibold text-center">
              {person.name}
            </span>
            <span className="text-xs text-gray-400 text-center">
              {person.character}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
