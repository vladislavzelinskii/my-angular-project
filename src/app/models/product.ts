import { Review } from "./review";

export interface Product {
    id: number;
    name: string;
    image: string;
    imageBig?: string;
    shortDescription?: string;
    longDescription?: string;
    price: number;
    category: string;
    brand?: string;
    specs?: {};
    reviews?: Review[];
    country?: string;
    screenSize?: number;
    screenResolution?: string;
    systemMemory?: number;
    yearIntroduced?: number;
    processorModel?: string;
    processorCores?: number;
    processorBaseFrequency?: number;
    storageType?: string;
    totalStorageCapacity?: number;
    casingMaterial?: string;
}