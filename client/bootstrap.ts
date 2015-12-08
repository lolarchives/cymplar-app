import { MainController } from './components/main/main';

namespace app {
  
  /** @ngInject */
  function runBlock($log: angular.ILogService) {
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
    'ui.router',
    'ui.bootstrap',
    'toastr'
  ])
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .controller('MainController', MainController);

  const appContainer = document.documentElement;
  appContainer.setAttribute('ng-strict-di', 'true');
  angular.bootstrap(appContainer, ['app']);
}
