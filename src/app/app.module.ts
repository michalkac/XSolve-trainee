import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgModel} from '@angular/forms';
import { AppComponent } from './app.component';
import {SortBy} from './sortBy.pipe'
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationService } from './services/pagination.service';

export const MY_NATIVE_FORMATS = {
  fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'},
  fromPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'},
  datePickerInput: {year: 'numeric', month: 'numeric', day: 'long', hour: 'numeric', minute: 'numeric'},
  timePickerInput: {hour: 'numeric', minute: 'numeric'},
  monthYearLabel: {year: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};
@NgModule({
  declarations: [
    AppComponent,
    SortBy,
    NgModel
  ],
  imports: [
    BrowserModule,
    HttpModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule
  ],
  providers: [
    PaginationService,
  
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'pl'},
    
    SortBy
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
