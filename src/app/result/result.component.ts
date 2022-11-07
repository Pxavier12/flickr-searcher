import { Component, OnInit } from '@angular/core';
import { FlickrService } from '../services/flickr.service';
import { lastValueFrom } from 'rxjs';
import { SharedServicesService } from '../services/shared-services.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  images!: any[];
  comments!: any[];
  modalImage!: any;
  keyword!: string;
  searchQuery = this.sharedServices.getSearchQuery();

  constructor(
    private flickrService: FlickrService,
    public sharedServices: SharedServicesService
  ) {}

  ngOnInit(): void {
    this.keyword = this.sharedServices.getSearchQuery();
    this.search();
  }

  async search(event?: any) {
    if (event) {
      this.keyword = event.target.value.toLowerCase();
    }
    if (this.keyword && this.keyword.length > 0) {
      const result$ = this.flickrService.search(this.keyword);
      
      await lastValueFrom(result$).then((res) => {
        this.images = res;
      });
      console.log(this.images);
    }
  }

  async getComment() {
    if (this.modalImage.id) {
      console.log(this.modalImage.id)
      const result$ = this.flickrService.getCommentsFromPhotoId(
        this.modalImage.id
      );
      await lastValueFrom(result$).then((res) => {
        console.log(res);
        this.comments = res;
        this.commentLoaded = true;
      });
    }
  }

  async onScroll() {
    if (this.keyword && this.keyword.length > 0) {
      const result$ = this.flickrService.search(this.keyword);
      const results = await lastValueFrom(result$).then((res) => {
        this.images = this.images.concat(res);
      });
    }
  }

  onInputChange(event: any) {
    this.keyword = event.target.value.toLowerCase();
  }

  onClickSubmit() {
    this.sharedServices.setSearchQuery(this.keyword);
  }
  showModal = false;
  commentLoaded = false;

  async toggleModal(image?: any) {
    console.log(this.commentLoaded);
    this.modalImage = image;
    if (this.commentLoaded) {
      this.comments = [];
      this.commentLoaded = false;
    } else {
      console.log('fetching comments');
      await this.getComment();
      console.log(this.comments);
    }

    this.showModal = !this.showModal;
  }
}
