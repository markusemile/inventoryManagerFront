import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { AlertComponent } from '../../share/component/alert/alert.component';
import { TimeBetweenNowPipe } from '../../share/pipe/time-between-now.pipe';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../share/component/pagination/pagination.component';

interface Product{
  id:number,
  name: string,
  sku:string,
  price:number,
  stockQuantity:number,
  description:string,
  imageUrl:string,
  categoryId:number,
  updateAt:string,
  createAt:string
}
interface Category{
  id:number,
  name:string
}


@Component({
  selector: 'ism-product',
  imports: [ CommonModule, AlertComponent,TimeBetweenNowPipe,FormsModule,PaginationComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent  implements OnInit{

  private apiService = inject(ApiService);
  private route = inject(Router);


  message: string ='';
  messageStatus: number = 0;
  messageVisible: boolean = false;

  searchText:string="";

  showLikeList: boolean = false;

  products:Product[] = [];
  categories:Category[] = [];

  
  numbOfCard = 10;
  totalPages! : number;
  totalItems! : number;
  currentPage : number=0;

  ngOnInit():void{
    this.getProduct();       
    // on check si on a des params dans notre url    
    // si oui on les recupere
    // searchText = searchParams.get('query');
    // currentPage = searchParams.get('page');
    this.getCategory();
  }

  private getProduct() : void{
    this.apiService.getAllProducts().subscribe({

      next: (res:any)=>{       
        if(res.status===200){
          console.log(res);
          this.products=res.products  
          this.totalPages=res.totalPages;
          this.totalItems=res.totalElements;
          this.currentPage=res.currentPage;
        }
      },error: (error)=>{ this.handleError(error) }      
    })
  }

  searchProduct() :void {
    this.currentPage = 0;
      this.apiService.searchProducts(this.searchText).subscribe({
        next: (res:any)=>{
          if(res.status===200){
            this.products=res.products  
            this.totalPages=res.totalPages;
            this.totalItems=res.totalElements;
            this.currentPage=res.currentPage;
          }
        },error: (error)=>{ this.handleError(error) }
      })
  }

  private getCategory() : void{
    this.apiService.getAllCategories().subscribe({
      next: (res:any)=>{
        if(res.status===200){
          this.categories=res.categories  
        }
      },error: (error)=>{ this.handleError(error) }
    })
  }

  getCategoryName(id:number) :string{
    const category = this.categories.find((category:Category) => category.id === id);
    return category ? category.name : '';
  }


  editProduct(id:number){
    this.route.navigate(['product/edit',id]);
  }

  deleteProduct(id:number){
    if(!confirm("Are you sure, you want to delete this product ?")) return;
    this.apiService.deleteProduct(id).subscribe({
      next: (res:any)=>{        
        if(res.status===200){

          this.handleSuccess(res);
          this.getProduct();
        }
      },error: (error)=>{ this.handleError(error) }
    })
  }


  private handleSuccess(res:any) : void {
    this.messageStatus = res.status;
    this.message = res.message;
    this.messageVisible=true;
  }

  private handleError(error:any) :void {
    this.message =  error.status ===0 ? "Unable to contact resource. " + "\n Contact your administartor !" : "Error : " + error.message;
    this.messageStatus = +error.status;
    this.messageVisible = true;
  }

  getThumbnailUrl(imageUrl:string):string|null{
    const baseUrl = "http://localhost:8080/product-image/thumbnails/";
    const extension = imageUrl.split(".");
    const finalPath = baseUrl+extension[0]+"_thumb.jpg";    
    return finalPath;
  }

  getPage(e:any){
    console.log(e);
    this.apiService.getAllProducts(this.searchText,e).subscribe({
       next: (res:any)=>{       
        if(res.status===200){
          console.log(res);
          this.products=res.products  
          this.totalPages=res.totalPages;
          this.totalItems=res.totalElements;
          this.currentPage=res.currentPage;
        }
      },error: (error)=>{ this.handleError(error) }    
    })
    
  }

}
