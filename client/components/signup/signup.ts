
import '../helper/helper';
import {SignUp, AccountUser, AccountOrganization, AccountOrganizationMember, City, Industry, Country} from "../../core/dto.ts";

namespace SignUp {
	export interface SignUpDetails {
		organizationName: string;
		username: string;
		email: string;
		password: string;
		passwordConfirm: string;
		country: string;
		city: string;
		suburb?: string;
		postcode?: number;
		industryType: string;
		description: string;
		team?: number;
		facebook?: string;
		linkedin?: string;
		twitter?: string;
		plus?: string;
		dribble?: string;
		pinterest?: string;
	}


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
			let RESTCall = this.$SignUpRESTService.getSampleJsonFromResource({console: 'hi'} );
			RESTCall.then(function(response: any) {
				console.log('success:', response);
				alert('Check console for info');
			}, function(error: any) {
				console.log('error', error);
			});
			console.log(RESTCall);
		};
		
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
		
		private mapFormToDto(details: SignUpDetails): SignUp {
			let result: SignUp = <SignUp>{};
			let city: City = { name: details.city, country: details.country };
	
			let accountOrganization: AccountOrganization = {
				name: details.organizationName,
				description: details.description,
				city: city,
				postcode: details.postcode,
				suburb: details.suburb,
			};

			return result;
		}

	};
	angular.module('app.signup', [
		'ui.router',
		'ngResource',
		'app.helper'
	])
		.config(config)
		.controller('SignUpController', SignUpController);
}
