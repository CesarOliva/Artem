export interface Artwork {
    objectID: number;
    title: string;
    artistDisplayName: string | null;
    objectDate: string | null;
    medium: string | null;
    classification: string | null;
    dimensions: string | null;
    creditLine: string | null;
    repository: string | null;
    department: string | null;
    primaryImage: string | null;
    primaryImageSmall: string | null;
}