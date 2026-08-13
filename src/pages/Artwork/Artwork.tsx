import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart, Image, Landmark, Share } from "lucide-react";

import { getArtworkById, getArtworkImageUrl, getArtworksByArtist } from "../../../services/artApi";
import type { Artwork } from "../../../types/artwork";
import type { CardType } from "../../../types/card";

import NotFound from "../../components/Error";
import { Featured, SkeletonFeatured } from "../../components/Featured";

const FAVORITES_STORAGE_KEY = "artem-favorites";

function readFavorites(): CardType[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

        return storedFavorites ? JSON.parse(storedFavorites) as CardType[] : [];
    } catch {
        return [];
    }
}

function writeFavorites(favorites: CardType[]) {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export default function ArtworkPage() {
    const { id } = useParams();
    const artworkId = Number(id);
    const isValidArtworkId = Number.isInteger(artworkId) && artworkId > 0;

    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const favoriteArtwork: CardType | null = artwork
        ? {
            id: artwork.objectID,
            image: getArtworkImageUrl(artwork.primaryImageSmall) ?? "/Images/NotFound.jpeg",
            title: artwork.title,
            author: artwork.artistDisplayName ?? "Artista Desconocido",
            year: artwork.objectDate ?? "Fecha Desconocida",
            technique: artwork.classification ?? null,
        }
        : null;

    const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!favoriteArtwork) {
            return;
        }

        const favorites = readFavorites();
        const exists = favorites.some((favorite) => favorite.id === favoriteArtwork.id);

        const nextFavorites = exists
            ? favorites.filter((favorite) => favorite.id !== favoriteArtwork.id)
            : [...favorites, favoriteArtwork];

        writeFavorites(nextFavorites);
        setIsFavorite(!exists);
    };

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

    useEffect(() => {
        if (!artwork) {
            return;
        }

        const favorites = readFavorites();

        setIsFavorite(favorites.some((favorite) => favorite.id === artwork.objectID));
    }, [artwork]);

    if (!isValidArtworkId) return ( <NotFound title="Obra No Encontrada" text="La obra que buscabas no fue encontrada." /> );

    if (error) return ( <NotFound title="Error al mostrar la obra" text="La obra que deseas ver no pudo ser cargada." /> );

    if (loading) return ( <Skeleton /> );

    if (!artwork) return null;

    const imageUrl = getArtworkImageUrl(artwork.primaryImage);
    const toggleImageExpanded = () => {
        if (!imageUrl) {
            return;
        }

        setIsImageExpanded((currentValue) => !currentValue);
    };

    return (
        <>
            <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-8 md:justify-center mt-4 md:mt-12 mb-24">
                <Link to="/" className="flex gap-2">
                    <ArrowLeft /> <span>Volver a explorar</span>
                </Link>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 pb-8">
                    {imageUrl ? (
                        <div className="space-y-3">
                            <img
                                src={imageUrl}
                                alt={artwork.title}
                                className={`rounded-2xl bg-neutral-900 block w-full object-contain transition-all duration-300 ${isImageExpanded ? "h-[80vh]" : "aspect-4/5"}`}
                            />
                            <button
                                type="button"
                                onClick={toggleImageExpanded}
                                className="rounded-lg hover:bg-neutral-800 flex items-center gap-2 p-2 cursor-pointer"
                            >
                                <Image className="size-6" />Ver en tamaño completo
                            </button>
                        </div>
                    ) : (
                        <img
                            src="/Images/NotFound.webp"
                            alt="Imagen no disponible"
                            className="bg-neutral-900 w-full rounded-2xl object-cover"
                        />
                    )}

                    <section>
                        <span className="text-neutral-300 mb-2 block">{artwork.classification ?? "Tipo de Obra No Especificado"}</span>
                        <h1 className="text-5xl font-semibold font-italic mb-4">{artwork.title}</h1>

                        <p className="text-xl font-light mb-2">{artwork.artistDisplayName ?? "Autor Desconocido"}</p>
                        <p className="text-lg font-light">{artwork.objectDate ?? "Fecha Desconocida"}</p>

                        <div className="border-y border-neutral-800 py-6 px-2 grid grid-cols-2 gap-4 my-6">
                            <div className="flex items-center gap-2 cursor-pointer group text-sm"> 
                                <button
                                    onClick={handleFavorite}
                                    className="group flex items-center gap-2 cursor-pointer group text-sm"
                                    aria-pressed={isFavorite}
                                    aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                                >
                                    <Heart className={`size-5 transition-colors duration-100 ${isFavorite ? "fill-red-700/80 text-red-700/80" : "text-neutral-300 group-hover:text-red-700/80"}`} />
                                    <p className="text-neutral-300">Favorito</p>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer group text-sm"> 
                                <Share className="size-5 text-neutral-300 group-hover:text-[#fafafa] transition-colors duration-100"/> <p className="text-neutral-300">Compartir</p>
                            </div>
                        </div>

                        <dl className='w-full space-y-2'>
                            <div className='w-full grid grid-cols-2'>
                                <dt className="text-left text-neutral-300 font-light w-full">Fecha</dt>
                                <dd className="text-left w-full">{artwork.objectDate ?? "Sin Información"}</dd>
                            </div>
                            <div className='w-full grid grid-cols-2'>
                                <dt className="text-left text-neutral-300 font-light w-full">Técnica</dt>
                                <dd className="text-left w-full">{artwork.medium ?? "Sin Información"}</dd>
                            </div>
                            <div className='w-full grid grid-cols-2'>
                                <dt className="text-left text-neutral-300 font-light w-full">Dimensiones</dt>
                                <dd className="text-left w-full">{artwork.dimensions ?? "Sin Información"}</dd>
                            </div>
                            <div className='w-full grid grid-cols-2'>
                                <dt className="text-left text-neutral-300 font-light w-full">Estilo</dt>
                                <dd className="text-left w-full">{artwork.classification ?? "Sin Información"}</dd>
                            </div>
                            <div className='w-full grid grid-cols-2'>
                                <dt className="text-left text-neutral-300 font-light w-full">Ubicación</dt>
                                <dd className="text-left w-full">{artwork.repository ?? "Sin Información"}</dd>
                            </div>
                        </dl>
                    </section>
                </div>

                {imageUrl && isImageExpanded ? (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Imagen en tamaño completo"
                        onClick={toggleImageExpanded}
                    >
                        <img
                            src={imageUrl}
                            alt={artwork.title}
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                        />
                    </div>
                ) : null}

                <div className="border-y border-neutral-800 py-8">
                    <h2 className="text-3xl font-italic">Acerca de la obra</h2>
                    <p className="text-lg text-neutral-300 mt-2">{artwork.creditLine ?? "Sin Información"}</p>
                </div>

                <Featured title="Más obras del artista" fetchArtworks={() => getArtworksByArtist(artwork.artistDisplayName || "")}/>

                <section className="flex flex-col md:flex-row justify-between gap-2 space-y-4 md:space-y-0 items-center bg-neutral-900/80 p-6 rounded-xl">
                    <div className="flex gap-2 items-center">
                        <Landmark className="size-7 mr-2 text-neutral-300"/>

                        <div className="flex flex-col">
                            <p>Ver esta obra en el museo</p>
                            <p className="text-sm text-neutral-400">Visita el sitio oficial del Museo Metropolitano de Arte para mas información.</p>
                        </div>
                    </div>

                    <a href={`https://www.metmuseum.org/es/art/collection/search/${artwork.objectID}`} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto justify-center flex items-center gap-2 border border-neutral-300/20 rounded-lg px-4 py-2 text-neutral-400">
                        Ir al sitio oficial
                        <ArrowRight className="size-4"/>
                    </a>
                </section>
            </main>
        </>
    );
}

