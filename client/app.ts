/// <reference path="app.d.ts" />
'use strict';

module Cymplar2App {

    angular.module('cymplar2', [
        'ui.router',
        'ngStorage',
        'ngResource',
        'ngSanitize',
        'ngAnimate'
    ])

        .constant('CONFIG', {
            'API_SERVER': 'http://localhost:9000',
            'IS_DESKTOP_APP': (typeof isDesktopApp !== 'undefined' ? isDesktopApp : false)
        })

        .config(function(
            $stateProvider: ng.ui.IStateProvider,
            $urlRouterProvider: ng.ui.IUrlRouterProvider,
            $locationProvider: ng.ILocationProvider,
            CONFIG: IAppConfig) {

            $urlRouterProvider.otherwise('/login');
            if (!CONFIG.IS_DESKTOP_APP)
                $locationProvider.html5Mode(true);
        });

}
