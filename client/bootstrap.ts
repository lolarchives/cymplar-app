import {bootstrap, provide} from 'angular2/angular2';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import * as Auth0Lock from 'auth0-lock';

import {HttpClient} from './core/http_client';
import {AppCmp} from './components/app/app';

bootstrap(AppCmp, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  HttpClient,
  provide(Auth0Lock, {useFactory: () =>
    new Auth0Lock('QH1eM81uIkbfsambqkBlSiHlipo4sCNt', 'cymplar.auth0.com')
  })
]);
