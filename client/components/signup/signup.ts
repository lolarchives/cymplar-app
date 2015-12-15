import {SignUpDetails} from "../../core/dto";
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
		private helloWorld: string;
		private signUpDetails: SignUpDetails;

		/* @ngInject */
		constructor(private $scope: any, private $http: angular.IHttpBackendService, private $log: angular.ILogService) {
			this.helloWorld = 'Hello World';
			$scope.helloWorld = 'Scope hello world';
		};
		
		submitStep1(step1Form: any) {
			this.$log.info(this.signUpDetails);
		}
	};
	angular.module('app.signup', [
		'ui.router'
	])
	.config(config)
	.controller('SignUpController', SignUpController);
}
