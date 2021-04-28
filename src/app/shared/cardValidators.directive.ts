import { ValidatorFn, AbstractControl } from "@angular/forms";








export function cardNumberValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        if (!control.value) {
            return {'cardNameRequired': true}
        } else if (control.value.length < 19) {
            return {'cardNameLength': true}
        }
        return null
    };
}



export function cardHolderValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        if (!control.value) {
            return {'cardHolderRequired': true}
        } else if (/^[a-z\d]+ [a-z\d]+$/i.test(control.value) === false) {
            return {'cardHolderSpace': true}
        }
        return null;
    };
}

export function cardExpiresValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        if (!control.value) {
            return {'cardExpiresRequired': true}
        }
        if (control.value) {
            if (control.value.substring(0, 2) < 1 || control.value.substring(0, 2) > 12) {
                return {'cardMonth': true};
            }
            if (control.value.substring(control.value.length - 2) < 21) {
                return {'cardYear': true};
            }
        }
        return null;
    };
}

export function cardCVVValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        if (!control.value) {
            return {'cardCVVRequired': true}
        } else if (control.value.length < 3) {
            return {'cardCVVLength': true}
        }
        return null
        // const value = /^\d{3}$/.test(control.value);
        // return !value ? {value: {value: control.value}} : null;
    };
}



export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
}