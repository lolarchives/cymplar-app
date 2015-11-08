import {Injectable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';
import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';

import {OPTS_REQ_JSON} from '../core/web_constant';
import {Todo} from '../core/dto';

@Injectable()
export class TodoService {

  static API = '/api/todo';

  constructor(private http: Http) {
  }

  createOne(data: Todo): Rx.Observable<Todo> {
    const body = JSON.stringify(data);
    return this.http.post(TodoService.API, body, OPTS_REQ_JSON).map((res: Response) => res.json());
  }
  
  updateOne(data: Todo): Rx.Observable<Todo> {
    const body = JSON.stringify(data);
    return this.http.put(`${TodoService.API}/${data.id}`, body, OPTS_REQ_JSON).map((res: Response) => res.json());
  }
  
  removeOneById(id: string): Rx.Observable<Todo> {
    return this.http.delete(`${TodoService.API}/${id}`).map((res: Response) => res.json());
  }

  findOneById(id: string): Rx.Observable<Todo> {
    return this.http.get(`${TodoService.API}/${id}`).map((res: Response) => res.json());
  }

  find(): Rx.Observable<Todo[]> {
    return this.http.get(`${TodoService.API}/_find`).map((res: Response) => res.json());
  }  
  
}

