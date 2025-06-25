import { Card, CardContent } from "@/components/ui/card";
import { TVSeries } from "@/services/api";
import { IMAGE_SIZES } from "@/services/api";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
// import { WishlistButton } from "@/components/WishlistButton";

interface TVSeriesCardProps {
    series: TVSeries;
    size?: "sm" | "md" | "lg";
}

const TVCard = ({ series, size = "md" }: TVSeriesCardProps) => {
    const firstAirDate = series.first_air_date ? new Date(series.first_air_date).getFullYear() : "N/A";
    const posterUrl = series.poster_path
        ? `${IMAGE_SIZES.poster.medium}${series.poster_path}`
        : "/placeholder.svg";
    const cardSizes = {
        sm: "w-[150px]",
        md: "w-[200px]",
        lg: "w-[250px]",
    };

    return (
        <Card className={`overflow-hidden movie-card-hover pb-2 gradient-card border-border/50`}>
            <div className="relative aspect-[2/3] overflow-hidden group">
                <Link to={`/tv/${series.id}`}>
                    <img
                        src={posterUrl}
                        alt={series.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                    />
                </Link>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {/* <WishlistButton
                        movie={tv_series}
                        size="icon"
                        variant="ghost"
                        showText={false}
                    /> */}
                </div>
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="flex items-center gap-1 font-medium gradient-secondary">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {series.vote_average ? series.vote_average.toFixed(1) : "N/A"}
                    </Badge>
                </div>
            </div>
            <CardContent className="p-3 space-y-3">
                <div className="h-[40px] flex flex-col justify-between">
                    <Link to={`/movie/${series.id}`}>
                        <h3
                            className="font-semibold text-sm line-clamp-2 leading-tight hover:underline"
                            title={series.name}
                        >
                            {series.name}
                        </h3>
                    </Link>
                    <p className="text-xs pt-1 text-muted-foreground">{firstAirDate}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default TVCard;
