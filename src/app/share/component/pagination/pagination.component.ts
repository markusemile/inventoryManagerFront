import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'ism-pagination',
  imports: [ CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input() page: number = 0;
  @Input() totalPage!: number;
  @Input() totalItems!: number;
  @Input() itemsPerPage!: number;
  

}
