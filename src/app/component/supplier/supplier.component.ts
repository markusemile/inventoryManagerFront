import { Component, inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { concat, timeout } from 'rxjs';
import { AlertComponent } from "../../share/component/alert/alert.component";
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressFormaterPipe } from '../../share/pipe/address-formater.pipe';

interface Supplier {
  id: number,
  name: string,
  address: string
}


@Component({
  selector: 'ism-supplier',
  imports: [CommonModule, AlertComponent, ReactiveFormsModule, FormsModule,AddressFormaterPipe],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent {

  private apiService = inject(ApiService);
  private route = inject(Router);

  //for the form into the modale
  myForm: FormGroup = new FormGroup(
    {
      id: new FormControl(' ',[Validators.required]),
      name: new FormControl('',[Validators.required]),
      street: new FormControl('',[Validators.required]),
      number: new FormControl('',[Validators.required]),
      postalCode: new FormControl('',[Validators.required]),
      city: new FormControl('',[Validators.required]),
      country: new FormControl('',[Validators.required])
    },
  );

  suppliers: Supplier[] = [];
  message: string = '';
  messageStatus: number | null = null;
  messageVisible: boolean = false;
  supplierId: number | null = null;
  supplierName: string = '';
  supplierAddress: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;


  ngOnInit(): void {
    this.getSupplier();
  }


  getSupplier() {
    this.apiService.getAllSuppliers().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.suppliers = res.suppliers;
        }
      }, error: (error: HttpErrorResponse) => {
        if (error.status === 0) this.message = "Unable to contact resource. " + "\n Contact your administartor !";
        else this.message = "Error : " + error.message;
        this.messageStatus = error.status;
      }
    })
  }



  addSupplier() {
    if( this.myForm && this.myForm.valid){
      this.supplierAddress= this.myForm.value.street + ', ' + this.myForm.value.number + '**' + this.myForm.value.postalCode + '*' + this.myForm.value.city + '**' + this.myForm.value.country;
    }
    this.apiService.addSupplier({name: this.myForm.value.name, address: this.supplierAddress}).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.messageStatus = res.status;
          this.message = res.message;
          this.messageVisible = true;
          this.getSupplier();
        }
      }, error: (error) => {
        if (error.status === 0) this.message = "Unable to contact resource. " + "\n Contact your administartor !";
        else this.message = "Error : " + error.message;
        this.messageStatus = error.status;
        this.showModal = false;
      }
    })
   
  }

  resetForm(){
    this.myForm.reset();
    this.myForm.get('id')?.setValue(' ');
  }


  handleEditSupplier(supplier: Supplier) { 
    this.isEditing = true;
    const addressLines = supplier.address.split('**');
    if(addressLines.length===3){
      this.myForm.get('id')?.setValue(supplier.id);
      this.myForm.get('name')?.setValue(supplier.name);
      this.myForm.get('street')?.setValue(addressLines[0].split(',')[0]);
      this.myForm.get('number')?.setValue(addressLines[0].split(',')[1].trim());
      this.myForm.get('postalCode')?.setValue(addressLines[1].split('*')[0]);
      this.myForm.get('city')?.setValue(addressLines[1].split('*')[1]);
      this.myForm.get('country')?.setValue(addressLines[2]);
    }   
      
    this.showModal = true;    
  }

  handleDeleteSupplier(id: number) {
    if (window.confirm('Are you sure, you want to delete this supplier ?')) {
      this.apiService.deleteSupplier(id.toString()).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.messageStatus = +res.status;
            this.message = res.status+" - "+res.message;
            this.messageVisible = true;
            this.resetForm();
            this.getSupplier();
          }
        }, error: (error) => {
          if (error.status === 0) this.message = "Unable to contact resource. " + "\n Contact your administartor !";
          else this.message = "Error : " + error.message;
          this.messageStatus = +error.status;
        }
      })
    }
  }


  updateSupplier(){    

    if( this.myForm && this.myForm.valid){
      this.supplierAddress= this.myForm.value.street + ', ' + this.myForm.value.number + '**' + this.myForm.value.postalCode + '*' + this.myForm.value.city + '**' + this.myForm.value.country;
    }

    this.apiService.updateSupplier(this.myForm.value.id.toString(), {name: this.myForm.value.name, address: this.supplierAddress}).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showModal=false;
          this.messageStatus = res.status;
          this.message = res.status+" - "+res.message;
          this.messageVisible = true;
          this.isEditing=false;
          this.resetForm();
          this.getSupplier();
        }
      }, error: (error) => {
        if (error.status === 0) this.message = "Unable to contact resource. " + "\n Contact your administartor !";
        else this.message = "Error : " + error.message;
        this.messageStatus = error.status;
        this.showModal = false;
      }
    })
  }

  closeModal(){
    this.isEditing=false;
    this.showModal = false;
    this.myForm.reset();
  }

  resetMessage(){
    this.message='';
    this.messageStatus=null;
    this.messageVisible=false;
    this.resetForm();
  }

}
