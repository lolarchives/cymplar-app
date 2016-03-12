namespace HelperServices {

	export class $resourceHelper {
		private loadingModal: any;
		/** @ngInject */
		constructor(private $q: any, private $uibModal: any, private $rootScope: any) {
		
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
			/**
			 * Using custom promise and $q to DRY up some of the code ,
			 *  everything will be handle in the success call in controller 
			 * with more descriptive error message
			 */
			resource[method](params, (response: any) => {
				if (loading) {
					this.loadingModal.close();
				}
				deferred.resolve(response);
			}, (error: any) => {
				if (loading) {
					this.loadingModal.close();
					error.data.status = error.status;
				}
				console.log('error', error);
				if (error.data.token === false) {
					this.$rootScope.$broadcast('badToken', {data: 'Illegal token access'});
				}
			
				error.data.statusText = error.statusText;
				deferred.resolve(error.data);
			});

			return deferred.promise;
		}
	};
	export class ultiHelper {
		indexOfFromId(arr: any[], obj: any) {
			
			for	(let i = 0; i < arr.length; i++) {
				if (arr[i]._id === obj._id) {
					return i;
				}
			}
			
			return -1;
		}
	}
	angular
		.module('app.helper', [])
		.service('$resourceHelper', $resourceHelper)
		.service('ultiHelper', ultiHelper);
}
