import { Component, OnInit } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { PaginationService } from './services/pagination.service'
import { SortBy } from './sortBy.pipe' 
import 'rxjs/add/operator/map'

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private http: Http, private paginationService: PaginationService, private sortBy: SortBy) { }
  title = 'app';

  private workers: any;
  private displayedWorkers: any;

  pagination: any = {};
  page: any[];

  currentSortAttribute: string;

  private filterValues: any = {}; 


  ngOnInit() {

    this.http.get('./assets/data.json')
        .map((response: Response) => response.json())
        .subscribe(data => {
            this.workers = data;
            this.readInputs();
            this.setSort('id');
        });
  }

  setSort(newSortAttribute: string) {
    if (this.currentSortAttribute == newSortAttribute) {
      //reverses sorting and saves sort direction by adding "-"
      this.workers = this.sortBy.transform(this.workers, newSortAttribute, true );
      this.currentSortAttribute = '-' + newSortAttribute; 
    }
    else {
      this.workers = this.sortBy.transform(this.workers, newSortAttribute, false );
      this.currentSortAttribute = newSortAttribute;
    }
    this.unifyDateFormat(this.workers, 'dateOfBirth')
    this.workers = this.addSortableDate(this.workers, 'dateOfBirth', 'sortableDate')
    this.displayedWorkers = this.workers;
    
    this.displayedWorkers = this.filterService(this.workers);
    if(this.displayedWorkers.length != 0){
    this.setPage(1);
    }
  
  }

  setPage(page: number) {
    if (this.pagination.totalPages == 0){
      this.pagination.totalPages = 1;
    }
    this.pagination = this.paginationService.getPager(this.displayedWorkers.length, page);
    this.page = this.displayedWorkers.slice(this.pagination.startIndex, this.pagination.endIndex + 1);
  }

  unifyDateFormat(array: any, field: any){
  //adds missing 0's to birthDate
    for (var item in array){
      if (array[item][field].slice(1, 2) == '.'){ 
        array[item][field] = '0'+array[item][field]
      } 
      if (array[item][field].slice(4, 5) == '.'){ 
         array[item][field] = array[item][field].substr(0, 3) 
                            + '0' 
                            + array[item][field].substr(3);
      } 
      if (array[item][field].slice(12, 13) == ':'){ 
        array[item][field] = array[item][field].substr(0, 11) 
                            + '0' 
                            + array[item][field].substr(11);
     } 
    }

  }

  addSortableDate(array: any, source: any, destination){
    //Adds simple YYYYMMDDHHMM date format that is easy to sort and filter by range
    for (var item in array){
    array[item][destination] = array[item][source].slice(6,10)
                              + array[item][source].slice(3,5) 
                              + array[item][source].slice(0,2) 
                              + array[item][source].slice(11,13) 
                              + array[item][source].slice(14,16);
    }
    return array;
  }


  filterService(array: any,):any{
    
    let filterValues = this.filterValues;
    
    if (filterValues.idMin !== ''){
    array=array.filter(function(element){return (element.id >= filterValues.idMin)});
    }
    if (filterValues.idMax !== ''){
      array=array.filter(function(element){return (element.id <= filterValues.idMax)});
      }
    if (filterValues.firstName !== ''){
      array=array.filter(function(element){return (element.firstName.toLowerCase().includes(filterValues.firstName.toLowerCase()))});
    }
    if (filterValues.lastName !== ''){
      array=array.filter(function(element){return (element.lastName.toLowerCase().includes(filterValues.lastName.toLowerCase()))});
    }
    if (filterValues.dateMin !== ''){
      filterValues.dateMin = this.unifyDatepickerDate(filterValues.dateMin);
      array=array.filter(function(element){return (element.sortableDate >= filterValues.dateMin)});
    }
    if (filterValues.dateMax !== ''){
      filterValues.dateMax = this.unifyDatepickerDate(this.filterValues.dateMax);
      array=array.filter(function(element){return (element.sortableDate <= filterValues.dateMax)});
    }
    if (filterValues.company !== ''){
      array=array.filter(function(element){return (element.company.toLowerCase().includes(filterValues.company.toLowerCase()))});
    }

    if (filterValues.noteMin !== ''){
      array=array.filter(function(element){return (element.note >= filterValues.noteMin)});
    }

    if (filterValues.noteMax !== ''){
      array=array.filter(function(element){return (element.note <= filterValues.noteMax)});
    }
    return array; 
  }

  readInputs(){
//reads filtering input fields value
      this.filterValues.idMin = (<HTMLInputElement>document.getElementById('idFilterMinInput')).value;
      this.filterValues.idMax = (<HTMLInputElement>document.getElementById('idFilterMaxInput')).value;
      this.filterValues.firstName = (<HTMLInputElement>document.getElementById('firstNameFilterInput')).value;
      this.filterValues.lastName = (<HTMLInputElement>document.getElementById('lastNameFilterInput')).value;
      this.filterValues.dateMin = (<HTMLInputElement>document.getElementById('dateFilterMinInput')).value;
      this.filterValues.dateMax = (<HTMLInputElement>document.getElementById('dateFilterMaxInput')).value;
      this.filterValues.company = (<HTMLInputElement>document.getElementById('companyFilterInput')).value;
      this.filterValues.noteMin = (<HTMLInputElement>document.getElementById('noteFilterMinInput')).value;
      this.filterValues.noteMax = (<HTMLInputElement>document.getElementById('noteFilterMaxInput')).value;


  }

  unifyDatepickerDate(input: any){
//changes datepicker date format to YYYYMMDDHH format.
      if (input.slice(1, 2) === '.'){ 
        input = '0'+ input;
      } 
      input = input.slice(6,10) + input.slice(3,5) +input.slice(0,2) + input.slice(12,14) +input.slice(15,17);
      return input;
    }
}