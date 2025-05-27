import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { AlertComponent } from "../../share/component/alert/alert.component";

interface Category {
  id: string,
  name: string
}

@Component({
  selector: 'ism-category',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  categories: Category[] = [];
  categoryName: string = '';
  message: string = '';
  messageStatus:string='';
  showingMessage : boolean = false;
  isEditing: boolean = false;
  editingCategoryId: string | null = null;

  

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.apiService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.categories;
      }
    });
  }

  editCategory():void{
    
    if(!this.editingCategoryId || !this.categoryName){
       return
    }

    this.apiService.updateCategory(this.editingCategoryId, {name:this.categoryName}).subscribe({
      next: (res:any)=>{
        if(res.status===200){
          this.messageStatus=res.status;
          this.showMessage("Category updated successfully");
          this.categoryName = '';
          this.getCategories();
        }
      },error: (error)=>{
        this.showMessage(error?.error?.message || error?.message || "Unable to save category. " + error);
      }
    })

  }

  addCategory(): void {

    if (!this.categoryName) {
      this.showMessage("Category name is required");
      return;
    }

    this.apiService.createCategory({ name: this.categoryName }).subscribe({
      next: (res: any) => {
        if (res.status === 200) {          
          this.messageStatus=res.status;
          this.showMessage("Category add with success");
          this.categoryName = '';
          this.getCategories();
        }
      }, error: (error)=>{
        this.showMessage(error?.error?.message || error?.message || "unable to save " + error);
      }
    })
  }

  showMessage(message: string) {
    this.message = message;

    setTimeout(() => {
      this.showingMessage = true;
    }, 10);

    setTimeout(() => {
      this.message = '';
      this.messageStatus='';
      this.showingMessage = false;
    }, 3000);
  }


  handleEditCategory(category:Category):void{
    this.isEditing=true;
    this.editingCategoryId=category.id;
    this.categoryName=category.name
  }

  handleDeleteCategory(categoryId:string){
    if(window.confirm("Are you sure, you want to delete this category ?")){
      this.apiService.deleteCategory(categoryId).subscribe({
        next: (res:any)=>{
          if(res.status===200){
            this.messageStatus=res.status;
            this.showMessage("Category deleted successfully");
            this.getCategories();            
          }
        },error: (error)=>{
          this.messageStatus=error.status;
          this.showMessage(error?.error?.message || error?.message || "Unable to delete category. " + error);
        }
      })
    }
  }

}