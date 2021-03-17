export interface Product {
    id: number;
    name: string;
    image?: string;
    shortDescription?: string;
    longDescription?: string;
    price: number;
    category: string;
    screenSize?: number;
    screenResolution?: number;
    systemMemory?: number;
    yearIntroduced?: number;
    processorModel?: string;
    processorCores?: number;
    processorBaseFrequency?: number;
    storageType?: string;
    totalStorageCapacity?: number;
    casingMaterial?: string;
}
