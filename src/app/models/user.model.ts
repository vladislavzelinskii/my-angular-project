
import { BankCard } from "./bankCard";

export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    phone?: string;
    address?: {
        city?: string;
        country?: string;
        flat?: number;
        house?: number;
        index?: number;
        street?: string;
    };
    bankCards?: BankCard[];
}