import { Component, HostBinding, NgZone } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import { slideInOut } from './customToastrAnimation';
import { LineBreaksPipe } from '../../pipe/line-breaks.pipe';

 // Chemin vers ton trigger

@Component({
  selector: '[custom-toast]',
  standalone:true,
  imports:[LineBreaksPipe],
  template: `
    <div class="custom-toast">
      <div [innerHTML]="toastPackage.title"></div>     
      <div [innerHTML]="toastPackage.message | lineBreaks"></div>
    </div>
  `,
  animations: [slideInOut],
  styles: [`
    .custom-toast {
      color: #fff;
      padding: 12px 16px;
      border-radius: 4px;
      white-space: pre-line;
    }


    
  `]
})
export class CustomToastComponent extends Toast{

  @HostBinding('@flyInOut') flyInOut = 'active';
  
  constructor(toastService: ToastrService, toastPackage: ToastPackage,ngzone:NgZone) {
      super(toastService,toastPackage,ngzone);
      
  }
}