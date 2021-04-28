import { BankCard } from "./bankCard";
import { Address } from "./address";

export interface User {
    userId: string;
    email: string;
    name?: string;
    password?: string;
    surname?: string;
    username?: string;
    phone?: number;
    address: {
        city: string;
        country: string;
        flat: number;
        house: number;
        index: number;
        street: string;
    };
    bankCards?: BankCard[];
}