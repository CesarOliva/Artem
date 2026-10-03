import type { Artwork } from "../types/artwork";

const API_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

// Simple in-memory cache with TTL
const CACHE_TTL_MS = 1000 * 60 * 5;
type CacheEntry = { expiry: number; value: any };
const cache = new Map<string, CacheEntry>();

function getFromCache<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
        cache.delete(key);
        return null;
    }
    return entry.value as T;
}

function setCache<T>(key: string, value: T, ttl = CACHE_TTL_MS) {
    cache.set(key, { value, expiry: Date.now() + ttl });
}

export async function getArtworkById(id: number): Promise<Artwork> {
    const cacheKey = `object:${id}`;
    const cached = getFromCache<Artwork>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${API_BASE}/objects/${id}`);

    if (!response.ok) {
        throw new Error(`No se pudo obtener la obra (${response.status})`);
    }

    const json: Artwork = await response.json();

    const artwork: Artwork = {
        objectID: json.objectID,
        title: json.title,
        artistDisplayName: json.artistDisplayName || null,
        objectDate: json.objectDate || null,
        medium: json.medium || null,
        classification: json.classification || null,
        dimensions: json.dimensions || null,
        repository: json.repository || null,
        department: json.department || null,
        creditLine: json.creditLine || null,
        primaryImage: json.primaryImage || null,
        primaryImageSmall: json.primaryImageSmall || null,
    };

    setCache(cacheKey, artwork);
    return artwork;
}

async function fetchObjectIDs(searchUrl: string): Promise<number[]> {
    const response = await fetch(searchUrl);

    if (!response.ok) throw new Error(`Search request failed (${response.status})`);

    const json = await response.json();
    return json.objectIDs || [];
}

type SearchResult = {
    total: number;
    objectIDs: number[];
};

async function fetchSearchResult(searchUrl: string): Promise<SearchResult> {
    const response = await fetch(searchUrl);

    if (!response.ok) throw new Error(`Search request failed (${response.status})`);

    const json = await response.json();
    return {
        total: json.total || 0,
        objectIDs: json.objectIDs || [],
    };
}

async function fetchFirstNObjectsFromSearchUrl(searchUrl: string, n = 4): Promise<Artwork[]> {
    const cacheKey = `search:${searchUrl}:n:${n}`;
    const cached = getFromCache<Artwork[]>(cacheKey);
    if (cached) return cached;

    const objectIDs = await fetchObjectIDs(searchUrl);
    const ids = objectIDs.slice(0, n);

    // Fetch artworks in parallel for performance
    const promises = ids.map((id) => getArtworkById(id));
    const results = await Promise.allSettled(promises);

    const artworks = results
        .filter((r): r is PromiseFulfilledResult<Artwork> => r.status === "fulfilled")
        .map((r) => r.value);

    setCache(cacheKey, artworks);
    return artworks;
}

export function getArtworkImageUrl(imageUrl: string | null) {
    if (!imageUrl) return null;
    return imageUrl;
}

export async function getArtworksByArtist(artistName: string): Promise<Artwork[]> {
    const q = encodeURIComponent(artistName);
    const url = `${API_BASE}/search?q=${q}`;
    return fetchFirstNObjectsFromSearchUrl(url, 4);
}

export async function getHighlights(): Promise<Artwork[]> {
    const url = `${API_BASE}/search?q=&isHighlight=true`;
    return fetchFirstNObjectsFromSearchUrl(url, 4);
}

export async function getArtworksByClassification(query: string): Promise<Artwork[]> {
    const url = `${API_BASE}/search?q=&medium=${encodeURIComponent(query)}`;
    return fetchFirstNObjectsFromSearchUrl(url, 4);
}

export async function getPublicDomainArtworks(): Promise<Artwork[]> {
    const url = `${API_BASE}/search?q=&hasImages=true&isPublicDomain=true`;
    return fetchFirstNObjectsFromSearchUrl(url, 4);
}

export async function getArtworksWithImages(): Promise<Artwork[]> {
    const url = `${API_BASE}/search?q=&hasImages=true`;
    return fetchFirstNObjectsFromSearchUrl(url, 4);
}

export async function getArtworksByDate(start: string, end: string): Promise<Artwork[]> {
    const url = `${API_BASE}/search?q=&hasImages=true&dateBegin=${encodeURIComponent(start)}&dateEnd=${encodeURIComponent(end)}`;
    return fetchFirstNObjectsFromSearchUrl(url, 4);
}

export async function searchArtworks(query: string): Promise<Artwork[]> {
    const url = `${API_BASE}/search?q=${encodeURIComponent(query)}`;
    return fetchFirstNObjectsFromSearchUrl(url, 4);
}

export type ArtworkSearchFilters = {
    query?: string;
    classification?: string;
    artist?: string;
    isPublicDomain?: boolean;
    hasImages?: boolean;
    dateBegin?: number | null;
    dateEnd?: number | null;
    page?: number;
    limit?: number;
};

export async function searchArtworksWithFilters(filters: ArtworkSearchFilters): Promise<{ artworks: Artwork[]; total: number }> {
    const params = new URLSearchParams();
    params.set("q", filters.query ?? "");
    params.set("hasImages", String(filters.hasImages ?? true));

    if (filters.classification) params.set("classification", filters.classification);
    if (filters.artist) params.set("artistOrCulture", filters.artist);
    if (filters.isPublicDomain !== undefined) params.set("isPublicDomain", String(filters.isPublicDomain));
    if (filters.dateBegin !== undefined && filters.dateBegin !== null) params.set("dateBegin", String(filters.dateBegin));
    if (filters.dateEnd !== undefined && filters.dateEnd !== null) params.set("dateEnd", String(filters.dateEnd));

    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.max(1, filters.limit ?? 12);
    params.set("page", String(page));
    params.set("pageSize", String(limit));

    const url = `${API_BASE}/search?${params.toString()}`;
    const { total, objectIDs } = await fetchSearchResult(url);
    const ids = objectIDs.slice(0, limit);
    const artworks = await Promise.allSettled(ids.map((id) => getArtworkById(id)));

    return {
        total,
        artworks: artworks
            .filter((result): result is PromiseFulfilledResult<Artwork> => result.status === "fulfilled")
            .map((result) => result.value),
    };
}
