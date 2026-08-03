import { FiStar } from "react-icons/fi";

export function StarRating({ rating, className = "" }: { rating: number; className?: string }) {
    const fullStars = Math.round(rating);

    return (
        <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                    key={i}
                    className={`h-4 w-4 ${i < fullStars ? "fill-accent text-accent" : "text-muted-foreground"}`}
                />
            ))}
        </div>
    );
}