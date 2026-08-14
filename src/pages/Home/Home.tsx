import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Featured } from "../../components/Featured";
import { getHighlights, getArtworksByClassification, getPublicDomainArtworks } from "../../../services/artApi";
import { getFavoriteArtworks } from "../../../services/favorites";

const HomePage = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const term = searchValue.trim();
        navigate(term ? `/artwork?search=${encodeURIComponent(term)}` : "/artwork");
    };

    return (
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-8 md:justify-center mt-4 md:mt-12 mb-24">
            <div className="grid grid-cols-8 gap-8 pb-8">
                <div className="order-1 md:order-0 col-span-8 md:col-span-3 flex flex-col justify-center">
                    <h1 className="font-italic text-5xl mb-4">Descubre arte que inspira.</h1>
                    <p className="text-lg text-neutral-300">Explora obras del Museo Metropolitano de Arte de Nueva York y vive el arte de una nueva manera.</p>

                    <form onSubmit={handleSearch} className="mt-6 flex items-center gap-4 rounded-md border border-neutral-800 bg-neutral-900/30 p-3">
                        <Search className="size-6"/>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            className="w-full bg-transparent focus:ring-0 focus:outline-none"
                            placeholder="Busca obras, artistas, temas..."
                        />
                    </form>
                </div>

                <div className="order-0 md:order-1 col-span-8 md:col-span-5 w-full bg-neutral-900 h-80 group relative overflow-hidden rounded-2xl shadow-xl">
                    <img
                        src='/Images/Destacada.webp'
                        alt='Wheat Field with cypresses'
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10"></div>

                    <div className="absolute bottom-0 left-0 p-6 md:p-4">
                        <h3 className="mt-2 text-2xl font-semibold text-white font-italic">Wheat Field with Cypresses</h3>
                        <p>Vincent Van Gogh, 1889</p>
                    </div>
                </div>
            </div>

            <Featured title="Obras destacadas" fetchArtworks={getHighlights} link="/artwork"/>
            <Featured title="Pinturas" fetchArtworks={() => getArtworksByClassification("Paintings")} link="/artwork"/>
            <Featured title="De Dominio publico" fetchArtworks={getPublicDomainArtworks} link="/artwork"/>
            <Featured title="Favoritas" fetchArtworks={getFavoriteArtworks} link="/favoritos"/>
        </main>
    );
}
 
export default HomePage;