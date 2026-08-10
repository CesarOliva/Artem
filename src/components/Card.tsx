import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { CardType } from "../../types/card"

export const Card = (
    { id, image, title, author, year, technique }: CardType
) => {
    const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('Click'); // Imprime 'Click' en la consola
    };

    return (
        <Link to={`/artwork/${id}`} className="rounded-xl bg-neutral-900 cursor-pointer transition-colors duration-300">
            <img className="w-full object-cover rounded-t-xl h-48" src={image} alt={title} />

            <div className="p-4 flex gap-1">
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 truncate">{title}</h3>
                    <p className="text-sm text-neutral-400 mb-1">{author}, {year}</p>
                    {technique && (
                        <p className="text-sm text-neutral-400 truncate">{technique}</p>
                    )}
                </div>

                <button onClick={handleFavorite} className="flex items-start shrink-0 mt-1 cursor-pointer" >
                    <Heart className="size-5 text-neutral-300 hover:text-red-700/80 transition-colors duration-100" />
                </button>
            </div>
        </Link>
    );
}

export const SkeletonCard = () => {
    return (
        <div className="rounded-xl bg-neutral-900 overflow-hidden">
            <div className="aspect-video w-full animate-pulse bg-neutral-800" />
            <div className="px-2 py-4 space-y-3">
                <div className="h-5 w-5/6 animate-pulse rounded-md bg-neutral-800" />
                <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-800" />
                <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-800" />
            </div>
        </div>
    )
};