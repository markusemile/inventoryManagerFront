import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ism-pagination',
  imports: [ CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit {
  
  page : number[]=[];
  showMaxPage : number = 5;
 
  @Input() currentPage: number = 0;
  @Input() totalPage!: number;
  @Input() totalItems!: number;
  @Input() itemsPerPage!: number;  

  @Output() getPage = new EventEmitter<number>();
  
  
  ngOnInit(): void { 
     this.generatePageArray();
    }

    ngOnChanges(changes: SimpleChanges): void {
      console.log(this.currentPage);
      
      if (changes['totalPage'] || changes['currentPage']) {
        this.generatePageArray();
      }
    }

  private generatePageArray():void{
    if(this.totalPage !== undefined){
      const start = Math.max(0,this.currentPage - Math.floor(this.showMaxPage/2));
      const end = Math.min(this.totalPage-1, start+this.showMaxPage-1);
      this.page = Array.from({ length: end-start + 1},(_,index)=>start + index);
    }
  }

    pageChanged(p:number){
      this.getPage.emit(p);
    }

    jump(offset: number) {
      const newPage = this.currentPage + offset;
      // S'assurer que la page reste dans les bornes
      if (newPage >= 0 && newPage < this.totalPage) {
        this.pageChanged(newPage);
      }
    }
    
}



