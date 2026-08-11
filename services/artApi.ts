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
        if(artworks.length >= 4) break;

        try {
            const artwork = await getArtworkById(objectID);
            artworks.push(artwork);
        } catch (error) {
            console.error(`Error al obtener la obra con ID ${objectID}:`, error);
        }
    }

    return artworks;
}

export async function getHighlights(): Promise<Artwork[]> {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=&isHighlight=true`);
    
    if (!response.ok) {
        throw new Error(`No se pudo obtener las obras del artista (${response.status})`);
    }
    
    const json = await response.json();
    const objectIDs: number[] = json.objectIDs || [];

    const artworks: Artwork[] = [];
    
    for (const objectID of objectIDs) {
        if(artworks.length >= 4) break;

        try {
            const artwork = await getArtworkById(objectID);
            artworks.push(artwork);
        } catch (error) {
            console.error(`Error al obtener la obra con ID ${objectID}:`, error);
        }
    }

    return artworks;
}

export async function getArworksByClassification(query: string): Promise<Artwork[]> {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=&medium=${query}`);
    
    if (!response.ok) {
        throw new Error(`No se pudo obtener las obras del artista (${response.status})`);
    }
    
    const json = await response.json();
    const objectIDs: number[] = json.objectIDs || [];

    const artworks: Artwork[] = [];
    
    for (const objectID of objectIDs) {
        if(artworks.length >= 4) break;

        try {
            const artwork = await getArtworkById(objectID);
            artworks.push(artwork);
        } catch (error) {
            console.error(`Error al obtener la obra con ID ${objectID}:`, error);
        }
    }

    return artworks;
}

export async function getPublicDomainArtworks(): Promise<Artwork[]> {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=&hasImages=true&isPublicDomain=true`);
    
    if (!response.ok) {
        throw new Error(`No se pudo obtener las obras del artista (${response.status})`);
    }
    
    const json = await response.json();
    const objectIDs: number[] = json.objectIDs || [];

    const artworks: Artwork[] = [];
    
    for (const objectID of objectIDs) {
        if(artworks.length >= 4) break;

        try {
            const artwork = await getArtworkById(objectID);
            artworks.push(artwork);
        } catch (error) {
            console.error(`Error al obtener la obra con ID ${objectID}:`, error);
        }
    }

    return artworks;
}

export async function getArtworksWithImages(): Promise<Artwork[]> {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=&hasImages=true`);
    
    if (!response.ok) {
        throw new Error(`No se pudo obtener las obras del artista (${response.status})`);
    }
    
    const json = await response.json();
    const objectIDs: number[] = json.objectIDs || [];

    const artworks: Artwork[] = [];
    
    for (const objectID of objectIDs) {
        if(artworks.length >= 4) break;

        try {
            const artwork = await getArtworkById(objectID);
            artworks.push(artwork);
        } catch (error) {
            console.error(`Error al obtener la obra con ID ${objectID}:`, error);
        }
    }

    return artworks;
}

export async function getArtworksByDate(start: string, end: string): Promise<Artwork[]> {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=&hasImages=true&dateBegin=${start}&dateEnd=${end}`);
    
    if (!response.ok) {
        throw new Error(`No se pudo obtener las obras del artista (${response.status})`);
    }
    
    const json = await response.json();
    const objectIDs: number[] = json.objectIDs || [];

    const artworks: Artwork[] = [];
    
    for (const objectID of objectIDs) {
        if(artworks.length >= 4) break;

        try {
            const artwork = await getArtworkById(objectID);
            artworks.push(artwork);
        } catch (error) {
            console.error(`Error al obtener la obra con ID ${objectID}:`, error);
        }
    }

    return artworks;
}

export async function searchArtworks(query: string): Promise<Artwork[]> {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`);
    
    if (!response.ok) {
        throw new Error(`No se pudo obtener las obras del artista (${response.status})`);
    }
    
    const json = await response.json();
    const objectIDs: number[] = json.objectIDs || [];

    const artworks: Artwork[] = [];
    
    for (const objectID of objectIDs) {
        if(artworks.length >= 4) break;

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
