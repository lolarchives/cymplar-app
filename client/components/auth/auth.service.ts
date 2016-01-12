namespace AuthServices {

	export class AuthToken {
		constructor(private $cookies: any, private $window: any) {
			
		}
		setToken(token: any) {
			if (token) {
				this.$window.localStorage.set('token', token);
			} else {
				this.$window.localStorage.remove('token');
			}
		}
		getToken(): any {
			return this.$window.localStorage.get('token');
		}
		setIdO(ido: any) {
			if (ido) {
				this.$window.localStorage.put('ido', ido);
			} else {
				this.$window.localStorage.remove('ido');
			}
		}
		getIdO(): any {
			return this.$window.localStorage.get('ido');
		}
		isLoggedIn(): boolean {
			return (this.$window.localStorage.get('token') !== undefined) && (this.$window.localStorage.get('ido') !== undefined) ;
		}
	}

	function AuthInterceptor(AuthToken: any, $q: any): any {
		/** ngInject */
		let AuthInterceptorFactory = {};
		AuthInterceptorFactory["request"] = (config: any): any => {
			let token = AuthToken.getToken();
			if (token) {
				config.headers['Authorization'] = "Bearer " + token;
			};
			return config;
		};
		AuthInterceptorFactory["responseError"] = (response: any) => {

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