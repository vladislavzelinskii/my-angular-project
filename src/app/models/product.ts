import { Review } from "./review";
import { Specs } from "./specs";

export interface Product {
    id: number;
    name: string;
    image: string;
    imageBig?: string;
    shortDescription?: string;
    price: number;
    category: string;
    brand?: string;
    country?: string;
    specs: Specs;
    reviews?: Review[];
    averageRating?: number;
}