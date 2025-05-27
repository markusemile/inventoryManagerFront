import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeBetweenNow'
})
export class TimeBetweenNowPipe implements PipeTransform {

  transform(value: string, value2: string=""): string{
    value = (value !== undefined) ? value : value2;
    const dateValue = new Date(value);
    const currentDate = new Date();
    const diff = dateValue.getTime() - currentDate.getTime();
    let gap = Math.ceil(diff / (1000 * 60 * 60 * 24));    
    if(-gap>1){
      return -gap+" days";
    }else{
      let hours = Math.ceil(diff / (1000 * 60 * 60 ));       
      let minutes = Math.ceil((diff % (1000 * 60 * 60 )) / (1000 * 60));
      let gap = -hours>0 ? `${-hours}h ${-minutes}min`: `${-minutes}min`;      
      return gap;
    }

  }

}
