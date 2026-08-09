import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Heart, Image, Share } from "lucide-react";

import { getArtworkById, getArtworkImageUrl, getArtworksByArtist } from "../../../services/artApi";
import type { Artwork } from "../../../types/artwork";

import NotFound from "../../components/Error";

const DEFAULT_ARTWORK_ID = 436535;

export default function ArtworkPage() {
    const { id } = useParams();
    const artworkId = Number(id ?? DEFAULT_ARTWORK_ID);
    const isValidArtworkId = !Number.isNaN(artworkId);

    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [artworksByArtist, setArtworksByArtist] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingArtistWorks, setLoadingArtistWorks] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isImageExpanded, setIsImageExpanded] = useState(false);

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
        if (!isValidArtworkId) {
            return;
        }

        const loadArtFromArtist = async () => {
            setLoadingArtistWorks(true);

            if (!artwork?.artistDisplayName) {
                setArtworksByArtist([]);
                return;
            }

            try {
                setError(null);

                const artworksByArtist = await getArtworksByArtist(
                    artwork.artistDisplayName,
                );

                if (artworksByArtist.length > 0) {
                    setArtworksByArtist(artworksByArtist);
                } else {
                    setArtworksByArtist([]);
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudo cargar las obras del artista.",
                );
            } finally {
                setLoadingArtistWorks(false);
            }
        };

        void loadArtFromArtist();
    }, [artwork?.artistDisplayName, isValidArtworkId]);


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

    const imageUrl = getArtworkImageUrl(artwork.primaryImage);
    const toggleImageExpanded = () => {
        if (!imageUrl) {
            return;
        }

        setIsImageExpanded((currentValue) => !currentValue);
    };

    return (
        <>
            <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 p-8 md:justify-center md:p-0 my-24">
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
                            src="/Images/NotFound.jpeg"
                            alt="Imagen no disponible"
                            className="bg-neutral-900 w-full rounded-2xl object-cover"
                        />
                    )}

                    <section>
                        <span className="text-neutral-300 mb-2 block">{artwork.classification ?? "Tipo de Obra No Especificado"}</span>
                        <h1 className="text-5xl font-semibold font-italic mb-4">{artwork.title}</h1>

                        <h2 className="text-xl font-light mb-2">{artwork.artistDisplayName ?? "Autor Desconocido"}</h2>
                        <h3 className="text-lg font-light">{artwork.objectDate ?? "Fecha Desconocida"}</h3>

                        <div className="border-y border-neutral-800 py-6 px-2 grid grid-cols-2 gap-4 my-6">
                            <div className="flex items-center gap-2 cursor-pointer group text-sm"> 
                                <Heart className="size-5 text-neutral-300 group-hover:text-red-700/80 transition-colors duration-100"/> <p className="text-neutral-300">Guardar en favoritos</p>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer group text-sm"> 
                                <Share className="size-5 text-neutral-300 group-hover:text-[#fafafa] transition-colors duration-100"/> <p className="text-neutral-300">Compartir</p>
                            </div>
                        </div>

                        <table className="border-separate border-spacing-2">
                            <tbody>
                                <tr>
                                    <td className="text-left text-neutral-300 font-light w-1/2">Fecha</td>
                                    <td className="text-left w-1/2">{artwork.objectDate ?? "Sin Información"}</td>
                                </tr>
                                <tr>
                                    <td className="text-left text-neutral-300 font-light w-1/2">Técnica</td>
                                    <td className="text-left w-1/2">{artwork.medium ?? "Sin Información"}</td>
                                </tr>
                                <tr>
                                    <td className="text-left text-neutral-300 font-light w-1/2">Dimensiones</td>
                                    <td className="text-left w-1/2">{artwork.dimensions ?? "Sin Información"}</td>
                                </tr>
                                <tr>
                                    <td className="text-left text-neutral-300 font-light w-1/2">Estilo</td>
                                    <td className="text-left w-1/2">{artwork.classification ?? "Sin Información"}</td>
                                </tr>
                                <tr>
                                    <td className="text-left text-neutral-300 font-light w-1/2">Ubicación</td>
                                    <td className="text-left w-1/2">{artwork.repository ?? "Sin Información"}</td>
                                </tr>
                            </tbody>
                        </table>
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

                {loadingArtistWorks ? (
                    <div className="border-y border-neutral-800 py-8">
                        <div className="flex items-center justify-between gap-4">
                            <div className="bg-neutral-900 h-9 w-64 animate-pulse rounded-md" />
                            <div className="bg-neutral-900 h-6 w-28 animate-pulse rounded-md" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="rounded-xl bg-neutral-900 overflow-hidden">
                                    <div className="aspect-video w-full animate-pulse bg-neutral-800" />
                                    <div className="px-2 py-4 space-y-3">
                                        <div className="h-5 w-5/6 animate-pulse rounded-md bg-neutral-800" />
                                        <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {artworksByArtist.length > 0 && (
                            <div className="">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-italic">Más obras del artista</h2>
                                    <Link to='/' className="text-neutral-300 flex items-center cursor-pointer gap-2">Ver todas <ArrowRight className="size-5" /></Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                    {artworksByArtist.map((artwork) => (
                                        <div key={artwork.objectID} className="rounded-xl bg-neutral-900 cursor-pointer transition-colors duration-300">
                                            <img className="w-full object-cover rounded-t-xl h-48" src={artwork.primaryImage ? artwork.primaryImage : "/Images/NotFound.jpeg"} alt={artwork.title} />

                                            <div className="px-2 py-4">
                                                <h3 className="font-medium mb-2">{artwork.title}</h3>
                                                <h4 className="text-sm text-neutral-400">{artwork.objectDate}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
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
                <div className="flex items-center justify-between gap-4">
                    <div className="bg-neutral-900 h-9 w-64 animate-pulse rounded-md" />
                    <div className="bg-neutral-900 h-6 w-28 animate-pulse rounded-md" />
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-xl bg-neutral-900 overflow-hidden">
                            <div className="aspect-video w-full animate-pulse bg-neutral-800" />
                            <div className="px-2 py-4 space-y-3">
                                <div className="h-5 w-5/6 animate-pulse rounded-md bg-neutral-800" />
                                <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-800" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
};