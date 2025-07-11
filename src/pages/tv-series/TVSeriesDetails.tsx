import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api, MovieVideo, IMAGE_SIZES, Cast, TVSeries } from '@/services/api';
import Header from '@/components/common/Header';
import Reviews from "@/components/reviews/Reviews";
import Footer from "@/components/common/Footer";
import Backdrop from '@/components/common/Backdrop';
import { CastSection } from "@/components/common/CastSection";
import { TrailerDialog } from "@/components/common/TrailerDialog";
import TVSeriesDetailsHeader from '@/components/tv-series/TVSeriesDetailsHeader';
import { SimilarTVSeriesSection } from '@/components/tv-series/SimilarTVSeriesSection';

interface CreditsResponse {
    cast: Cast[];
    crew: any[];
}

const TVSeriesDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [tvSeries, setTvSeries] = useState<TVSeries | null>(null);
    const [videos, setVideos] = useState<MovieVideo[]>([]);
    const [credits, setCredits] = useState<CreditsResponse | null>(null);
    const [similarTVSeries, setSimilarTVSeries] = useState<TVSeries[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const reviewSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTVSeriesDetails = async () => {
            if (!id) {
                setError('Invalid movie ID');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const tvSeriesId = parseInt(id, 10);
                const [tvSeriesDetails, tvSeriesVideos, creditsResp, similarResp] =
                    await Promise.all([
                        api.getTvSeries(tvSeriesId),
                        api.getTVSeriesVideos(tvSeriesId),
                        api.getTVSeriesCredits(tvSeriesId),
                        api.getSimilarTVSeries(tvSeriesId),
                    ]);
                setTvSeries(tvSeriesDetails);
                setVideos(tvSeriesVideos.results);
                setCredits(creditsResp);
                setSimilarTVSeries(similarResp.results || []);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to load series details');
            } finally {
                setLoading(false);
            }
        };
        fetchTVSeriesDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen gradient-bg">
                <Header />
                <main className="container py-8">
                    <div className="animate-pulse">
                        <div className="h-64 bg-muted rounded-md mb-4"></div>
                        <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
                        <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen gradient-bg">
                <Header />
                <main className="container py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!tvSeries) {
        return (
            <div className="min-h-screen gradient-bg">
                <Header />
                <main className="container py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">TV Series Not Found</h1>
                        <p className="text-muted-foreground">Could not retrieve TV series details.</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const backdropUrl = tvSeries.backdrop_path ? `${IMAGE_SIZES.backdrop.original}${tvSeries.backdrop_path}` : null;
    const posterUrl = tvSeries.poster_path ? `${IMAGE_SIZES.poster.large}${tvSeries.poster_path}` : null;
    const releaseYear = tvSeries.first_air_date ? new Date(tvSeries.first_air_date).getFullYear() : "N/A";

    return (
        <>
            <Header />
            <div className="min-h-screen gradient-bg relative">
                <Backdrop backdropUrl={backdropUrl} title={tvSeries.name} />
                <main className="container relative z-20 max-w-6xl px-4 -mt-48">
                    <TVSeriesDetailsHeader
                        series={tvSeries}
                        posterUrl={posterUrl}
                        videos={videos}
                        onPlayTrailer={() => setShowTrailer(true)}
                        onWriteReview={() => {
                            if (reviewSectionRef.current) {
                                reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        releaseYear={releaseYear}
                    />
                </main>

                <TrailerDialog
                    show={showTrailer && videos.length > 0}
                    onClose={() => setShowTrailer(false)}
                    videoKey={videos.length > 0 ? videos[0].key : ""}
                />

                <CastSection cast={credits?.cast || []} />

                <SimilarTVSeriesSection series={similarTVSeries} />

                <section
                    ref={reviewSectionRef}
                    className="container px-4 relative z-20 my-12"
                >
                    <Reviews id={tvSeries.id} type='tv' />
                </section>

                <Footer />
            </div>
        </>

    );
};

export default TVSeriesDetails;
