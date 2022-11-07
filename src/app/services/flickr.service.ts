import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface FlickrPhoto {
  farm: string;
  id: string;
  secret: string;
  server: string;
  title: string;
}

export interface Comments {
  id: string;
  author: string;
  authorname: string;
  datecreate: string;
  permalink: string;
  _content: string;
}

@Injectable({
  providedIn: 'root',
})
export class FlickrService {
  prevKeyword!: string;
  currPage = 1;

  constructor(private http: HttpClient) {}

  search(keyword: string) {
    if (this.prevKeyword === keyword) {
      this.currPage++;
    } else {
      this.currPage = 1;
    }
    this.prevKeyword = keyword;
    const url =
      'https://www.flickr.com/services/rest/?method=flickr.photos.search&';
    const params = `api_key=${environment.flickr.key}&text=${keyword}&format=json&nojsoncallback=1&per_page=12&page=${this.currPage}&sort=relevance`;

    return this.http.get(url + params).pipe(
      map((res: any) => {
        const urlArr: any = [];
        res.photos.photo.forEach((ph: FlickrPhoto) => {
          const photoObj = {
            url: `https://farm${ph.farm}.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}`,
            title: ph.title,
            id: ph.id,
          };
          urlArr.push(photoObj);
        });
        return urlArr;
      })
    );
  }
  
  //sort search list
  searchSort(searchList : any[],sortBy : string, orderBy : string ) : any[]{

    return searchList.sort((a,b)=>{
          let order =(orderBy === 'asc') ? 1 : -1
          return(
              a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
                  ? -1 * order : 1 * order

          )
      })

  }

  //convert seconds to a date
  secondsToDate(input: string) {
    var number = eval(input);
    var seconds = Math.floor(number);
    var hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (hours < 10) {
      hours = 0 + hours;
    }
    if (minutes < 10) {
      minutes = 0 + minutes;
    }
    if (seconds < 10) {
      seconds = 0 + seconds;
    }

    var date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  }


  
  getCommentsFromPhotoId(id: string) {
    const url =
      'https://www.flickr.com/services/rest/?method=flickr.photos.comments.getList&';
    const params = `api_key=${environment.flickr.key}&photo_id=${id}&format=json&nojsoncallback=1`;

    return this.http.get(url + params).pipe(
      map((res: any) => {
        const urlArr: any = [];
        console.log(res);
        res?.comments?.comment?.forEach((com: Comments) => {
          console.log(com);
          const commentObj = {
            datecreate: this.secondsToDate(com.datecreate),
            authorname: com.authorname,
            comment: com._content,
          };
          urlArr.push(commentObj);
        });
        return urlArr;
      })
    );
  }
}

