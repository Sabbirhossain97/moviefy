import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, TVSeries } from "@/services/api";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TVCard from "@/components/TVCard";
import Footer from "@/components/Footer";

type CategoryType = "airing-today" | "on-the-air" | "popular" | "top-rated";

const categoryMap: Record<CategoryType, {
    title: string;
    apiCall: (page: number) => Promise<{ results: TVSeries[]; total_pages: number }>;
}> = {
    "airing-today": {
        title: "Airing Today",
        apiCall: api.getAiringToday,
    },
    "on-the-air": {
        title: "On The Air",
        apiCall: api.getOnTheAir,
    },
    "popular": {
        title: "Popular",
        apiCall: api.getTvPopular,
    },
    "top-rated": {
        title: "Top Rated",
        apiCall: api.getTvTopRated,
    },
};

const MovieCategory = () => {
    const { category } = useParams<{ category: string }>();
    const [tvSeries, setTvSeries] = useState<TVSeries[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { toast } = useToast();

    const categoryType = (category || "airing-today") as CategoryType;
    const categoryInfo = categoryMap[categoryType] || categoryMap.popular;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await categoryInfo.apiCall(1);
                setTvSeries(response.results);
                setTotalPages(response.total_pages);
                setPage(1);
            } catch (error) {
                console.error(`Error fetching ${categoryType} tv series:`, error);
                toast({
                    title: "Error loading tv series",
                    description: "There was a problem loading tv series. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [categoryType, toast]);

    const loadMore = async () => {
        if (page >= totalPages) return;

        try {
            setLoading(true);
            const nextPage = page + 1;
            const response = await categoryInfo.apiCall(nextPage);
            setTvSeries(prev => [...prev, ...response.results]);
            setPage(nextPage);
        } catch (error) {
            console.error(`Error loading more ${categoryType} movies:`, error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && tvSeries.length === 0) {
        return (
            <>
                <Header />
                <main className="container py-8 px-4">
                    <div className="flex justify-center py-12">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
                            <p className="text-muted-foreground">Loading tv series...</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="container py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">
                    {categoryInfo.title}
                </h1>

                {tvSeries.length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-xl font-medium mb-2">No tv series found</h2>
                        <p className="text-muted-foreground">
                            We couldn't find any tv series in this category.
                            Try browsing our other categories.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {tvSeries.map(series => (
                                <div key={series.id}>
                                    <TVCard series={series} />
                                </div>
                            ))}
                        </div>

                        {page < totalPages && (
                            <div className="flex justify-center mt-10">
                                <Button
                                    onClick={loadMore}
                                    disabled={loading}
                                    variant="outline"
                                    className="min-w-[150px]"
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer/>
        </>
    );
};

export default MovieCategory;
