import { Address } from "./address";
import { BankCard } from "./bankCard";

export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    phone?: string;
    address?: Address;
    bankCards?: BankCard[];
    purchaseHistory?: any;
}