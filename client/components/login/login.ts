import '../helper/helper';

import {LogIn} from "../../core/dto.ts";

namespace Login {
	/** @ngInject */
	function config($stateProvider: any) {
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'components/login/login.html',
				controller: 'LoginController',
				controllerAs: 'liCtrl'
			});
	}

	export class LoginController {
		

		private domain: string;
		private domainExist: boolean;
		private accountOrganizationId: string;
		private loginDetails: any;
		/** @ngInject */
		constructor(private $LoginRESTService: any, private $cookies: any, private $SignUpRESTService: any) {
			
		};
		submitDomain() {
			if (this.domain !== undefined && this.domain.trim() !== '') {
				this.$LoginRESTService.accountOrganizationLogin(this.domain).then((response: any) => {
					this.domainExist = response.success;
					if (this.domainExist) {
						this.accountOrganizationId = response.data._id; 
					}
				}, (error: any) => {
					this.domainExist = error.data.success;
				});
			}
		}
		login() {
			this.loginDetails.organization = this.domain;
			this.$LoginRESTService.accountLogin(this.loginDetails).then((response: any) => {
				console.log('response', response);
			}, (error: any) => {
				console.log('Errors', error);
			});
		}
	};
	angular
		.module('app.login', [
			'ui.router',
			'app.signup',
			'app.helper',
			'ngCookies'
		])
		.config(config)
		.controller('LoginController', LoginController);
}
