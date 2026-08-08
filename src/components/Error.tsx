import { ArrowRight} from 'lucide-react'
import { Link } from 'react-router-dom';

const NotFound = (
    { title, text }: { title: string, text: string }
) => {
    return (
        <main className="flex min-h-screen flex-col items-center md:justify-center max-w-300 mx-auto">
            <img src="/Images/bento.png" alt="Explora Artem" className="md:max-w-100 max-h-[60vh] mb-8 md:mb-6" />

            <h1 className="text-5xl mb-4 font-italic text-center px-4 md:px-0">{title}</h1>
            <p className="text-xl text-center px-4 md:px-0">{text}</p>
            <Link to="/" className="mt-6 px-6 py-3 text-white rounded-xl border border-[#fafafa] transition-colors duration-300 flex items-center cursor-pointer">Volver al inicio <ArrowRight className="ml-2 inline-block"/></Link>
        </main>
    );
}
 
export default NotFound;