import { MainController } from './components/main/main';
import './components/contacts/contacts';
import { mainNavbar } from './components/navbar/navbar.directive';
import './components/signup/signup';
import './components/signup/signup.service';
import './components/login/login';
import './components/login/login.service';
import './components/helper/helper';
import './components/helper/progressBar';
import './components/auth/auth.service';
import './components/address-book/addressBook';
import './components/address-book/addressBook.service';
import './components/lead/lead';
import './components/lead/lead.service';
import './components/helper/account.service';
declare var moment: moment.MomentStatic;

namespace app {
  
  /** @ngInject */
  function runBlock($rootScope: angular.IRootScopeService, $log: angular.ILogService, $state: any, $stateParams: any, AuthToken: any) {
    let NoTokenState = ['login', 'signup'];
    // simple middleware to prevent unauthorized access and double log in attempt
    
    $rootScope.$on('$stateChangeStart', (event: any, toState: any, toParams: any, fromState: any, fromParams: any) => {

      if (NoTokenState.indexOf(toState.name) === -1) { // should be logged in
        if (!AuthToken.isLoggedIn()) { // prevent double log in
          event.preventDefault();
          $state.go('login', {}, { reload: true });
        }
      } else { // should not be logged in
        if (AuthToken.isLoggedIn()) { // prevent double log in
          event.preventDefault();
          $state.go('main.dashboard', {}, { reload: true });
        }

      }

    });

    $rootScope.$on('badToken', (event: any, data: any) => {
      console.log(data);
      AuthToken.logout();
      $state.go('login', {}, { reload: true });

    });
    
    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications. For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope['$state'] = $state;
    $rootScope['$stateParams'] = $stateParams;

    $log.debug('runBlock end');
  }

  /** @ngInject */
  function config($logProvider: angular.ILogProvider, toastrConfig: any, $httpProvider: angular.IHttpProvider) {
    // enable log
    $logProvider.debugEnabled(true);
    // set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
    // provide token for every request
    $httpProvider.interceptors.push('AuthInterceptor');
    $httpProvider.defaults.withCredentials = false;

  }

  /** @ngInject */
  function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
    $stateProvider
      .state('main', {
        abstract: true,
        templateUrl: 'components/main/main.html',
        controller: 'MainController',
        controllerAs: 'mainCtrl',
        resolve: {
          user: function($http: angular.IHttpService, AuthToken: any, $rootScope: any, $AccountRESTService: any) {

            return $AccountRESTService.accountUser().then(function(response: any) {
              if (response.success) {
                return response.data[0];
              }

            });
          },
          organization: function($http: angular.IHttpService, $AccountRESTService: any) {
            return $AccountRESTService.accountOrganization().then(function(response: any) {
              if (response.success) {
                return response.data;
              }

            });
          },
          organizationMember: function($http: angular.IHttpService, $AccountRESTService: any) {
            return $AccountRESTService.accountOrganizationMember().then(function(response: any) {
              if (response.success) {
                return response.data[0];
              }

            });
          },
          companies: function($http: angular.IHttpService, $AddressBookRESTService: any) {
            return $AddressBookRESTService.allCompanies();
          },
          leads: function($http: angular.IHttpService, $LeadRESTService: any) {
            return $LeadRESTService.allLeads();
          },
          leadStatuses: ($LeadRESTService: any) => {
            return $LeadRESTService.allLeadStatuses().then((response: any) => {
              if (response.success) {
                return response.data;
              } else {
                return {}
              }

            });
          }
        })
      .state('main.dashboard', {
        url: '/dashboard',
        views: {
          'main': {
            template: '{{mainCtrl.user}}<br>{{navCtrl.user}}',
            controller: 'MainController',
            controllerAs: 'mainCtrl',
          }

        },
      });

    $urlRouterProvider.otherwise('/dashboard');


  }

  angular.module('app', [
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'angular-multiple-transclusion',
    'toastr',
    'ngCookies',
    'app.contacts',
    'app.auth',
    'app.account',
    'app.signup',
    'app.login',
    'app.addressBook',
    'app.helper',
    'app.ui.helper',
    'app.lead'
  ])
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .constant('moment', moment)
    .controller('MainController', MainController)
    .directive('mainNavbar', mainNavbar);

  const appContainer = document.documentElement;
  appContainer.setAttribute('ng-strict-di', 'true');
  angular.bootstrap(appContainer, ['app']);
}
