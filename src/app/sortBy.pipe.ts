import {Pipe, PipeTransform } from '@angular/core';
@Pipe( {
    name: 'sortBy'
    } )
export class SortBy implements PipeTransform {
 transform(array: any[], field: string, reverse: boolean) :any[] {
    array.sort((a: any, b: any) => {

        if (a[field] < b[field] && reverse == false || a[field] > b[field] && reverse == true ) {
          return -1;
        } else if (a[field] > b[field] && reverse == false || a[field] < b[field] && reverse == true) {
          return 1;
        } else {
          return 0;
        }
      });
      return array;
 }   
}