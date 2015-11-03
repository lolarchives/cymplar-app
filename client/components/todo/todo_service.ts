import {Injectable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';

import {OPTS_REQ_JSON} from '../core/web_constant';
import {Todo} from '../../../shared/dto';

@Injectable()
export class TodoService {

  static API = '/api/todo';

  constructor(private http: Http) {
  }

  createOne(obj: Todo) {
    const body = JSON.stringify(obj);
    return this.http.post(TodoService.API, body, OPTS_REQ_JSON).map((res: Response) => res.json());
  }

  updateOne(obj: Todo) {
    const body = JSON.stringify(obj);
    return this.http.put(`${TodoService.API}/${obj.id}`, body, OPTS_REQ_JSON).map((res: Response) => res.json());
  }

  removeOne(id: number) {
    return this.http.delete(`${TodoService.API}/${id}`).map((res: Response) => res.json());
  }

  search() {
    return this.http.get(`${TodoService.API}/_search`).map((res: Response) => res.json());
  }
}

