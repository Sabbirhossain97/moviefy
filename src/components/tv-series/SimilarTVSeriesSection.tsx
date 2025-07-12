import React from "react";
import TVSeriesSlider from "./TVSeriesSlider";

interface SimilarTVSeriesSectionProps {
    series: any[];
}

export const SimilarTVSeriesSection: React.FC<SimilarTVSeriesSectionProps> = ({
    series,
}) => {
    if (!series || series.length === 0) return null;
    return (
        <section className="container px-4 mt-10 mb-4">
            <TVSeriesSlider name="Similar Series" series={series.slice(0, 10)} />
        </section>
    );
};
