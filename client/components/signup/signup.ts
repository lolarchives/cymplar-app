
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
		web?: string;
		facebook?: string;
		linkedin?: string;
		twitter?: string;
		plus?: string;
		dribble?: string;
		pinterest?: string;
		contactNumber?: string;
	}


	/* @ngInject */
	function config($stateProvider: any) {
		$stateProvider
			.state('signup', {
				url: '/signup',
				templateUrl: 'components/signup/signup.html',
				controller: 'SignUpController',
				controllerAs: 'suCtrl',
				resolve: {
					countries: ($SignUpRESTService: any) => {
						return $SignUpRESTService.getCountries();
					},
					cities: ($SignUpRESTService: any) => {
						return $SignUpRESTService.getCities();
					},
					industries: ($SignUpRESTService: any) => {
						return $SignUpRESTService.getIndustries();
					},
					// not yet implemented
					/*roles: ($SignUpRESTService: any) => {
						return $SignUpRESTService.getRoles();
					}*/
				}
			});
	}

	export class SignUpController {
		private signUpDetails: SignUpDetails;
		private errors: Array<string>;
		private passwordConfirmation: string;
		private firstStep: boolean;
		private secondStep: boolean;
		private finalStep: boolean;
		private cachedCities: any = {};
		private availableCities: any = [
			{	"_id": "56738efef76ae1323312ba7c",
		 		"updatedAt": 1450413822843, 
				"createdAt": 1450413822843,
				"code": "SYD",
				"name": "Sidney",
				"country": "56738c5fd4c571f932e75a90", 
				"__v": 0}, 
			{	"_id": "56738c6bd4c571f932e75a91",
				"updatedAt": 1450413163466,
				"createdAt": 1450413163466,
				"code": "MEL",
				"name": "Melbourne",
				"country": "56738c5fd4c571f932e75a90",
				"__v": 0
			}] ;
		private disableCity: boolean = true;
		/* @ngInject */
		constructor(private $scope: any, private $http: angular.IHttpBackendService, private $log: angular.ILogService,
			private $SignUpRESTService: any, private cities: any, private countries: any, private industries: any) {
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
				country: '56738c5fd4c571f932e75a90',
				city: '56738efef76ae1323312ba7c',
				industryType: '56738c35d4c571f932e75a8e',
				description: 'C',
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
			let RESTCall = this.$SignUpRESTService.getSampleJsonFromResource({ console: 'hi' });
			RESTCall.then(function(response: any) {
				console.log('success:', response);
				alert('Check console for info');
			}, function(error: any) {
				console.log('error', error);
			});

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
		countryChanged() {
			// implement caching for higher network efficiency

			if (this.signUpDetails.country === undefined) {
				this.disableCity = true;
				this.signUpDetails.city = undefined;
			} else {
				if (this.cachedCities[this.signUpDetails.country] === undefined) {
					this.disableCity = true;
					this.$SignUpRESTService.getCities( this.signUpDetails.country).then((response: any) => {
						this.cachedCities[this.signUpDetails.country] = response;
						this.disableCity = false;
						this.availableCities = response;
					
					});
				} else {
					this.disableCity = false;
					this.availableCities = this.cachedCities[this.signUpDetails.country];
				}
			}

			
		}
		organizationNameChanged() {
			this.$SignUpRESTService.isAccountOrganizationExisted(this.signUpDetails.organizationName).then( (response: any) => {
				console.log(response);	
			});
		}
		usernameChanged() {
			this.$SignUpRESTService.isAccountUserExisted(this.signUpDetails.username).then( (response: any) => {
				console.log(response);	
			});
		}
		// TODO: finish this method
		private mapFormToDto(details: SignUpDetails): SignUp {
			let result: SignUp = <SignUp>{};
			
			let accountUser: AccountUser = {
				
			};	

			let organization: AccountOrganization = {
				name: details.organizationName,
				description: details.description,
				city: details.city,
				postcode: details.postcode,
				suburb: details.suburb,
				industry: details.industryType,
				team: details.team,
				web: details.web,
				facebook: details.facebook,
				linkedin: details.linkedin,
				twitter: details.twitter,
				plus: details.plus,
				dribble: details.dribble,
				pinterest: details.pinterest,
			};
			let organizationMember: AccountOrganizationMember = {
				email: details.email,
				contactNumber: details.contactNumber
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
