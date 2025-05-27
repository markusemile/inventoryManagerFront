import { EventEmitter, inject, Injectable } from '@angular/core';
import CryproJs from 'crypto-js';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private static BASE_URL =environment.API_BASE_URL;
  private static ENCRYPTION_KEY = 'f54gfdf5ggdf145g41dfgdf149g14dfg14df1g9d1f9g';

  authStatusChanged = new EventEmitter<void>();

  constructor(private http: HttpClient) {

   }

   encryptAndSaveTokenToStorage(key: string, value: string) {
     const encryptedValue = CryproJs.AES.encrypt(value, ApiService.ENCRYPTION_KEY).toString();
     localStorage.setItem(key, encryptedValue);
   }

   private getFromStorageAndDecrypt(key: string) :any {
    try{
      const encryptedValue = localStorage.getItem(key);
     
      if(!encryptedValue) return null; 
       return CryproJs.AES.decrypt(encryptedValue, ApiService.ENCRYPTION_KEY).toString(CryproJs.enc.Utf8);
    }catch(error){
      return null;
    }
   }

   private clearAuth(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
   }

   private getHeader(){
    const token = this.getFromStorageAndDecrypt('token');
    return new HttpHeaders({
        Authorization: `Bearer ${token}`
    });
   }

   // authentication checker
   logout():void{
     this.clearAuth();
     this.authStatusChanged.emit();
   }

   isAuthenticated(): boolean {
    const token = this.getFromStorageAndDecrypt('token');
    return !!token;
   }

   isAdmin(): boolean {
    const role = this.getFromStorageAndDecrypt('role');  
    return role === "ADMIN";
   }



  /***AUTH & USERS API METHODS */

  registerUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
  }

  getLoggedInUserInfo(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/current`, {
      headers: this.getHeader(),
    });
  }


  //  CATEGORY ENDPOINTS
  createCategory(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/category/new`, body,{ headers: this.getHeader()});
  }
  getAllCategories():Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/category/all`, { headers: this.getHeader()});
  }
  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/category/${id}`, {
      headers: this.getHeader(),
    });
  }
  updateCategory(id: string, body: any): Observable<any> {
    return this.http.put(
      `${ApiService.BASE_URL}/category/update/${id}`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/category/delete/${id}`, {
      headers: this.getHeader(),
    });
  }

  /** SUPPLIER API */
  addSupplier(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/supplier/new`, body, {
      headers: this.getHeader(),
    });
  }

  getAllSuppliers(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/supplier/all`, {
      headers: this.getHeader(),
    });
  }

  getSupplierById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/supplier/${id}`, {
      headers: this.getHeader(),
    });
  }

  updateSupplier(id: string, body: any): Observable<any> {
       return this.http.put(
      `${ApiService.BASE_URL}/supplier/update/${id}`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/supplier/delete/${id}`, {
      headers: this.getHeader(),
    });
  }

  /**PRODUICTS ENDPOINTS */
  addProduct(formData: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/product/add`, formData, {
      headers: this.getHeader(),
    });
  }

  updateProduct(formData: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/product/update`, formData, {
      headers: this.getHeader(),
    });
  }

  getAllProducts(query:string='',page:number=0,size: number = 10): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/product/all`, {
      params:{query,page,size},
      headers: this.getHeader(),
    });
  }

  searchProducts(query:string, page: number=0,size: number = 10): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/product/all`, {
      params:{query,page,size},
      headers: this.getHeader(),
    });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/product/${id}`, {
      headers: this.getHeader(),
    });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/product/delete/${id}`, {
      headers: this.getHeader(),
    });
  }

   /**Transactions Endpoints */

   purchaseProduct(body: any): Observable<any> {
    return this.http.post(
      `${ApiService.BASE_URL}/transactions/purchase`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  sellProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/sell`, body, {
      headers: this.getHeader(),
    });
  }

  getAllTransactions(searchText: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/all`, {
      params: { searchText: searchText },
      headers: this.getHeader(),
    });
  }

  getTransactionById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/${id}`, {
      headers: this.getHeader(),
    });
  }

  
  updateTransactionStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/transactions/update/${id}`, JSON.stringify(status), {
      headers: this.getHeader().set("Content-Type", "application/json")
    });
  }


  getTransactionsByMonthAndYear(month: number, year: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/by-month-year`, {
      headers: this.getHeader(),
      params: {
        month: month,
        year: year,
      },
    });
  }

}
