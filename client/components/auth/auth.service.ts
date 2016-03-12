namespace AuthServices {

	export class AuthToken {
		constructor(private $cookies: any, private $window: any) {
			
		}
		setToken(token: any) {
			if (token) {
				this.$window.localStorage.setItem('token', token);
			} else {
				this.$window.localStorage.removeItem('token');
			}
		}
		getToken(): any {
			return this.$window.localStorage.getItem('token') || undefined;
		}
		setIdO(ido: any) {
			if (ido) {
				this.$window.localStorage.setItem('ido', ido);
			} else {
				this.$window.localStorage.removeItem('ido');
			}
		}
		getIdO(): any {
			return this.$window.localStorage.getItem('ido') || undefined;
		}
		isLoggedIn(): boolean {
			return (this.$window.localStorage.getItem('token') !== null) && (this.$window.localStorage.getItem('ido') !== null) ;
		}
		logout() {
			this.$window.localStorage.removeItem('token');
			this.$window.localStorage.removeItem('ido');
			this.$window.localStorage.removeItem('invitation');
		}
		setInvitation(inv: any) {
			if (inv) {
				this.$window.localStorage.setItem('invitation', inv);
			} else {
				this.$window.localStorage.removeItem('invitation');
			}
		}
		getInvitation(): any {
			return this.$window.localStorage.getItem('invitation') || undefined;
		}
		getInvitationUrlParam(): any {
			const urlParams = {};
			if (this.getInvitation()) {
				urlParams['inv'] = this.getInvitation();
			}
			return urlParams;
		}
	}

	function AuthInterceptor(AuthToken: any, $q: any): any {
		/** ngInject */
		let AuthInterceptorFactory = {};
		AuthInterceptorFactory['request'] = (config: any): any => {
			let token = AuthToken.getToken();
			if (token) {
				config.headers['Authorization'] = 'Bearer ' + token;
			};
			return config;
		};
		AuthInterceptorFactory['responseError'] = (response: any) => {

			return $q.reject(response);
		};
		return AuthInterceptorFactory;
	}
	/** @ngInject */
	function getAuthTokenInstance($cookies: any, $window: any) {
		return new AuthToken($cookies, $window);
	}
	
	/** @ngInject */
	

	angular
		.module('app.auth', [])
		.factory('AuthToken', getAuthTokenInstance)
		.factory('AuthInterceptor', AuthInterceptor);
}