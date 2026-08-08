import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getArtworkById, getArtworkImageUrl } from "../../../services/artApi";
import type { Artwork } from "../../../types/artwork";

import NotFound from "../../components/Error";

const DEFAULT_ARTWORK_ID = 129884;

export default function ArtworkPage() {
    const { id } = useParams();
    const artworkId = Number(id ?? DEFAULT_ARTWORK_ID);
    const isValidArtworkId = !Number.isNaN(artworkId);

    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isValidArtworkId) {
            return;
        }

        let isMounted = true;

        const loadArtwork = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getArtworkById(artworkId);

                if (isMounted) {
                    setArtwork(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "No se pudo cargar la obra.",
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadArtwork();

        return () => {
            isMounted = false;
        };
    }, [artworkId, isValidArtworkId]);


    if (!isValidArtworkId || error) {
        return (
            <NotFound title="Obra No Encontrada" text="La obra que buscabas no fue encontrada." />
        );
    }

    if (loading) {
        return (
            <Skeleton />
        );
    }

    if (!artwork) {
        return null;
    }

    const imageUrl = getArtworkImageUrl(artwork.image_id);

    return (
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 p-8 md:justify-center md:p-0">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={artwork.title}
                    className="w-full rounded-2xl object-cover"
                />
            ) : null}

            <section className="space-y-4">
                <h1 className="text-3xl font-semibold">{artwork.title}</h1>

                <div className="space-y-2 text-lg">
                    <p>
                        <span className="font-semibold">Artista:</span>{" "}
                        {artwork.artist_title ?? "Sin información"}
                    </p>
                    <p>
                        <span className="font-semibold">Fecha:</span>{" "}
                        {artwork.date_display ?? "Sin información"}
                    </p>
                    <p>
                        <span className="font-semibold">Técnica:</span>{" "}
                        {artwork.medium_display ?? "Sin información"}
                    </p>
                    <p>
                        <span className="font-semibold">ID:</span> {artwork.id}
                    </p>
                </div>
            </section>
        </main>
    );
}

function Skeleton() {
    return(
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 p-8 md:justify-center md:p-0">
            <div className="h-100 w-full animate-pulse rounded-2xl bg-gray-300/10" />
    
            <section className="space-y-4">
                <div className="h-8 w-1/2 animate-pulse rounded bg-gray-300/10" />
                <div className="space-y-2 text-lg">
                    <div className="h-6 w-full animate-pulse rounded bg-gray-300/10" />
                    <div className="h-6 w-full animate-pulse rounded bg-gray-300/10" />
                    <div className="h-6 w-full animate-pulse rounded bg-gray-300/10" />
                    <div className="h-6 w-full animate-pulse rounded bg-gray-300/10" />
                </div>
            </section>
        </main>
    )
};