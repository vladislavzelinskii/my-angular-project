import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'format'
})

export class FormatPipe implements PipeTransform {
    transform(value: string): string {
        value = value.replace(/([a-z])([A-Z])/g, '$1 $2');
        return value[0].toUpperCase() + value.slice(1);
    }
}