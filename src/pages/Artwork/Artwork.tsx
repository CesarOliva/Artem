import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, Image, Share } from "lucide-react";

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
                                src={'/Images/bento.png'}
                                alt={artwork.title}
                                className={`bg-neutral-900 block w-full object-contain transition-all duration-300 ${isImageExpanded ? "h-[80vh]" : "aspect-4/5"}`}
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
                            src="/Images/bento.png"
                            alt="Imagen no disponible"
                            className="bg-neutral-900 w-full rounded-2xl object-cover"
                        />
                    )}

                    <section>
                        <span className="text-neutral-300 mb-2 block">{artwork.artwork_type_title ?? "Tipo de Obra Desconocido"}</span>
                        <h1 className="text-5xl font-semibold font-italic mb-4">{artwork.title}</h1>

                        <h2 className="text-xl font-light mb-2">{artwork.artist_title ?? "Autor Desconocido"}</h2>
                        <h3 className="text-lg font-light">{artwork.date_display ?? "Fecha Desconocida"}</h3>

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
                                    <td className="text-left w-1/2">{artwork.date_display ?? "Sin Información"}</td>
                                </tr>
                                <tr>
                                    <td className="text-left text-neutral-300 font-light w-1/2">Técnica</td>
                                    <td className="text-left w-1/2">{artwork.medium_display ?? "Sin Información"}</td>
                                </tr>
                                <tr>
                                    <td className="text-left text-neutral-300 font-light w-1/2">Dimensiones</td>
                                    <td className="text-left w-1/2">{artwork.dimensions ?? "Sin Información"}</td>
                                </tr>
                                <tr>
                                    <td className="text-left text-neutral-300 font-light w-1/2">Estilo</td>
                                    <td className="text-left w-1/2">{artwork.style_title ?? "Sin Información"}</td>
                                </tr>
                                <tr>
                                    <td className="text-left text-neutral-300 font-light w-1/2">Ubicación</td>
                                    <td className="text-left w-1/2">{artwork.gallery_title ?? "Sin Información"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>

                <div className="border-y border-neutral-800 py-8">
                    <h2 className="text-3xl font-italic">Acerca de la obra</h2>
                    <p className="text-lg text-neutral-300 mt-2">{artwork.medium_display ?? "Sin Información"}</p>
                </div>

                <div>
                    <h2 className="text-3xl font-italic">Más obras del artista</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                        <div className="rounded-xl bg-neutral-900 cursor-pointer transition-colors duration-300">
                            {/* <img className="w-full h-full object-cover rounded-xl aspect-video" src={'artwork.image_url'} alt={artwork.title} /> */}

                            <div className="p-2">
                                <h3 className="font-medium mt-2">{artwork.title ?? "Sin Información"}</h3>
                                <h4 className="text-neutral-300">{artwork.artist_title ?? "Sin Información"}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

function Skeleton() {
    return(
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 p-8 md:justify-center md:p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-neutral-900 w-full rounded-2xl aspect-4/5 animate-pulse" />
                <section>
                    <span className="bg-neutral-900 w-32 h-6 block mb-2 animate-pulse" />
                    <h1 className="bg-neutral-900 w-full h-12 mb-4 animate-pulse" />

                    <h2 className="bg-neutral-900 w-48 h-6 mb-2 animate-pulse" />
                    <h3 className="bg-neutral-900 w-32 h-5 animate-pulse" />

                    <div className="border-y border-neutral-800 py-6 px-2 grid grid-cols-2 gap-4 my-6">
                        <div className="bg-neutral-900 w-full h-8 animate-pulse" />
                        <div className="bg-neutral-900 w-full h-8 animate-pulse" />
                    </div>

                    <table className="border-separate border-spacing-2">
                        <tbody>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                            </tr>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                            </tr>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                            </tr>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                            </tr>
                            <tr>
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                                <td className="bg-neutral-900 w-1/2 h-6 animate-pulse" />
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </main>
    )
};