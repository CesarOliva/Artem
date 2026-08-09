export const Card = (
    { id, image, title, data }:
    { id: number; image: string; title: string; data: string }
) => {
    return (
        <div className="rounded-xl bg-neutral-900 cursor-pointer transition-colors duration-300">
            <img className="w-full object-cover rounded-t-xl h-48" src={image} alt={title} />

            <div className="px-2 py-4">
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-neutral-400">{data}</p>
            </div>
        </div>
    );
}

export const SkeletonCard = () => {
    return (
        <div className="rounded-xl bg-neutral-900 overflow-hidden">
            <div className="aspect-video w-full animate-pulse bg-neutral-800" />
            <div className="px-2 py-4 space-y-3">
                <div className="h-5 w-5/6 animate-pulse rounded-md bg-neutral-800" />
                <div className="h-4 w-2/3 animate-pulse rounded-md bg-neutral-800" />
            </div>
        </div>
    )
};