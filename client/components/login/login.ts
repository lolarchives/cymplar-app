import '../helper/helper';
import '../auth/auth.service';
import {LogIn} from '../../core/dto.ts';

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
		private loginError: boolean;
		private errorMessage: string;
		/** @ngInject */
		constructor(private $LoginRESTService: any, private $cookies: any, 
			private $SignUpRESTService: any, private AuthToken: any, private $state: any) {
			
		};
		submitDomain() {
			if (this.domain !== undefined && this.domain.trim() !== '') {
				this.$LoginRESTService.accountOrganizationLogin(this.domain.toLowerCase()).then((response: any) => {
					this.domainExist = response.success;
					if (this.domainExist) {
						this.accountOrganizationId = response.data._id;
					}
				});
			}
		}
		
		login() {
			const organization = this.accountOrganizationId;
			this.loginDetails.organization = organization;
			this.$LoginRESTService.accountLogin(this.loginDetails).then((response: any) => {
				this.loginError = !response.success;
				this.errorMessage = response.msg;
				if (response.success) {
					this.AuthToken.setToken(response.data.token);
					this.AuthToken.setIdO(organization);
					const urlInvParam = this.AuthToken.getInvitationUrlParam();
					this.$state.transitionTo('main.dashboard', urlInvParam);
				}
			});
		}
		
		switchDomain() {
			this.domainExist = undefined;
			this.accountOrganizationId = undefined;
		}
		
		resgisterNow() {
			const urlParam = this.AuthToken.getInvitationUrlParam();
      		this.$state.go('signup', urlParam, { reload: true });
		}
	};
	angular
		.module('app.login', [
			'ui.router',
			'app.signup',
			'app.helper',
			'app.auth',
			'ngCookies'
		])
		.config(config)
		.controller('LoginController', LoginController);
}