function Skeleton() {
    return(
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 p-8 md:justify-center md:p-0 my-24">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 pb-8">
                <div className="space-y-3">
                    <div className="bg-neutral-900 w-full rounded-2xl aspect-4/5 animate-pulse" />
                    <div className="bg-neutral-900 w-52 h-10 rounded-lg animate-pulse" />
                </div>

                <section>
                    <span className="bg-neutral-900 w-32 h-6 block mb-2 animate-pulse" />
                    <h1 className="bg-neutral-900 w-full h-12 mb-4 animate-pulse rounded-md" />

                    <h2 className="bg-neutral-900 w-48 h-6 mb-2 animate-pulse rounded-md" />
                    <h3 className="bg-neutral-900 w-32 h-5 animate-pulse rounded-md" />

                    <div className="border-y border-neutral-800 py-6 px-2 grid grid-cols-2 gap-4 my-6">
                        <div className="bg-neutral-900 w-full h-8 animate-pulse rounded-md" />
                        <div className="bg-neutral-900 w-full h-8 animate-pulse rounded-md" />
                    </div>

                    <table className="border-separate border-spacing-2 w-full">
                        <tbody>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                            </tr>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                            </tr>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                            </tr>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                            </tr>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse rounded-md" />
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>

            <div className="border-t border-neutral-800 py-8">
                <SkeletonFeatured/>
            </div>
        </main>
    )
};