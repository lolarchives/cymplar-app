
import '../helper/helper';
import '../auth/auth.service';
import {SignUp, AccountUser, AccountOrganization, AccountOrganizationMember, City, Industry, Country} from '../../core/dto.ts';

namespace SignUp {
	export interface SignUpDetails {
		organizationName: string;
		username: string;
		firstName: string;
		middleName: string;
		lastName: string;
		email: string;
		password: string;
		passwordConfirm: string;
		country: string;
		state: string;
		city: string;
		suburb?: string;
		postcode?: number;
		industryType: string;
		description: string;
		team?: number;
		web?: string;
		contactNumber: string;
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
				controllerAs: 'suCtrl',
				resolve: {
					countries: ($SignUpRESTService: any) => {
						return $SignUpRESTService.getCountries().then((response: any) => {
							return response.data;
						});
					},
					industries: ($SignUpRESTService: any) => {
						return $SignUpRESTService.getIndustries().then((response: any) => {
							return response.data;
						});
					},
				}
			});
	}

	export class SignUpController {

		organizationNameChanged = () => {

			this.checkingOrganization = true;
			this.availableOrganizationName = undefined;
			if (this.signUpDetails.organizationName !== undefined && this.signUpDetails.organizationName.trim() !== '') {
				this.$SignUpRESTService.isAccountOrganizationExisted(this.signUpDetails.organizationName).then((response: any) => {
					this.checkingOrganization = false;
					this.availableOrganizationName = !response.data.exist;

				});
			} else {
				this.checkingOrganization = false;
			}
		};
		usernameChanged = () => {
			this.checkingUsername = true;
			this.availableUsername = undefined;
			if (this.signUpDetails.username !== undefined && this.signUpDetails.username.trim() !== '') {
				this.$SignUpRESTService.isAccountUserExisted(this.signUpDetails.username).then((response: any) => {
					this.checkingUsername = false;
					this.availableUsername = !response.data.exist;

				});
			} else {
				this.checkingUsername = false;
			}
		};

		emailChanged = () => {
			this.checkingEmail = true;
			this.availableEmail = undefined;
			if (this.signUpDetails.email !== undefined && this.signUpDetails.email.trim() !== '') {
				this.$SignUpRESTService.isAccountOrganizatioMemberExisted(this.signUpDetails.email).then((response: any) => {
					this.checkingEmail = false;
					this.availableEmail = !response.data.exist;

				});
			} else {
				this.checkingEmail = false;
			}

		};

		mapFormToDto = (details: SignUpDetails): SignUp => {
			let result: SignUp = <SignUp>{};

			let accountUser: AccountUser = {
				username: details.username,
				password: details.password,
				firstName: details.firstName,
				middleName: details.middleName,
				lastName: details.lastName,
			};

			let organization: AccountOrganization = {
				name: details.organizationName,
				domain: details.organizationName,
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
			result = {
				user: accountUser,
				organization: organization,
				organizationMember: organizationMember,
			};

			return result;
		};


		private signUpDetails: SignUpDetails;
		private errors: Array<string> = [];
		private passwordConfirmation: string;
		private firstStep: boolean;
		private secondStep: boolean;
		private finalStep: boolean;
		private cachedCities: any = {};
		private checkingOrganization: boolean;
		private availableOrganizationName: boolean;
		private availableUsername: boolean;
		private availableEmail: boolean;
		private checkingUsername: boolean;
		private checkingEmail: boolean;
		private queryingCity: boolean;
		private availableCities: any = [];
		private disableCity: boolean = true;
		private cachedStates: any[] = [];
		private availableStates: any[] = [];
		private disableState: boolean = true;
		private queryingState: boolean;
		
		
		/* @ngInject */
		constructor(private $scope: any, private $http: angular.IHttpBackendService, private $log: angular.ILogService,
			private $SignUpRESTService: any, private countries: any, private industries: any,
			private AuthToken: any, private $state: any) {
			this.firstStep = true;
			this.secondStep = false;
			this.finalStep = false;
			this.signUpDetails = <SignUpDetails>{};
		};
		
		
		
		//TODO: add in email check from server, check organization name from server, username check from server
		submitStep1(step1Form: any) {
			this.errors = [];
			if (this.signUpDetails.password !== this.passwordConfirmation) {
				this.errors.push('Passwords does not match');
			}
			if (this.errors.length === 0 && this.availableEmail && this.availableOrganizationName && this.availableUsername) {
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

			this.$SignUpRESTService.signUp(this.mapFormToDto(this.signUpDetails)).then((response: any) => {
				if (response.success) {
					this.AuthToken.setToken(response.data.token);
					this.AuthToken.setIdO(response.data.init);
					alert('Successfully sign up');
					this.$state.go('main.dashboard');
				}


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
			this.disableCity = true;
			this.signUpDetails.city = undefined;
			this.queryingCity = false;
			if (this.signUpDetails.country === undefined || this.signUpDetails.country === null) {
				this.disableState = true;
				this.signUpDetails.state = undefined;
				this.queryingState = false;
			} else {
				if (this.cachedStates[this.signUpDetails.country] === undefined) {
					this.queryingState = true;
					this.disableState = true;
					this.$SignUpRESTService.getStates(this.signUpDetails.country).then((response: any) => {
						this.cachedStates[this.signUpDetails.country] = response;
						this.queryingState = false;
						this.disableState = false;
						this.availableStates = response.data;

					});
				} else {
					this.disableState = false;
					this.availableStates = this.cachedCities[this.signUpDetails.country];
				}
			}
		}
		stateChanged() {
			if (this.signUpDetails.state === undefined || this.signUpDetails.state === null) {

				this.disableCity = true;
				this.signUpDetails.city = undefined;
				this.queryingCity = false;
			} else {
				if (this.cachedCities[this.signUpDetails.state] === undefined) {
					this.queryingCity = true;
					this.disableCity = true;
					this.$SignUpRESTService.getCities(this.signUpDetails.state).then((response: any) => {
						this.cachedCities[this.signUpDetails.state] = response;

						this.queryingCity = false;
						this.disableCity = false;
						this.availableCities = response.data;

					});
				} else {
					this.disableCity = false;
					this.availableCities = this.cachedCities[this.signUpDetails.country];
				}
			}
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
