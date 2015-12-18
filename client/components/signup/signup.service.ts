namespace SignUpServices {
	/** @ngInject */
	export function $SignUpRESTResouces($http: angular.IHttpService): any {
		
	};
	angular
		.module("app.signup.services")
		.factory("$SignUpRESTResources", $SignUpRESTResouces); 
}
