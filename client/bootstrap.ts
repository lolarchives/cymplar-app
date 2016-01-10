import { MainController } from './components/main/main';
import './components/contacts/contacts';
import { mainNavbar } from './components/navbar/navbar.directive';
import './components/signup/signup';
import './components/signup/signup.service';
import './components/login/login';
import './components/login/login.service';
import './components/helper/helper';

declare var moment: moment.MomentStatic;

namespace app {
  
  /** @ngInject */
  function runBlock($rootScope: angular.IRootScopeService, $log: angular.ILogService, $state: any, $stateParams: any) {
 
    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications. For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope['$state'] = $state;
    $rootScope['$stateParams'] = $stateParams;
 
    $log.debug('runBlock end');
  }

  /** @ngInject */
  function config($logProvider: angular.ILogProvider, toastrConfig: any) {
    // enable log
    $logProvider.debugEnabled(true);
    // set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }

  /** @ngInject */
  function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'components/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      });
    $urlRouterProvider.otherwise('/');
  }

  angular.module('app', [
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'toastr',
    'ngCookies',
    'app.contacts',
    'app.signup',
    'app.login',
    'app.helper',
      
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
