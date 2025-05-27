import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot} from "@angular/router"; 
import { ApiService } from './api.service';
import { MaybeForwardRefExpression } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {
  
  constructor(private apiService: ApiService,private router: Router) {


   }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult>{
    const requiresAdmin = route.data['requiresAdmin'] || false;
    if(requiresAdmin){
      if(this.apiService.isAdmin()){
        return true;
      }else{
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }else{
      if(this.apiService.isAuthenticated()){
        return true; 
      }else{
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }
  }
}
