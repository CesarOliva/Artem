import { NavLink } from "react-router-dom";

const Menu = () => {
    return (
        <header className="sticky top-0 w-full p-8 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto bg-[#0d0d0d] z-10">
            <NavLink to='/'>
                <h2 className="font-italic text-4xl md:text-3xl mb-4 md:mb-0">Artem</h2>
            </NavLink>

            <ul className="text-lg flex gap-4">
                <li>
                    <NavLink 
                        to='/artwork' 
                        className={({ isActive }) => 
                            isActive ? 'text-[#fafafa]' : 'text-neutral-400 hover:text-[#fafafa]'
                        }
                    >
                        Explorar
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to='/favoritos' 
                        className={({ isActive }) => 
                            isActive ? 'text-[#fafafa]' : 'text-neutral-400 hover:text-[#fafafa]'
                        }
                    >
                        Favoritos
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to='/acerca-de' 
                        className={({ isActive }) => 
                            isActive ? 'text-[#fafafa]' : 'text-neutral-400 hover:text-[#fafafa]'
                        }
                    >
                        Acerca de
                    </NavLink>
                </li>
            </ul>
        </header>
    );
}
 
export default Menu;