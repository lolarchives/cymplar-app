import './signup';
namespace SignUpServices {

	const SAMPLE_URL = "http://jsonplaceholder.typicode.com";
	/** @ngInject */
    function $SignUpRESTResource($resource: angular.resource.IResourceService): angular.resource.IResourceClass<any> {
		let url = "/api/signup";
		
		// TODO: fix this once have the real api
		let resources: angular.resource.IResourceClass<any> = $resource(url, {}, {
			'getSampleJson': {
				method: 'GET',
				isArray: true,
				url: SAMPLE_URL + '/users',
				params: {text: 'sample text'}
			}
		});
		
		return resources;
	};
	
	
     export class $SignUpRESTService {
		constructor (private $http: angular.IHttpService, private $SignUpRESTResource: any, private $q: any, private $resourceHelper: any) {
			
		}
		
		getSampleJson = () => {
			let result: angular.IPromise<any> = this.$http.get(SAMPLE_URL + '/users', {});
				return result;
		};
		getSampleJsonFromResource = ( params: any) => {
			return this.$resourceHelper.resouceRESTCall( this.$SignUpRESTResource, "getSampleJson", params);
		}; 

	};
	
	function get$SignUpRESTServiceInstance($http: angular.IHttpService, $SignUpRESTResource: any, $q: any, $resourceHelper: any) {
        return new $SignUpRESTService($http, $SignUpRESTResource , $q, $resourceHelper);
    }
	
	angular
		.module('app.signup')
		.factory('$SignUpRESTResource', $SignUpRESTResource)
		.factory('$SignUpRESTService', get$SignUpRESTServiceInstance);
}
