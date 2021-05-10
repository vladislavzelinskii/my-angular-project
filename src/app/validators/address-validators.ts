import { ValidatorFn, AbstractControl } from "@angular/forms";

export function inputLengthValidator(length: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        return control.value.length > length ? {'inputLength' : true} : null
    };
}
