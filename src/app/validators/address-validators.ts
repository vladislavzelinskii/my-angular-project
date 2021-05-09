import { ValidatorFn, AbstractControl } from "@angular/forms";

export function inputLengthValidator(length: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        if (control.value.length > length) {
            return {'inputLength': true}
        }
        return null
    };
}
