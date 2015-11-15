import {Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';

import {OPTS_REQ_JSON} from '../../core/util';
import {Contact} from '../../core/dto';

@Injectable()
export class ContactService {

  static API = '/api/contact';

  constructor(private http: Http) {
  }

  createOne(data: Contact): Observable<Contact> {
    const body = JSON.stringify(data);
    return this.http.post(ContactService.API, body, OPTS_REQ_JSON).map((res: Response) => res.json());
  }

  updateOne(data: Contact): Observable<Contact> {
    const body = JSON.stringify(data);
    return this.http.put(`${ContactService.API}/${data._id}`, body, OPTS_REQ_JSON).map((res: Response) => res.json());
  }

  removeOneById(id: string): Observable<Contact> {
    return this.http.delete(`${ContactService.API}/${id}`).map((res: Response) => res.json());
  }

  findOneById(id: string): Observable<Contact> {
    return this.http.get(`${ContactService.API}/${id}`).map((res: Response) => res.json());
  }

  find(): Observable<Contact[]> {
    return this.http.get(`${ContactService.API}/_find`).map((res: Response) => res.json());
  }

}

