import { IMAGE_SIZES } from '@/services/api';
import { Heart, Eye } from 'lucide-react';
import { useWatchedList } from '@/hooks/useWatchedList';

interface WishlistTVCardProps {
    item: {
        series_id: number;
        series_name: string;
        series_poster_path: string | null;
        series_first_air_date: string | null;
        series_vote_average: number | null;
    };
    onRemove: (seriesId: number) => void;
    onClick: (seriesId: number) => void;
}

export default function WishlistTVCard({ item, onRemove }: WishlistTVCardProps) {
    const { addToTVWatchedList } = useWatchedList();

    const posterUrl = item.series_poster_path
        ? `${IMAGE_SIZES.poster.medium}${item.series_poster_path}`
        : '/placeholder.svg';

    const handleMarkTVSeriesAsWatched = (item: any) => {
        const seriesData = {
            id: item.series_id,
            name: item.series_name,
            original_name: item.series_name,
            poster_path: item.series_poster_path,
            first_air_date: item.series_first_air_date,
            vote_average: item.series_vote_average,
            vote_count: 0,
            overview: '',
            backdrop_path: null,
            original_language: '',
            created_by: [],
            networks: []
        };
        addToTVWatchedList(seriesData);
        onRemove(item.series_id);
    };

    return (
        <div
            className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all duration-200 bg-card"
        >
            <img
                src={posterUrl}
                alt={item.series_name}
                className="object-cover w-full h-64"
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col gap-2">
                <button
                    onClick={e => {
                        e.stopPropagation();
                        onRemove(item.series_id);
                    }}
                    className="rounded-full bg-white/70 hover:bg-red-100 p-2 text-red-600 shadow-xl"
                    title="Remove from wishlist"
                >
                    <Heart className="w-5 h-5 fill-red-500" />
                </button>
                <button
                    onClick={e => {
                        e.stopPropagation();
                        handleMarkTVSeriesAsWatched(item);
                    }}
                    className="rounded-full bg-white/70 hover:bg-green-100 p-2 text-green-600 shadow-xl"
                    title="Mark as watched"
                >
                    <Eye className="w-5 h-5" />
                </button>
            </div>
            <div className="p-4">
                <div className="font-semibold mb-1 line-clamp-2">{item.series_name}</div>
                <div className="text-xs text-muted-foreground mb-1">
                    {item.series_first_air_date
                        ? new Date(item.series_first_air_date).getFullYear()
                        : 'N/A'}
                </div>
                {item.series_vote_average !== null && (
                    <div className="text-xs text-yellow-500 font-medium">
                        {item.series_vote_average.toFixed(1)} / 10
                    </div>
                )}
            </div>
        </div>
    );
}
