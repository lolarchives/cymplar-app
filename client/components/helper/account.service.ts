import {BACK_END_ROUTE} from '../../core/dto';
import '../auth/auth.service';
namespace AccountService {

	function $AccountRESTResource($resource: angular.resource.IResourceService, AuthToken: any): angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource("", {}, {
			'accountUser': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-user/_find'
			},
			'accountOrganization': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization/' + AuthToken.getIdO()
			},
			'accountOrganizationMember': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization-member/_find?ido=' + AuthToken.getIdO()
			}
		});
		return resources;
	}

	export class $AccountRESTService {
		constructor(private $http: angular.IHttpService, private $AccountRESTResource: any, private $q: any, private $resourceHelper: any) {

		}
		accountUser = () => {
			return this.$resourceHelper.resourceRESTCall(this.$AccountRESTResource, "accountUser");
		};
		accountOrganization = () => {
			return this.$resourceHelper.resourceRESTCall(this.$AccountRESTResource, "accountOrganization");
		};
		accountOrganizationMember = () => {
			return this.$resourceHelper.resourceRESTCall(this.$AccountRESTResource, "accountOrganizationMember");
		};
	}

	function get$AccountRESTServiceInstance($http: angular.IHttpService, $AccountRESTResource: any, $q: any, $resourceHelper: any) {
        return new $AccountRESTService($http, $AccountRESTResource, $q, $resourceHelper);
    }
	angular
		.module('app.account',[])
		.factory('$AccountRESTResource', $AccountRESTResource)
		.factory('$AccountRESTService', get$AccountRESTServiceInstance);
}