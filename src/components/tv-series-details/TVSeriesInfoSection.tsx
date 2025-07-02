
import { create } from "domain";
import { Badge } from "../ui/badge";

interface TVSeriesInfoSectionProps {
    overview: string;
    productionCountries: { name: string }[]
    productionCompanies: { name: string }[];
    spokenLanguages: { english_name: string, iso_639_1: string }[],
    originalLanguage: string;
    seasons: number;
    networks: { name: string }[];
    creators: { name: string, profile_path: string | null }[]
}

export const TVSeriesInfoSection: React.FC<TVSeriesInfoSectionProps> = ({
    overview,
    productionCountries,
    productionCompanies,
    spokenLanguages,
    originalLanguage,
    seasons,
    networks,
    creators
}) => {

    return (
        <div className="mb-2 space-y-4 flex flex-col items-center md:items-start">
            <div className="text-center md:text-start">
                <h2 className="text-lg font-bold mb-0">Overview</h2>
                <p className="text-gray-400">{overview}</p>
            </div>
            <div className="flex [@media(max-width:500px)]:flex-wrap [@media(max-width:500px)]:justify-center [@media(max-width:500px)]:gap-6 flex-row gap-16 mt-2 mb-1">
                {creators && creators.length > 0 && (
                    <div>
                        <span className="block font-bold whitespace-nowrap text-white mb-0.5">Created By</span>
                        <span className="text-gray-400">
                            {creators.map((pc) => pc.name).join(", ")}
                        </span>
                    </div>
                )}
                {networks && networks.length > 0 && (
                    <div className="text-center md:text-start">
                        <p className="font-bold text-white mb-0.5 flex items-center">Networks</p>
                        <span className="text-gray-400 whitespace-nowrap">
                            {networks.map((pc) => pc.name).join(", ")}
                        </span>
                    </div>
                )}
                {seasons && <div className="text-center md:text-start">
                    <span className="block font-bold text-white whitespace-nowrap mb-0.5">Total Seasons</span>
                    <span className="text-gray-400">{seasons}</span>
                </div>}
            </div>

            {productionCompanies && productionCompanies.length > 0 && (
                <div className="flex flex-col items-center md:items-start">
                    <p className="font-bold text-white mb-0.5 flex justify-center md:justify-start items-center">Production
                        <span className="hidden md:block">
                            {productionCountries.map((pc) =>
                            (
                                <Badge className="text-[10px] bg-gray-700 ml-2 py-0" >
                                    {pc.name}
                                </Badge>
                            ))}
                        </span>
                    </p>
                    <p className="md:hidden mb-1">{productionCountries.map((pc) =>
                    (
                        <Badge className="text-[10px] bg-gray-700 ml-2 py-0" >
                            {pc.name}
                        </Badge>
                    ))}
                    </p>
                    <span className="text-gray-400 text-center md:text-start">
                        {productionCompanies.map((pc) => pc.name).join(", ")}
                    </span>
                </div>
            )}

            {spokenLanguages && spokenLanguages.length > 0 && (
                <div>
                    <p className="font-bold text-white mb-0.5 flex justify-center md:justify-start items-center">Spoken Languages</p>
                    <span className="text-gray-400 text-center">
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