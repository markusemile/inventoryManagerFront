import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(password: string, confirmPassword: string) : ValidatorFn{

    return (formGroup:AbstractControl):ValidationErrors|null=>{
        const passwordControl = formGroup.get(password)?.value;
        const confirmPasswordControl = formGroup.get(confirmPassword)?.value;
        
        if(passwordControl && confirmPasswordControl && passwordControl !== confirmPasswordControl){
            return {passwordMatchValidator:true};
        }else{
            return null;
        }
    }


}