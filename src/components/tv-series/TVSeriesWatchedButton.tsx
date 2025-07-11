import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useTVSeriesWatchedList } from '@/hooks/useTVSeriesWatchedList';
import { TVSeries } from '@/services/api';
import { cn } from '@/lib/utils';

interface TVSeriesWatchedButtonProps {
  series: TVSeries;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
}

export const TVSeriesWatchedButton = ({ 
  series, 
  size = 'default',
  variant = 'outline',
  showText = true
}: TVSeriesWatchedButtonProps) => {
  const { addToWatched, removeFromWatched, isWatched } = useTVSeriesWatchedList();
  const watched = isWatched(series.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (watched) {
      removeFromWatched(series.id);
    } else {
      addToWatched(series);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
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
      <CheckCircle 
        className={cn(
          "transition-all duration-200",
          size === 'sm' || size === 'icon' 
            ? "w-4 h-4" 
            : size === 'lg' 
            ? "w-5 h-5" 
            : "w-4 h-4",
          watched && "fill-green-500 text-green-500",
          !watched && "fill-none"
        )} 
        fill={watched ? "currentColor" : "none"}
      />
      {showText && (
        <span className={cn(
          size === 'sm' && "text-xs",
          "ml-2"
        )}>
          {watched ? 'Watched' : 'Mark as Watched'}
        </span>
      )}
    </Button>
  );
};

export default TVSeriesWatchedButton;
