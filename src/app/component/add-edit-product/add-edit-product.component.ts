import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AlertComponent } from '../../share/component/alert/alert.component';
import { environment } from '../../../environments/environment.development';


interface Category {
  id: number,
  name: string
}


@Component({
  selector: 'ism-add-edit-product',
  imports: [ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.scss'
})
export class AddEditProductComponent implements OnInit {


  allCategories: Category[] = [];

  currentProductId: number | null = null;
  isEditing: boolean = false;
  
  message = '';
  messageVisible: boolean = false;
  messageStatus: number | null = null;
  
  imagePreview: SafeUrl | string = "assets/pictures/default.jpg";
  selectedFile: File | null = null;

  myForm = new FormGroup({
    productId: new FormControl<number | null>(null),
    name: new FormControl('', Validators.required),
    sku: new FormControl('', Validators.required),
    stockQuantity: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imageUrl: new FormControl(''),
    price: new FormControl<number | null>(0, Validators.required),
    categoryId: new FormControl('', Validators.required)
  }
  );
  constructor(
    private route: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.CheckIfEditing();
  }

  private loadCategories() {
    this.apiService.getAllCategories().subscribe({
      next: (res: any) => {
        this.allCategories = res.categories;
      }
    })
  }

  private loadProduct(productId: number) :void {
      this.apiService.getProductById(productId).subscribe({

        next: (res: any) => {
          const product = res.product;       
          this.myForm.patchValue  ({
            name: product.name,
            sku: product.sku,
            stockQuantity: product.stockQuantity,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId
          }) 
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(`${environment.BASE_URL}/product-image/${res.product.imageUrl}`);
        }
      })
    
  }

  private CheckIfEditing() :void {
    const productId = this.activatedRoute.snapshot.params['productId'];
    if(productId){
      this.isEditing=true;
      this.currentProductId = +productId;
      this.myForm.get('productId')?.setValue(this.currentProductId);
      this.loadProduct(this.currentProductId);
    }
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if(input.files?.length){
         this.selectedFile = input.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.imagePreview = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result as string);
          }
        }
        fileReader.readAsDataURL(this.selectedFile);
      }
    } 
  
  addEditProduct() {
    //check if validate
    if (this.myForm.invalid) return;
    // create formData
    const formData = new FormData();
    const fields = ['name','sku','stockQuantity','description','price','categoryId'];

    fields.forEach(field=>{
      const value = this.myForm.get(field)?.value;
      if(value !== null && value !== undefined)
        formData.append(field,value);
    })



    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile);
    }

    if (this.isEditing && this.currentProductId !== null) {

      // add id to the formData
      formData.append('productId', this.currentProductId.toString());

      this.apiService.updateProduct(formData).subscribe({
        next: res => this.handleSuccess(res),
        error: err => this.handleError(err)
      })

    } else {

      this.apiService.addProduct(formData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.messageStatus = +res.status;
            this.message = res.message;
            this.messageVisible = true;
            setTimeout(() => {
              this.route.navigate(['product']);
            }, 1000);

          }
        }, error: (error) => {
          if (error.status === 0) this.message = "Unable to contact resource. " + "\n Contact your administartor !";
          else this.message = "Error : " + error.message;
          this.messageStatus = error.status;

        }
      })
    }
  } 
  
  private handleSuccess(res:any){
    this.messageStatus = res.status;
    this.message = res.message;
    this.messageVisible=true;
    setTimeout(() => this.route.navigate(['/product']),1000);      
  }
  private handleError(error:any) :void{
    this.message = error.status === 0 ? "Unable to contact resource. " + "\n Contact your administartor !" : "Error : " + error.message;
    this.messageStatus = +error.status;
    this.messageVisible = true;
  }

  resetMessage() {
    this.message = '';
    this.messageStatus = null;
    this.messageVisible = false;
  }


}
