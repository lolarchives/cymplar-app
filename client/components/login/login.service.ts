import './login';
import {BACK_END_ROUTE, LogIn} from '../../core/dto';

namespace LoginServices {

	function $LoginRESTResource($resource: angular.resource.IResourceService): angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource("", {}, {
			'accountOrganizationLogin': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization/_login'
			},
			'accountLogin': {
				method: 'POST',
				url: BACK_END_ROUTE + '/login'
			}
		});
		return resources;
	}

	export class $LoginRESTService {
		constructor(private $http: angular.IHttpService, private $LoginRESTResource: any, private $q: any, private $resourceHelper: any) {

		}
		accountOrganizationLogin = (domain: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$LoginRESTResource, "accountOrganizationLogin", {domain: domain}, true);
		};
		accountLogin = (login: LogIn) => {
			return this.$resourceHelper.resourceRESTCall(this.$LoginRESTResource, "accountLogin", login, true);
		};
	}
	
	function get$LoginRESTServiceInstance($http: angular.IHttpService, $LoginRESTResource: any, $q: any, $resourceHelper: any) {
        return new $LoginRESTService($http, $LoginRESTResource, $q, $resourceHelper);
    }
	angular
		.module('app.login')
		.factory('$LoginRESTResource', $LoginRESTResource)
		.factory('$LoginRESTService', get$LoginRESTServiceInstance);
}