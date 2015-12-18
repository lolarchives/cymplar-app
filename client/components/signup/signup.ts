import {SignUpDetails} from "../../core/dto";
import './signup.service';
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
		private signUpDetails: SignUpDetails;
		private errors: Array<string>;
		private passwordConfirmation: string;
	    private firstStep: boolean;
		private secondStep: boolean;
		private finalStep: boolean;
		/* @ngInject */
		constructor(private $scope: any, private $http: angular.IHttpBackendService, private $log: angular.ILogService, 
					private $SignUpRESTService: any) {
			this.firstStep = true;
			this.secondStep = false;
			this.finalStep = false;
			
			// this is to bypass validation process, for testing, comments out when deploys
			this.passwordConfirmation = 'abcdeF1';
			this.signUpDetails = <SignUpDetails>{
				organizationName: 'A',
				username: 'B',
				email: 'C@D.com',
				password: 'abcdeF1',
				country: 'Wano',
				city: 'Dawn',
				industryType: 'B',
				description: 'C'
			};
		};
		//TODO: add in email check from server, check organization name from server, username check from server
		submitStep1(step1Form: any) {
			
			this.errors = [];
			if (this.signUpDetails.password !== this.passwordConfirmation) {
				this.errors.push("Passwords does not match");
			} else {
				this.firstStep = false;
				this.secondStep = true;
			}
		}
	
		submitStep2(step2Form: any) {
		
			this.errors = [];
			this.secondStep = false;
			this.finalStep = true;
		}
		submitFinalSep(finalStepForm: any) {
			this.$log.info('signup details ', this.signUpDetails);
			this.errors = [];
			
			// TODO: rearranged the object here according to the backend schema
			this.$SignUpRESTService.getSampleJson().then(function (response: any) {
				console.log(response);
				alert('Check console for info');
				return response;
			});
		}
		
		back() {
			this.errors = [];
			if (this.secondStep) {
				this.secondStep = false;
				this.firstStep = true;
			} else if (this.finalStep) {
				this.finalStep = false;
				this.secondStep = true;
			}
		}
		
	};
	angular.module('app.signup', [
		'ui.router',
		'app.signup.service'
	])
	.config(config)
	.controller('SignUpController', SignUpController);
}
