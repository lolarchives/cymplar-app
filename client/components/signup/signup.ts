namespace SignUp {
	
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
		private helloWorld: String;
		/* @ngInject */
		constructor(private $scope: any, private $http: angular.IHttpBackendService) {
			this.helloWorld = 'Hello World';
			$scope.helloWorld = 'Scope hello world';
		};
	};
	angular.module('app.signup', [
		'ui.router'
	])
	.config(config)
	.controller('SignUpController', SignUpController);
}
