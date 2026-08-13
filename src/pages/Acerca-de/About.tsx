import { BriefcaseBusiness, GitBranch, Globe, SquareArrowUpRight } from "lucide-react";

const About = () => {
    return (
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-8 md:justify-center mt-4 md:mt-12 mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-neutral-800 flex items-center">
                <div className="order-1 md:order-0 flex flex-col justify-center">
                    <span className="text-neutral-300 mb-2 block">ACERCA DE</span>

                    <h1 className="font-italic text-5xl mb-4">Sobre Artem.</h1>
                    <p className="text-lg mb-2">Artem es un proyecto personal creado por pasión por el arte, la programación y el aprendizaje.</p>
                    <p className="text-lg text-neutral-400">El objetivo de este sitio es acercar el arte a más personas, permitiendo explorar miles de obras increibles de forma simple, elegante e inspiradora. <br/>
                        Todas las obras e información provienen de la colección del Museo Metropolitano de Arte mediante su API pública.
                    </p>
                    <a href="https://www.metmuseum.org/es/art/collection" target="_blank" rel="noopener noreferrer" className="mt-4 w-fit justify-center flex items-center gap-2 border border-neutral-300/20 rounded-lg px-4 py-2 text-neutral-400">
                        Ver colección completa
                        <SquareArrowUpRight className="size-6"/>
                    </a>
                </div>

                <div className="order-0 md:order-1 w-full bg-neutral-900 h-80 group rounded-2xl shadow-xl">
                    <div className="flex items-center h-full">
                        <img
                            src='/Images/Destacada2.webp'
                            alt='Stary Night Over the Rhône by Vincent Van Gogh'
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 rounded-2xl"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="border-b md:border-b-0 border-r-0 md:border-r border-neutral-800 pb-8 md:pb-0 px-0 ">
                    <p className="text-2xl font-italic text-center md:text-start mb-4">Tecnologías utilizadas:</p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <img loading="lazy" src="/react.svg" alt="React" className="size-8 object-contain"/>
                            <p className="text-lg font-semibold text-start">React</p>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <img loading="lazy" src="/typescript.svg" alt="TypeScript" className="size-8 object-contain"/>
                            <p className="text-lg font-semibold text-start">TypeScript</p>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <img loading="lazy" src="/vite.svg" alt="Vite" className="size-8 object-contain"/>
                            <p className="text-lg font-semibold text-start">Vite</p>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <img loading="lazy" src="/tailwind.svg" alt="Tailwind CSS" className="size-8 object-contain"/>
                            <p className="text-lg font-semibold text-start">Tailwind CSS</p>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <img loading="lazy" src="/react-router.svg" alt="React Router" className="size-8 object-contain"/>
                            <p className="text-lg font-semibold text-start">React Router</p>
                        </div>
                    </div>
                </div>
                <div className="py-4 md:py-0 px-0 md:px-8">
                    <p className="text-2xl font-italic mb-4">Sobre el autor:</p>
                    <p className="mb-2">Hola! Soy Cesar, desarrollador web enfocado en frontend. Me encanta crear experiencias digitales que sean tanto funcionales como visualmente atractivas.</p>
                    <p className="text-neutral-400">Si quieres conocer más sobre mi trabajo, puedes visitar mi perfil de GitHub, LinkedIn o mi portafolio.</p>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <a href="https://bycesaroliva.com" target="_blank" rel="noopener noreferrer" className="w-fit justify-center flex items-center gap-2 border border-neutral-300/20 rounded-lg px-4 py-2 text-neutral-400">
                            <Globe className="size-5"/>
                            Portafolio
                        </a>
                        <a href="https://github.com/cesaroliva" target="_blank" rel="noopener noreferrer" className="w-fit justify-center flex items-center gap-2 border border-neutral-300/20 rounded-lg px-4 py-2 text-neutral-400">
                            <GitBranch className="size-5"/>
                            GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/olivavc" target="_blank" rel="noopener noreferrer" className="w-fit justify-center flex items-center gap-2 border border-neutral-300/20 rounded-lg px-4 py-2 text-neutral-400">
                            <BriefcaseBusiness className="size-5"/>
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
 
export default About;