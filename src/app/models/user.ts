import { BankCard } from "./bankCard";

export interface User {
    id: number;
    login: string;
    name: string;
    password: string;
    surname: string;
    username: string;
    phone: number;
    address: {
        city: string;
        country: string;
        flat: number;
        house: number;
        index: number;
        street: string;
    };
    bankCards: BankCard[];
}