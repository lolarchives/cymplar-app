import {Component} from 'angular2/angular2';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';
import * as Auth0Lock from 'auth0-lock';

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
  
  constructor(private httpClient: HttpClient, private auth0Lock: Auth0Lock) {    
    this.httpClient.requestNotifier.subscribe((notification: Notification) => {
      // Process Http request phases heres, also react to http errors.
      console.log('notification', notification);
    });    
  }
  
  login() {
    this.auth0Lock.show(function onLogin(err: any, profile: any, id_token: string) {
      if (err) {
        // TODO replace by a nice alert.
        return alert(err.message);
      }
      // User is logged in.
      console.log('profile', profile);
    });
  }
}
