import {Component} from 'angular2/angular2';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';

import {HomeCmp} from '../home/home';
import {ContactCmp} from '../contact/contact';
import {HttpClient} from '../../core/http_client';
import {Notification} from '../../core/dto';

@Component({
  selector: 'app',
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/contact', component: ContactCmp, as: 'Contact' }
])
export class AppCmp {
  constructor(private http: HttpClient) {
    this.http.requestNotifier.subscribe((notification: Notification) => {
      // Process Http request phases heres, also react to http errors.
      console.log('notification', notification);
    });
  }
}
