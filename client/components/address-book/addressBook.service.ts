import './addressBook';
import {BACK_END_ROUTE} from '../../core/dto';

namespace AddressBookServices {
	function $AddressBookRESTResource($resource: angular.resource.IResourceService): angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource("", {}, {
			'newCompany': {
				method: 'POST',
				url: BACK_END_ROUTE + '/address-book-group'
			},
			'allCompanies': {
				method: 'GET',
				url: BACK_END_ROUTE + '/address-book-group'
			}
		});
		return resources;
	}
	export class $AddressBookRESTService {
		constructor(private $http: angular.IHttpService, private $AddressBookRESTResource: any, private $q: any, private $resourceHelper: any) {

		}
		newCompany = (company: any) => {
			return this.$resourceHelper.resourceRESTCall(this.$AddressBookRESTResource, "newCompany", company, true);
		};
		allCompanies = () => {
			return this.$resourceHelper.resourceRESTCall(this.$AddressBookRESTResource, "allCompanies");
		};
	}
	
	function get$AddressBookRESTServiceInstance($http: angular.IHttpService, $AddressBookRESTResource: any, $q: any, $resourceHelper: any) {
        return new $AddressBookRESTService($http, $AddressBookRESTResource, $q, $resourceHelper);
    }
	angular
		.module('app.addressBook')
		.factory('$AddressBookRESTResource', $AddressBookRESTResource)
		.factory('$AddressBookRESTService', get$AddressBookRESTServiceInstance);
}