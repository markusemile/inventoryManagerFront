import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ism-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {


  @Input('message') message: string = '';
  @Input('status') status: number | null = null;
  @Input('duration') duration: number = 3000;
  @Output('reset') reset : EventEmitter<boolean>= new EventEmitter();

  show: boolean = false;


  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['message'] && this.message || changes['status'] && this.status) {

      setTimeout(() => {
        this.show = true;
      }, 10);

      setTimeout(() => {
        this.message = '';
        this.status = null;
        this.show = false;
        this.reset.emit(true);
      }, this.duration);
    }

  }
}
