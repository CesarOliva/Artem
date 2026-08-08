import type { Artwork } from "../types/artwork";

interface ArtworkResponse {
    data: Artwork;
}
export async function getArtworkById(id: number): Promise<Artwork> {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,artist_title,date_display,medium_display,artwork_type_title,dimensions,style_title,gallery_title,image_id`);

    if (!response.ok) {
        throw new Error(`No se pudo obtener la obra (${response.status})`);
    }

    const json: ArtworkResponse = await response.json();
    return json.data;
}

export function getArtworkImageUrl(imageId: string | null, width = 843) {
    if (!imageId) return null;

    return `https://www.artic.edu/iiif/2/${imageId}/full/${width},/0/default.jpg`;
}
