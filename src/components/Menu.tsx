import { Link } from "react-router-dom";

const Menu = () => {
    return (
        <header className="sticky top-0 w-full p-8 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto bg-[#0d0d0d] z-10">
            <h2 className="font-italic text-4xl md:text-3xl mb-4 md:mb-0">Artem</h2>

            <ul className="text-lg flex gap-4">
                <li><Link to='/'>Explorar</Link></li>
                <li><Link to='/'>Favoritos</Link></li>
                <li><Link to='/'>Acerca de</Link></li>
            </ul>
        </header>
    );
}
 
export default Menu;