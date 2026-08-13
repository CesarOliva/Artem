import type { CardType } from "../types/card";
import type { Artwork } from "../types/artwork";

const FAVORITES_STORAGE_KEY = "artem-favorites";

export function readFavorites(): CardType[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
        return stored ? (JSON.parse(stored) as CardType[]) : [];
    } catch {
        return [];
    }
}

export function writeFavorites(favorites: CardType[]) {
    try {
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
        // ignore
    }
}

export function getFavoriteCards(): CardType[] {
    return readFavorites();
}

export async function getFavoriteArtworks(): Promise<Artwork[]> {
    const favorites = readFavorites();

    const artworks: Artwork[] = favorites.map((favorite) => ({
        objectID: favorite.id,
        title: favorite.title,
        artistDisplayName: favorite.author,
        objectDate: favorite.year,
        medium: null,
        classification: favorite.technique,
        dimensions: null,
        repository: null,
        department: null,
        creditLine: null,
        primaryImage: favorite.image,
        primaryImageSmall: favorite.image,
    }));

    return artworks;
}
