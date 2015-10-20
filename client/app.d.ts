/// <reference path="../shared.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../typings/socket.io-client/socket.io-client.d.ts" />

declare var isDesktopApp: boolean;

declare module Cymplar2App {

    interface IAppConfig {
        API_SERVER: string;
        IS_DESKTOP_APP: boolean;
    }

}
