namespace HelperServices {

	export class $resourceHelper {
		/** @ngInject */
		constructor(private $q: any) {

		}
		/**
		 * Definition: this method is created to DRY up the repeatitive process of calling 
		 * deferred, resolve, reject from using angular $q in conjuction with $resouce
		 * Usage: resourceRESTCall(resource, method, params); resource is the $resource object get returned from defining a resource, 
		 * 		  method is the method defined inside that resource object. Params is extra params that needs to be passed in the $resouce call
		 */
		resourceRESTCall(resource: angular.resource.IResourceClass<any>, method: string, params: any): angular.IPromise<any> {
			return resource[method](params).$promise;
		}
	};
	
	angular 
		.module('app.helper', []) 
		.service('$resourceHelper', $resourceHelper);
}
