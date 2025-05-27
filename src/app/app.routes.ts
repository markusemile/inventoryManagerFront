import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { CategoryComponent } from './component/category/category.component';
import { GuardService } from './service/guard.service';
import { SupplierComponent } from './component/supplier/supplier.component';
import { AddEditProductComponent } from './component/add-edit-product/add-edit-product.component';
import { ProductComponent } from './component/product/product.component';
import { PurchaseComponent } from './component/purchase/purchase.component';
import { SellComponent } from './component/sell/sell.component';
import { TransactionComponent } from './component/transaction/transaction.component';
import { TransactionDetailsComponent } from './component/transaction-details/transaction-details.component';
import { ProfileComponent } from './component/profile/profile.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

export const routes: Routes = [
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},

    {path:'category',component:CategoryComponent,canActivate:[GuardService],data:{requiresAdmin:true}},
    
    {path:'supplier',component:SupplierComponent,canActivate:[GuardService],data:{requiresAdmin:true}},
    
    {path:'product',component:ProductComponent,canActivate:[GuardService],data:{requiresAdmin:true}},
    {path:'product/edit/:productId',component:AddEditProductComponent,canActivate:[GuardService],data:{requiresAdmin:true}},
    {path:'product/new',component:AddEditProductComponent,canActivate:[GuardService],data:{requiresAdmin:true}},

    {path:'purchase',component:PurchaseComponent,canActivate:[GuardService]},
    {path:'sell',component:SellComponent,canActivate:[GuardService]},
    {path:'transaction',component:TransactionComponent,canActivate:[GuardService]},
    {path:'transaction/:transactionId',component:TransactionDetailsComponent,canActivate:[GuardService]},

    {path:'profile',component:ProfileComponent,canActivate:[GuardService]},
    {path:'dashboard',component:DashboardComponent},
    
    {path:'',redirectTo:'/login',pathMatch:'full'},
    {path:'**',redirectTo:'/dash'}
     


];
