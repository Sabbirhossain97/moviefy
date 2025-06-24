import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, Genre, TVSeries } from "@/services/api";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TVCard from "@/components/TVCard";

const TVSeriesGenrePage = () => {
    const { id } = useParams<{ id: string }>();
    const [genre, setGenre] = useState<Genre | null>(null);
    const [tvSeries, setTvSeries] = useState<TVSeries[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        const fetchGenreAndMovies = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const genreId = parseInt(id);

                const genresResponse = await api.getTVSeriesGenres();
                const currentGenre = genresResponse.genres.find(g => g.id === genreId);

                if (currentGenre) {
                    setGenre(currentGenre);

                    // Fetch movies for this genre
                    const tvSeriesResponse = await api.getTVSeriesByGenre(genreId, 1);
                    setTvSeries(tvSeriesResponse.results);
                    setTotalPages(tvSeriesResponse.total_pages);
                    setPage(1);
                }
            } catch (error) {
                console.error("Error fetching genre movies:", error);
                toast({
                    title: "Error loading movies",
                    description: "There was a problem loading movies for this genre. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchGenreAndMovies();
    }, [id, toast]);

    const loadMore = async () => {
        if (!id || page >= totalPages) return;

        try {
            setLoading(true);
            const genreId = parseInt(id);
            const nextPage = page + 1;
            const response = await api.getTVSeriesByGenre(genreId, nextPage);
            setTvSeries(prev => [...prev, ...response.results]);
            setPage(nextPage);
        } catch (error) {
            console.error("Error loading more movies:", error);
        } finally {
            setLoading(false);
        }
    };

    // Determine custom genre header label.
    let genreTitle = genre ? genre.name : "Genre Not Found";
    if (genreTitle.toLowerCase() === "tv movie") {
        genreTitle = "TV Shows";
    }

    if (loading && tvSeries.length === 0) {
        return (
            <>
                <Header />
                <main className="container py-8 px-4">
                    <div className="flex justify-center py-12">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
                            <p className="text-muted-foreground">Loading TV Series...</p>
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
                    {genre ? `${genreTitle}` : "Genre Not Found"}
                </h1>

                {tvSeries.length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-xl font-medium mb-2">No series found</h2>
                        <p className="text-muted-foreground">
                            We couldn't find any series in this genre.
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
        </>
    );
};

export default TVSeriesGenrePage;
