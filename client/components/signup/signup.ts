namespace SignUp {
	angular.module('app.signup', [
		'ui.router'
	])
	.config(config)
	.controller('SignUpController', SignUpController);
	
	/* @ngInject */
	function config($stateProvider: any) {
		$stateProvider
			.state('signup', {
				url: '/signup',
				templateUrl: 'components/signup/signup.html',
				controller: 'SignUpController',
				controllerAs: 'suCtrl'
			});
	}
	
	export class SignUpController {
		/* @ngInject */
		constructor(private $scope: angular.IScope, private $http: angular.IHttpBackendService, private helloWorld: String) {
			this.helloWorld = 'Hello World';
		};
	};
	
}
