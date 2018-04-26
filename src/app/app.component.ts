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
  idFilterMaxValue: any;
  idFilterMinValue: any;
  firstNameFilter: any;
  lastNameFilter: any;
  dateFilterMinValue: any;
  dateFilterMaxValue: any;  
  companyFilter: any;
  noteFilterMinValue: any;
  noteFilterMaxValue: any;


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
    //Adds simple YYYYMMDDHHMM date format that is easy to sort and filter by range.
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

    let idFilterMinValue =this.idFilterMinValue;
    let idFilterMaxValue =this.idFilterMaxValue;
    let firstNameFilter = this.firstNameFilter;
    let lastNameFilter = this.lastNameFilter;
    let dateFilterMinValue = this.dateFilterMinValue;
    let dateFilterMaxValue = this.dateFilterMaxValue;
    let companyFilter = this.companyFilter;
    let noteFilterMinValue = this.noteFilterMinValue;
    let noteFilterMaxValue = this.noteFilterMaxValue;
    
    if (idFilterMinValue !== ''){
    array=array.filter(function(element){return (element.id >= idFilterMinValue)});
    }
    if (idFilterMaxValue !== ''){
      array=array.filter(function(element){return (element.id <= idFilterMaxValue)});
      }
    if (firstNameFilter !== ''){
      array=array.filter(function(element){return (element.firstName.toLowerCase().includes(firstNameFilter.toLowerCase()))});
    }
    if (lastNameFilter !== ''){
      array=array.filter(function(element){return (element.lastName.toLowerCase().includes(lastNameFilter.toLowerCase()))});
    }
    if (dateFilterMinValue !== ''){
      dateFilterMinValue = this.unifyDatepickerDate(dateFilterMinValue);
      array=array.filter(function(element){return (element.sortableDate >= dateFilterMinValue)});
    }
    if (dateFilterMaxValue !== ''){
      dateFilterMaxValue = this.unifyDatepickerDate(this.dateFilterMaxValue);
      array=array.filter(function(element){return (element.sortableDate <= dateFilterMaxValue)});
    }
    if (companyFilter !== ''){
      array=array.filter(function(element){return (element.company.toLowerCase().includes(companyFilter.toLowerCase()))});
    }

    if (noteFilterMinValue !== ''){
      array=array.filter(function(element){return (element.note >= noteFilterMinValue)});
    }

    if (noteFilterMaxValue !== ''){
      array=array.filter(function(element){return (element.note <= noteFilterMaxValue)});
    }
    return array; 
  }

  readInputs(){
//reads filtering input fields value
      this.idFilterMinValue = (<HTMLInputElement>document.getElementById('idFilterMinInput')).value;
      this.idFilterMaxValue = (<HTMLInputElement>document.getElementById('idFilterMaxInput')).value;
      this.firstNameFilter = (<HTMLInputElement>document.getElementById('firstNameFilterInput')).value;
      this.lastNameFilter = (<HTMLInputElement>document.getElementById('lastNameFilterInput')).value;
      this.dateFilterMinValue = (<HTMLInputElement>document.getElementById('dateFilterMinInput')).value;
      this.dateFilterMaxValue = (<HTMLInputElement>document.getElementById('dateFilterMaxInput')).value;
      this.companyFilter = (<HTMLInputElement>document.getElementById('companyFilterInput')).value;
      this.noteFilterMinValue = (<HTMLInputElement>document.getElementById('noteFilterMinInput')).value;
      this.noteFilterMaxValue = (<HTMLInputElement>document.getElementById('noteFilterMaxInput')).value;


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