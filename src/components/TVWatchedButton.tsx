import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useWatchedList } from '@/hooks/useWatchedList';
import { TVSeries } from '@/services/api';
import { cn } from '@/lib/utils';

interface TVWatchedButtonProps {
    series: TVSeries;
    size?: 'sm' | 'default' | 'lg' | 'icon';
    variant?: 'default' | 'outline' | 'ghost';
}

export const TVWatchedButton = ({
    series,
    size = 'default',
    variant = 'outline',
}: TVWatchedButtonProps) => {
    const { addToTVWatchedList, removeFromTVWatchedList, isTVWatched } = useWatchedList();
    const watched = isTVWatched(series.id);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (watched) {
            removeFromTVWatchedList(series.id);
        } else {
            addToTVWatchedList(series);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            title={watched ? 'Watched' : 'Mark as Watched'}
            onClick={handleClick}
            className={cn(
                "transition-all duration-200 flex items-center rounded-full p-0 w-9 h-9 justify-center shadow hover:bg-green-100/30",
                watched
                    ? "text-green-500 bg-green-100/50 border-green-500"
                    : "hover:text-green-500",
                variant === 'ghost' && "bg-black/70 hover:bg-black/90 backdrop-blur-sm",
                size === 'icon' && "w-9 h-9 p-0"
            )}
            aria-label={watched ? "Remove from watched" : "Mark as watched"}
        >
            <Check className={watched ? 'text-green-500' : ""} />
        </Button>
    );
};
