import {BACK_END_ROUTE} from '../../core/dto';
import '../auth/auth.service';
namespace AccountService {

	function $AccountRESTResource($resource: angular.resource.IResourceService, AuthToken: any): angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource('', {}, {
			'accountUser': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-user/_find'
			},
			'accountOrganization': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization/' + AuthToken.getIdO(),
			},
			'accountOrganizationMember': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization-member/_find'
			},
			'accountOrganizations': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization-member/_find',
			},
			'accountOrganizationParam': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization/:id'
			},
			'accountOrganizationMemberParam': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization-member/_find'
			},
			'saveAccountOrganizationMember': {
				method: 'PUT',
				url: BACK_END_ROUTE + '/account-organization-member/:id',
				params: {
					id: '@_id',
					ido: '@organization._id'
				}
			},
			'accountOrganizationTeam': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization-member/_find_team'
			},
			'saveAccountOrganization': {
				method: 'PUT',
				url: BACK_END_ROUTE + '/account-organization/:id',
				params: {
					id: '@_id',
					ido: '@_id'
				}
			}
		});
		return resources;
	}
	
	export class $AccountRESTService {
		constructor(private $http: angular.IHttpService, private $AccountRESTResource: any, private $q: any, 
			private $resourceHelper: any, private AuthToken: any) {
		}
		accountUser = () => {
			return this.$resourceHelper.resourceRESTCall(this.$AccountRESTResource, 'accountUser');
		};
		accountOrganization = () => {
			return this.$resourceHelper.resourceRESTCall(this.$AccountRESTResource, 'accountOrganization', {ido: this.AuthToken.getIdO()});
		};
		accountOrganizationMember = () => {
			return this.$resourceHelper.resourceRESTCall(this.$AccountRESTResource, 'accountOrganizationMember', {ido: this.AuthToken.getIdO()});
		};
		accountOrganizations = () => {
			return this.$resourceHelper.resourceRESTCall(this.$AccountRESTResource, 'accountOrganizations');
		};
		accountOrganizationParam = (orgId: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$AccountRESTResource, 'accountOrganizationParam', { id: orgId, ido: orgId });
		};
		accountOrganizationMemberParam = (orgId: string) => {
			return this.$resourceHelper
				.resourceRESTCall(this.$AccountRESTResource, 'accountOrganizationMemberParam', { organization: orgId, ido: orgId });
		};
		saveAccountOrganizationMember = (orgMember: any) => {
			return this.$resourceHelper
				.resourceRESTCall(this.$AccountRESTResource, 'saveAccountOrganizationMember', orgMember, true);
		};
		accountOrganizationTeam = (orgId: string) => {
			return this.$resourceHelper
				.resourceRESTCall(this.$AccountRESTResource, 'accountOrganizationTeam', { organization: orgId, ido: orgId });
		};
		
		saveAccountOrganization = (organization: any) => {
			return this.$resourceHelper
				.resourceRESTCall(this.$AccountRESTResource, 'saveAccountOrganization', organization, true);
		};
	}

	function get$AccountRESTServiceInstance($http: angular.IHttpService, $AccountRESTResource: any, 
		$q: any, $resourceHelper: any, AuthToken: any) {
        return new $AccountRESTService($http, $AccountRESTResource, $q, $resourceHelper, AuthToken);
    }
	angular
		.module('app.account', [])
		.factory('$AccountRESTResource', $AccountRESTResource)
		.factory('$AccountRESTService', get$AccountRESTServiceInstance);
}