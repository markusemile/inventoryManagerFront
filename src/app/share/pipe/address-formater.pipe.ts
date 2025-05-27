import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressFormater'
})
export class AddressFormaterPipe implements PipeTransform {

  transform(value: string): string {    
    let address = value.replaceAll('**', ' - ');
    address = address.replaceAll('*', ' ');
    console.log(address);
    
    return address;
  }

}
