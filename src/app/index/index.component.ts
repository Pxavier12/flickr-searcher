import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { SharedServicesService } from '../services/shared-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(3000, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(3000, style({ opacity: 0 })),
      ]),
    ]),
    trigger('openCloseText', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(2000, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(2000, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class IndexComponent implements OnInit {
  images = [];
  keyword!: string;
  loading = false;

  constructor(
    public sharedServices: SharedServicesService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onInputChange(event:any){
    this.keyword = event.target.value.toLowerCase();
  }

  onClickSubmit() {
    this.sharedServices.setSearchQuery(this.keyword);
    this.router.navigate(['/result']);
  }

}
