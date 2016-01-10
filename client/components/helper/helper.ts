namespace HelperServices {

	export class $resourceHelper {
		private loadingModal: any;
		/** @ngInject */
		constructor(private $q: any, private $uibModal: any) {

		}
		/**
		 * Definition: this method is created to DRY up the repeatitive process of calling 
		 * deferred, resolve, reject from using angular $q in conjuction with $resouce
		 * Usage: resourceRESTCall(resource, method, params); resource is the $resource object get returned from defining a resource, 
		 * 		  method is the method defined inside that resource object. Params is extra params that needs to be passed in the $resouce call
		 */
		resourceRESTCall(resource: angular.resource.IResourceClass<any>, method: string, params: any, loading: boolean): angular.IPromise<any> {
		
			let deferred = this.$q.defer();
			/** provide a way to show loading progress while querying the server
			 * quick and universal, considering moving to tailored solution later
			 */
			if (loading) {
				this.loadingModal = this.$uibModal.open({
					backdrop: 'static', 
					animation: true,
					size: 'sm',
					template: '<div class="text-center"><h1>Loading <i class="fa fa-spinner fa-spin"></i></h1></div>'
				});
			}

			resource[method](params, (response: any) => {
				if (loading) {
					this.loadingModal.close();
				}
				deferred.resolve(response.data);
				
			}, (error: any) => {
				if (loading) {
					this.loadingModal.close();
				}
				deferred.resolve(error.data);
			})

			return deferred.promise;
		}
	};

	angular
		.module('app.helper', [])
		.service('$resourceHelper', $resourceHelper);
}
