export interface Review {
    id: number;
    text: string;
    rating: number;
    userId?: number;
    userName?: string;
}