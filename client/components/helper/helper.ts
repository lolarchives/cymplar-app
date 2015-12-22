namespace HelperServices {

	export class $resourceHelper {
		/** @ngInject */
		constructor(private $q: any) {

		}
		resouceRESTCall(resource: angular.resource.IResourceClass<any>, method: string, params: any): angular.IPromise<any> {
			let deferred = this.$q.defer();
			resource[method](params, function(response: any) {
				deferred.resolve(response);
			}, function(error: any) {
				deferred.reject(error);
			})
			return deferred.promise;
		}
	};
	
	angular
		.module('app.helper',[])
		.service('$resourceHelper',$resourceHelper)
}
