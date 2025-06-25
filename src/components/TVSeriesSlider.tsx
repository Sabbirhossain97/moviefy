import { useState, useRef, useEffect } from "react";
import { IMAGE_SIZES, TVSeries } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface TVSeriesSliderProps {
    name: string;
    series: TVSeries[];
    className?: string;
    renderActions?: (series: TVSeries) => React.ReactNode;
}

const SCROLL_STEP = 300;

const TVSeriesSlider = ({ name, series, className = "", renderActions }: TVSeriesSliderProps) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [atEnd, setAtEnd] = useState(false);

    const sliderRef = useRef<HTMLDivElement | null>(null);


    const validTvSeries = series.filter((series): series is TVSeries =>
        series != null && typeof series === 'object' && 'id' in series && 'name' in series
    );
    if (validTvSeries.length === 0) return null;

    const scrollLeft = () => {
        const container = sliderRef.current;
        if (container) {
            const newPosition = Math.max(0, container.scrollLeft - SCROLL_STEP);
            container.scrollTo({ left: newPosition, behavior: 'smooth' });
        }
    };
    const scrollRight = () => {
        const container = sliderRef.current;
        if (container) {
            const maxScroll = container.scrollWidth - container.clientWidth;
            const newPosition = Math.min(maxScroll, container.scrollLeft + SCROLL_STEP);
            container.scrollTo({ left: newPosition, behavior: 'smooth' });
        }
    };

    const updateScrollState = () => {
        const container = sliderRef.current;
        if (container) {
            setScrollPosition(container.scrollLeft);
            const maxScroll = container.scrollWidth - container.clientWidth;
            setAtEnd(container.scrollLeft >= maxScroll - 1 || maxScroll <= 0);
        }
    };

    useEffect(() => {
        updateScrollState();
        const handleResize = () => updateScrollState();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const handleScroll = () => updateScrollState();

    return (
        <section className={`relative ${className}`}>
            {name && <h2 className="text-2xl font-semibold mb-6">{name}</h2>}
            <div className="relative group select-none">
                {scrollPosition > 0 && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 transition-opacity gradient-card backdrop-blur-sm border-border/50 opacity-0 group-hover:opacity-100"
                        onClick={scrollLeft}
                        tabIndex={0}
                        aria-disabled={false}
                        type="button"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
                <div
                    ref={sliderRef}
                    id={`slider-${name.replace(/\s+/g, '-')}`}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                    onScroll={handleScroll}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    draggable={false}
                >
                    {validTvSeries.map((series) => (
                        <div key={series.id} className="flex-shrink-0 w-[240px] h-auto">
                            <Link to={`/tv/${series.id}`} className="block">
                                <div className="gradient-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border/50 h-full">
                                    <div className="overflow-hidden h-full">
                                        <img
                                            src={
                                                series.poster_path
                                                    ? `${IMAGE_SIZES.poster.medium}${series.poster_path}`
                                                    : "/placeholder.svg"
                                            }
                                            alt={series.name}
                                            className="w-full min-h-[357px] object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-3 h-[60px] flex flex-col justify-between">
                                        <h3
                                            className="font-medium text-sm line-clamp-2 leading-tight"
                                            title={series.name}
                                        >
                                            {series.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">
                                                {series.first_air_date ? new Date(series.first_air_date).getFullYear() : "TBA"}
                                            </p>
                                            {series.vote_average > 0 && (
                                                <p className="text-xs text-yellow-500">
                                                    ★ {series.vote_average.toFixed(1)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            {renderActions && (
                                <div className="mt-2 px-3">
                                    {renderActions(series)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {!atEnd && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity gradient-card backdrop-blur-sm border-border/50"
                        onClick={scrollRight}
                        tabIndex={0}
                        aria-disabled={false}
                        type="button"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </section>
    );
};

export default TVSeriesSlider;
