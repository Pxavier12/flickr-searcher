import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {

  private searchQuery = '';

  constructor() { }
  
  setSearchQuery(query: string) {
     this.searchQuery=query;
  }

  getSearchQuery() {
     return this.searchQuery;
  }

}
