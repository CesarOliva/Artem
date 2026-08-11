import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { getArtworkImageUrl, getArtworksByArtist } from "../../services/artApi";
import type { Artwork } from "../../types/artwork";

import { Card, SkeletonCard } from "./Card";

export const Featured = (
    { type, value }:
    { type: string, value?: string | null }
) => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const title: Record<string, string> = {
        "artist": "Más obras del artista",
        "featured": "Obras destacadas",
        'favorites': 'Favoritos',
    }

    useEffect(() => {
        const loadArt = async () => {
            if (!value) {
                setArtworks([]);
                setLoading(false);
                return;
            }
            
            setLoading(true);

            try {
                setError(null);

                const artworks = await getArtworksByArtist(
                    value!,
                );

                setArtworks(artworks);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudieron cargar las obras.",
                );
            } finally {
                setLoading(false);
            }
        };

        void loadArt();
    }, [value]);

    if(loading) return (<SkeletonFeatured/>);

    if (error || artworks.length === 0) return null;

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-italic">{title[type]}</h2>
                <Link to='/' className="text-neutral-300 flex items-center cursor-pointer gap-2">Ver todas <ArrowRight className="size-5" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 mt-6">
                {artworks.map((artwork) => (
                    <Card
                        key={artwork.objectID} 
                        id={artwork.objectID}
                        image={getArtworkImageUrl(artwork.primaryImageSmall) ?? "/Images/NotFound.jpeg"}
                        title={artwork.title}
                        author={artwork.artistDisplayName ?? "Artista Desconocido"}
                        year={artwork.objectDate ?? "Fecha Desconocida"}
                        technique={artwork.classification ?? null}
                    />
                ))}
            </div>
        </div>
    );
}

export const SkeletonFeatured = () => {
    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div className="bg-neutral-900 h-9 w-64 animate-pulse rounded-md" />
                <div className="bg-neutral-900 h-6 w-28 animate-pulse rounded-md" />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        </div>
    )
};