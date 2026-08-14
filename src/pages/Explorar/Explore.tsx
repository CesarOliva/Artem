import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Search, X } from "lucide-react";
import { Card, SkeletonCard } from "../../components/Card";
import { searchArtworksWithFilters } from "../../../services/artApi";
import type { CardType } from "../../../types/card";

const CATEGORIES = ["Pintura", "Escultura", "Fotografía", "Dibujo / Acuarela", "Artes decorativas"];
const SORTS = [
    { label: "Más relevantes", value: "relevance" },
    { label: "Más antiguas", value: "oldest" },
    { label: "Más recientes", value: "newest" },
];

const Explore = () => {
    const location = useLocation();
    const searchParam = useMemo(() => new URLSearchParams(location.search).get("search") ?? "", [location.search]);
    const [query, setQuery] = useState(searchParam);

    useEffect(() => {
        setQuery(searchParam);
    }, [searchParam]);

    const [category, setCategory] = useState("");
    const [artist, setArtist] = useState("");
    const [publicDomain, setPublicDomain] = useState(true);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [sortBy, setSortBy] = useState("relevance");
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [total, setTotal] = useState(0);
    const [artworks, setArtworks] = useState<CardType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await searchArtworksWithFilters({
                    query,
                    classification: category || undefined,
                    artist: artist || undefined,
                    isPublicDomain: publicDomain,
                    hasImages: true,
                    dateBegin: dateFrom ? Number(dateFrom) : null,
                    dateEnd: dateTo ? Number(dateTo) : null,
                    page,
                    limit,
                });

                if (!active || controller.signal.aborted) return;

                const nextArtworks = result.artworks.map((artwork) => ({
                    id: artwork.objectID,
                    image: artwork.primaryImageSmall || artwork.primaryImage || "/Images/NotFound.webp",
                    title: artwork.title,
                    author: artwork.artistDisplayName || "Autor desconocido",
                    year: artwork.objectDate || "Fecha desconocida",
                    technique: artwork.medium,
                }));

                if (sortBy === "oldest") {
                    nextArtworks.sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year));
                }

                if (sortBy === "newest") {
                    nextArtworks.sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year));
                }

                setArtworks(nextArtworks);
                setTotal(result.total);
            } catch (err) {
                if (!active || controller.signal.aborted) return;
                setError(err instanceof Error ? err.message : "No se pudieron cargar las obras");
                setArtworks([]);
            } finally {
                if (active && !controller.signal.aborted) setLoading(false);
            }
        }, 300);

        return () => {
            active = false;
            controller.abort();
            clearTimeout(timer);
        };
    }, [query, category, artist, publicDomain, dateFrom, dateTo, page, limit, sortBy]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const activeFilters = useMemo(() => {
        const filters = [];
        if (publicDomain) filters.push("Dominio público");
        if (category) filters.push(category);
        if (query) filters.push(query);
        if (artist) filters.push(artist);
        return filters;
    }, [publicDomain, category, query, artist]);

    const clearFilters = () => {
        setQuery("");
        setCategory("");
        setArtist("");
        setPublicDomain(true);
        setDateFrom("");
        setDateTo("");
        setSortBy("relevance");
        setPage(1);
    };

    return (
        <main className="min-h-[calc(100vh-96px)] overflow-x-hidden bg-neutral-950 text-neutral-100">
            <div className="grid min-h-[calc(100vh-96px)] w-full min-w-0 lg:grid-cols-[330px_1fr]">
                <aside className="aside-scroll min-w-0 border-r border-white/10 px-6">
                {/* <aside className="aside-scroll min-w-0 border-r border-white/10 px-6 lg:sticky lg:top-0 lg:h-[calc(100vh-96px)] lg:overflow-y-auto"> */}
                    <div className="space-y-6 py-8">
                        <div className="space-y-1">
                            <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">Filtros</span>
                            <h2 className="text-2xl font-semibold">Explorar obras</h2>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="search" className="block text-sm text-neutral-300">Buscar</label>
                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                <Search className="size-4 shrink-0 text-neutral-400" />
                                <input
                                    id="search"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
                                    placeholder="Busca obras, artistas, temas..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm text-neutral-300">Categoría</label>
                            <div className="space-y-2">
                                <button type="button" onClick={() => { setCategory(""); setPage(1); }} className={`flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left text-sm cursor-pointer ${!category ? "text-white" : "text-neutral-400"}`}>
                                    <span className={`size-4 rounded-full border ${!category ? "border-white" : "border-neutral-500"}`}><span className={`block size-2.5 rounded-full bg-white ${!category ? "m-0.5" : "hidden"}`} /></span>
                                    Todas las categorías
                                </button>
                                {CATEGORIES.map((item) => (
                                    <button key={item} type="button" onClick={() => { setCategory(item); setPage(1); }} className={`flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left text-sm cursor-pointer ${category === item ? "text-white" : "text-neutral-400"}`}>
                                        <span className={`size-4 rounded-full border ${category === item ? "border-white" : "border-neutral-500"}`}><span className={`block size-2.5 rounded-full bg-white ${category === item ? "m-0.5" : "hidden"}`} /></span>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="artist" className="block text-sm text-neutral-300">Artista</label>
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                <input
                                    id="artist"
                                    value={artist}
                                    onChange={(e) => { setArtist(e.target.value); setPage(1); }}
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
                                    placeholder="Todos los artistas"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm text-neutral-300">
                                Dominio público
                            </label>
                            <button
                                type="button"
                                onClick={() => { setPublicDomain((current) => !current); setPage(1); }}
                                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm cursor-pointer transition-colors ${publicDomain ? "border-white/20 bg-white/5" : "border-white/10 bg-white/0 text-neutral-400"}`}
                            >
                                <span className="break-all">Solo obras en dominio público</span>
                                <span className={`h-4 w-4 shrink-0 rounded-sm border ${publicDomain ? "border-white bg-white" : "border-neutral-500"}`} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm text-neutral-300">Fecha</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="number"
                                    value={dateFrom}
                                    onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-neutral-500"
                                    placeholder="Desde"
                                />
                                <input
                                    type="number"
                                    value={dateTo}
                                    onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-neutral-500"
                                    placeholder="Hasta"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm text-neutral-300">Ordenar por</label>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                                    className="w-full appearance-none rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none cursor-pointer"
                                >
                                    {SORTS.map((sort) => (
                                        <option className="bg-neutral-900 text-neutral-100 cursor-pointer" key={sort.value} value={sort.value}>{sort.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10 cursor-pointer"
                        >
                            <RotateCcw className="size-4" />
                            Limpiar filtros
                        </button>
                    </div>
                </aside>

                <section className="min-w-0 px-6 py-8 lg:px-10">
                    <div className="mx-auto min-w-0 max-w-7xl space-y-6">
                        <header className="space-y-4 border-b border-white/10 pb-6">
                            <div className="max-w-3xl space-y-3">
                                <h1 className="font-italic text-4xl sm:text-5xl">Explorar obras</h1>
                                <p className="text-lg text-neutral-300">Descubre miles de obras de la colección del Museo Metropolitano de Arte de Nueva York con filtros rápidos y navegación simple.</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {activeFilters.map((filter) => (
                                    <span key={filter} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200">
                                        {filter}
                                        <button type="button" className="text-neutral-400">
                                            <X className="size-4" />
                                        </button>
                                    </span>
                                ))}
                                {(activeFilters.length > 0) && (
                                    <button type="button" onClick={clearFilters} className="text-sm text-neutral-300 underline-offset-4 hover:underline cursor-pointer ">
                                        Limpiar todo
                                    </button>
                                )}
                            </div>
                        </header>

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm text-neutral-300">
                                {loading ? "Buscando obras..." : `${total.toLocaleString("es-MX")} resultados`}
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                    {SORTS.find((sort) => sort.value === sortBy)?.label}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                                {error}
                            </div>
                        )}

                        <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {loading
                                ? Array.from({ length: limit }).map((_, index) => <SkeletonCard key={index} />)
                                : artworks.map((artwork) => <Card key={artwork.id} {...artwork} />)}
                        </div>

                        {!loading && artworks.length === 0 && !error && (
                            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center text-neutral-300">
                                No encontramos obras con esos filtros.
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer "
                            >
                                <ChevronLeft className="size-4" />
                                Anterior
                            </button>

                            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                Página {page} de {totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={page >= totalPages}
                                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer "
                            >
                                Siguiente
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Explore;