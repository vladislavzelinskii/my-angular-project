import { ProductInCart } from "./productInCart";

export interface Cart {
    id: number;
    totalPrice: number;
    userId: number;
    productsInCart: ProductInCart[];
}