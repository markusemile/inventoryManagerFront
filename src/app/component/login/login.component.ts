import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'ism-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastrService
  ) { }

  myForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  async handleSubmit() {
    try {
      const response: any = await firstValueFrom(this.apiService.loginUser(this.myForm.value));
      if (response.status === 200) {        
        this.toastService.success(response.message);
        this.apiService.encryptAndSaveTokenToStorage('token', response.token);
        this.apiService.encryptAndSaveTokenToStorage('role', response.role);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      for (const key in error.error) {
        console.log(error.error[key]);
        this.toastService.error(error?.error?.message || error?.message || "Unable to login user\n"+error);
      }
    }

  }
}
