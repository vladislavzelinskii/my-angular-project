import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'creditCardMask'
})

export class CreditCardMaskPipe implements PipeTransform {
    transform(plainCreditCard: number): string {
        return plainCreditCard.toString().replace(/^.{12}/g, '\*\*\*\*');
    }
}