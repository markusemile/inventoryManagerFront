import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../share/validator/passwordMatchValidator';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ism-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastrService
  ) { }

  myForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phoneNumber: new FormControl('', Validators.required)
  }, {
    validators: passwordMatchValidator('password', 'passwordConfirm')
  });



  async handleSubmit() {    
    try {
      const response: any = await firstValueFrom(this.apiService.registerUser(this.myForm.value));
      console.log(response);
      if (response.status === 200) {
        this.toastService.success(response.message);
        this.router.navigate(['/login']);
      } else {
        console.log(response);        
        this.toastService.error(response.message);
      }
    } catch (error: any) {     
      if(error.error){
        console.log(error.error);
        for (const key in error.error) {
          console.log(error.error[key]);          
          this.toastService.error(error.error.message,`Error:${error.error.status}`);
        }
        
      }
    }


  }
}



