import { CommonModule} from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from './service/api.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ims';

  constructor(
    private apiService:ApiService,
    private router : Router,
    private cdr: ChangeDetectorRef
  ){
    
  }

  isAuth(){

    return this.apiService.isAuthenticated();
  }

  isAdmin(){

    return this.apiService.isAdmin();
  }

  logout(){
    this.apiService.logout();
    this.router.navigate(['/login']);
    this.cdr.detectChanges();
  }

}
