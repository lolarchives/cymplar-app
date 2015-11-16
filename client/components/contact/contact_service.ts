import {Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';

import {OPTS_REQ_JSON} from '../../core/util';
import {Contact} from '../../core/dto';
import {HttpClient} from '../../core/http_client';
import {BaseResourceService} from '../../core/base_service';


@Injectable()
export class ContactService extends BaseResourceService<Contact> {

  constructor(http: HttpClient) {
    super(http, 'contact');
  }

}

