import { Search } from "lucide-react";
import { Featured } from "../../components/Featured";
import { getArtworksByArtist } from "../../../services/artApi";

const HomePage = () => {
    return (
        <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 p-8 md:justify-center md:p-0 mt-4 md:mt-12 mb-24">
            <div className="grid grid-cols-8 gap-8 pb-8">
                <div className="order-1 md:order-0 col-span-8 md:col-span-3 flex flex-col justify-center">
                    <h1 className="font-italic text-5xl mb-4">Descubre arte que inspira.</h1>
                    <p className="text-lg">Explora obras del Museo Metropolitano de Arte de Nueva York y vive el arte de una nueva manera.</p>

                    <div className="border border-neutral-800 rounded-md bg-neutral-900/30 p-3 flex items-center gap-4 mt-6">
                        <Search className="size-6"/>
                        <input type="text" name="search" id="search" className="w-full focus:ring-0 focus:outline-none" placeholder="Busca obras, artistas, temas..."/>
                    </div>
                </div>

                <div className="order-0 md:order-1 col-span-8 md:col-span-5 w-full bg-neutral-900 h-80 group relative overflow-hidden rounded-2xl shadow-xl">
                    <img
                        src='/Images/Destacada.webp'
                        alt='Wheat Field with cypresses'
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10"></div>

                    <div className="absolute bottom-0 left-0 p-6 md:p-4">
                        <h3 className="mt-2 text-2xl font-semibold text-white font-italic">Wheat Field with Cypresses</h3>
                        <p>Vincent Van Gogh, 1889</p>
                    </div>
                </div>
            </div>

            <Featured title="Obras destacadas" fetchArtworks={() => getArtworksByArtist('Picasso')}/>

            <Featured title="Favoritos" fetchArtworks={() => getArtworksByArtist('Diego Rivera')}/>
        </main>
    );
}
 
export default HomePage;