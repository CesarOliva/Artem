import type { Artwork } from "../types/artwork";

export async function getArtworkById(id: number): Promise<Artwork> {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);

    if (!response.ok) {
        throw new Error(`No se pudo obtener la obra (${response.status})`);
    }

    const json: Artwork = await response.json();

    return {
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
}

export async function getArtworksByArtist(artistName: string): Promise<Artwork[]> {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${artistName}`);
    
    if (!response.ok) {
        throw new Error(`No se pudo obtener las obras del artista (${response.status})`);
    }
    
    const json = await response.json();
    const objectIDs: number[] = json.objectIDs || [];

    const artworks: Artwork[] = [];
    
    for (const objectID of objectIDs) {
        if(artworks.length >= 4) break; // Limitar a 4 obras

        try {
            const artwork = await getArtworkById(objectID);
            artworks.push(artwork);
        } catch (error) {
            console.error(`Error al obtener la obra con ID ${objectID}:`, error);
        }
    }

    return artworks;
}

export function getArtworkImageUrl(imageUrl: string | null) {
    if (!imageUrl) return null;

    return imageUrl;
}
