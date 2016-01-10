namespace AuthServices {
	
	export class AuthToken {
		constructor (private $cookies: any) {
			
		}
		setToken (token: any) {
			if (token) {
				this.$cookies.set('token', token);
			} else {
				this.$cookies.remove('token');
			}
		}
		getToken(): any {
			return this.$cookies.get('token');
		}
		setIdO (ido: any) {
			if (ido) {
				this.$cookies.set('ido', ido);
			} else {
				this.$cookies.remove('ido');
			}
		}
		getIdoO(): any {
			return this.$cookies.get('ido');
		} 
	}
	
	export class AuthInterceptor {
		constructor (private AuthToken: any, private $q: any) {
			
		}
		
		request (config: any): any {
			let token = this.AuthToken.getToken();
			if (token) {
				config.headers['Authentication'] = token;
			};
			return config;
		}
		responseError (response: any) {
		
			return this.$q.reject(response);
		}
	}
	/** @ngInject */
	function getAuthTokenInstance ($cookies: any) {
		return new AuthToken($cookies);
	}
	
	/** @ngInject */
	function getAuthInterceptorInstance (AuthToken: any, $q: any) {
		return new AuthInterceptor(AuthToken, $q);
	}
	
	angular
		.module('app.auth')
		.factory('AuthToken', getAuthTokenInstance)
		.factory('AuthInterceptor', getAuthInterceptorInstance);
}