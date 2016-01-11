namespace AuthServices {

	export class AuthToken {
		constructor(private $cookies: any) {
			
		}
		setToken(token: any) {
			if (token) {
				this.$cookies.put('token', token);
			} else {
				this.$cookies.remove('token');
			}
		}
		getToken(): any {
			return this.$cookies.get('token');
		}
		setIdO(ido: any) {
			if (ido) {
				this.$cookies.put('ido', ido);
			} else {
				this.$cookies.remove('ido');
			}
		}
		getIdO(): any {
			return this.$cookies.get('ido');
		}
		isLoggedIn(): boolean {
			return (this.$cookies.get('token') !== undefined) && (this.$cookies.get('ido') !== undefined) ;
		}
	}

	function AuthInterceptor(AuthToken: any, $q: any): any {
		/** ngInject */
		let AuthInterceptorFactory = {};
		AuthInterceptorFactory["request"] = (config: any): any => {
			let token = AuthToken.getToken();
			if (token) {
				config.headers['Authorization'] = "Bearer "+token;
			};
			return config;
		}
		AuthInterceptorFactory["responseError"] = (response: any) => {

			return $q.reject(response);
		}
		return AuthInterceptorFactory;
	}
	/** @ngInject */
	function getAuthTokenInstance($cookies: any) {
		return new AuthToken($cookies);
	}
	
	/** @ngInject */
	

	angular
		.module('app.auth',[])
		.factory('AuthToken', getAuthTokenInstance)
		.factory('AuthInterceptor', AuthInterceptor);
}