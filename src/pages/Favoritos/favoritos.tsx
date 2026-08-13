import { SkeletonFeatured } from "../../components/Featured";
import { getFavoriteArtworks } from "../../../services/artApi";
import type { Artwork } from "../../../types/artwork";
import { useEffect, useState } from "react";

import { ArrowRight, Heart } from "lucide-react";
import { Card } from "../../components/Card";
import { Link } from "react-router-dom";

const Favoritos = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const loadArt = async () => {
            setLoading(true);

            try {
                setError(null);

                const data = await getFavoriteArtworks();
                setArtworks(data);
            } catch (err) {
                setError( err instanceof Error ? err.message : "No se pudieron cargar las obras.");
            } finally {
                setLoading(false);
            }
        };

        loadArt();
    }, []);

    if(loading) return (<SkeletonFeatured/>);

    if (error || artworks.length === 0) return null;
        
    return (
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-8 md:justify-center mt-4 md:mt-12 mb-24">
            <div>
                <h1 className="font-italic text-5xl mb-4">Mis favoritos.</h1>
                <p className="text-lg">Todas las obras que has marcado como favoritas.</p>
            </div>

            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
                    {artworks.map((artwork: Artwork) => (
                        <Card
                            key={artwork.objectID}
                            id={artwork.objectID}
                            image={artwork.primaryImageSmall ?? "/Images/NotFound.webp"}
                            title={artwork.title}
                            author={artwork.artistDisplayName ?? "Artista Desconocido"}
                            year={artwork.objectDate ?? "Fecha Desconocida"}
                            technique={artwork.classification ?? null}
                        />
                    ))}
                </div>
            </div>

            <section className="flex flex-col md:flex-row justify-between gap-2 space-y-4 md:space-y-0 items-center bg-neutral-900/80 p-6 rounded-xl">
                <div className="flex gap-2 items-center">
                    <Heart className="size-7 mr-2 text-neutral-300"/>

                    <div className="flex flex-col">
                        <p>¿Aún no tienes suficientes favoritos?</p>
                        <p className="text-sm text-neutral-400">Explora obras y guarda las que mas te inspiren.</p>
                    </div>
                </div>

                <Link to='/artwork' className="w-full md:w-auto justify-center flex items-center gap-2 border border-neutral-300/20 rounded-lg px-4 py-2 text-neutral-400">
                    Explorar obras
                    <ArrowRight className="size-4"/>
                </Link>
            </section>
        </main>
    );
}
 
export default Favoritos;