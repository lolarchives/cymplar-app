namespace SignUpServices {
	/** @ngInject */
	let sampleUrl = "http://jsonplaceholder.typicode.com";
    function $SignUpRESTResource($resources: angular.resource.IResourceService): angular.resource.IResourceClass<any> {
		let url = "/api/signup";
		
		// TODO: fix this once have the real api
		let resources: angular.resource.IResourceClass<any> = $resources(url, {}, {
			'getAll': {
				method: 'POST',
				params: {},
				url: url
			},
			'getById': {
				method: 'POST',
				params: {},
				url: url
			},
			'getSampleJson': {
				method: 'GET',
				url: sampleUrl + '/users',
				params: {text: 'sample text'}
			}
		});
		
		return resources;
	};
	
	/** @ngInject */
    export function $SignUpRESTService($http: angular.IHttpService): any {
		return {
			getSampleJson(): angular.IPromise< any > {
				let result: angular.IPromise<any> = $http.get(sampleUrl + '/users', {});
				return result;
			},
		};
	};
	angular
		.module('app.signup.service', [])
		//.factory('$SignUpRESTResource', $SignUpRESTResource)
		.factory('$SignUpRESTService', $SignUpRESTService);
}
