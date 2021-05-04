import { ValidatorFn, AbstractControl, FormGroup } from "@angular/forms";

export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!control.value) {
            return {'emailRequired': true}
        } else if (reg.test(control.value) == false) {
            return {'emailIncorrect': true}
        }
        return null
    };
}

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        if (!control.value) {
            return {'passwordRequired': true}
        } else if (control.value.length < 6 || control.value.length > 20) {
            return {'passwordLength': true}
        }
        return null
    };
}

export function passwordConfirmValidator( password: any, confirm: any ): any {
    return (formGroup: FormGroup) => {
        const passwordControl = formGroup.controls[password];
        const confirmControl = formGroup.controls[confirm]

        if (!confirmControl.value) {
            confirmControl.setErrors({ passwordConfirmRequired : true })
        } else if (passwordControl.value !== confirmControl.value) {
            confirmControl.setErrors({ passwordConfirmMismatch : true })
        } else {
            confirmControl.setErrors(null)
        }

    };
}