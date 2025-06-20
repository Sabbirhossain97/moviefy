
import React from "react";
import { Dialog } from "@/components/ui/dialog";

interface TrailerDialogProps {
  show: boolean;
  onClose: () => void;
  videoKey: string;
}

export const TrailerDialog: React.FC<TrailerDialogProps> = ({
  show,
  onClose,
  videoKey,
}) => {
  if (!show) return null;
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
        style={{ display: show ? "flex" : "none" }}
        onClick={onClose}
      >
        <div
          className="relative bg-black max-w-2xl w-full rounded shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-2 right-2 text-white text-3xl leading-none z-10"
          >
            &times;
          </button>
          <iframe
            width="560"
            height="500"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Movie Trailer"
            className="rounded w-full aspect-video"
          />
        </div>
      </div>
    </Dialog>
  );
};
