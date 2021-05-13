import { ValidatorFn, AbstractControl, FormGroup } from "@angular/forms";

export function cardRadioButtonValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return { 'cardRequired': true }
        }
        return null
    };
}

export function cardNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return { 'cardNameRequired': true }
        } else if (control.value.length < 19) {
            return { 'cardNameLength': true }
        } else if (luhnAlgorithm(control.value)) {
            return { 'luhnAlgorithm': true }
        }
        return null
    };
}

function luhnAlgorithm(value: string) {
    value = value.replace(/\s+/g, '');
    let valueNumber = value.split('').reverse();
    let summ = 0;
    valueNumber.map((element: any, index: any) => {
        let currentElement = +element;
        if (index % 2) {
            currentElement *= 2;
            if (currentElement > 9) {
                currentElement -= 9
            }
        }
        summ += currentElement
        return currentElement
    })
    if (summ % 10) {
        return true
    } else {
        return false
    }
}

export function cardHolderValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return { 'cardHolderRequired': true }
        } else if (/^[a-z\d]+ [a-z\d]+$/i.test(control.value) === false) {
            return { 'cardHolderSpace': true }
        }
        return null;
    };
}

export function cardExpiresValidator(currentMonth: any, currentYear: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return { 'cardExpiresRequired': true }
        }
        if (control.value) {
            let valueMonth = +control.value.substring(0, 2);
            let valueYear = +control.value.substring(control.value.length - 2);
            if (valueMonth < 1 || valueMonth > 12) {
                return { 'cardMonth': true };
            }
            if (valueYear < currentYear || valueYear > (currentYear + 30) || (valueMonth < currentMonth && valueYear == currentYear)) {
                return { 'cardYear': true };
            }
        }
        return null;
    };
}

export function cardCVVValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return { 'cardCVVRequired': true }
        } else if (control.value.length < 3) {
            return { 'cardCVVLength': true }
        }
        return null
    };
}

export function formValidator(cardName: any, saveCard: any): any {
    return (formGroup: FormGroup) => {
        const cardNameControl = formGroup.controls[cardName];
        const saveCardControl = formGroup.controls[saveCard]

        if (saveCardControl.value && !cardNameControl.value) {
            cardNameControl.setErrors({ cardNameRequiredFromForm: true });
        } else {
            cardNameControl.setErrors(null);
        }

    };
}