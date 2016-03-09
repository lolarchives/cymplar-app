import {BACK_END_ROUTE} from '../../core/dto';
import '../auth/auth.service';
namespace InvitationService {

	function $InvitationRESTResource($resource: angular.resource.IResourceService, AuthToken: any): angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource('', {}, {
			'sendInvitation': {
				method: 'POST',
				url: BACK_END_ROUTE + '/account-invitation'
			},
			'getInvitation': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-invitation/:id'
			},
			'getInvitations': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-invitation/_find'
			},
			'updateInvitation': {
				method: 'PUT',
				url: BACK_END_ROUTE + '/account-invitation/:id',
				params: {
					id: '@_id'
				}
			},
			'acceptInvitation': {
				method: 'GET',
				url: BACK_END_ROUTE + '/account-organization/_accept_invitation'
			}
		});
		return resources;
	}
	
	export class $InvitationRESTService {
		constructor(private $http: angular.IHttpService, private $InvitationRESTResource: any, private $q: any, 
			private $resourceHelper: any,private AuthToken: any) {
		}
		sendInvitation = (invitation: any, organization: string = this.AuthToken.getIdO()) => {
			invitation['ido'] = organization;
			return this.$resourceHelper.resourceRESTCall(this.$InvitationRESTResource, 'sendInvitation', invitation, true);
		};
		sendInvitationOrg = (invitation: any, organization: string) => {
			invitation['ido'] = this.AuthToken.getIdO();
			return this.$resourceHelper.resourceRESTCall(this.$InvitationRESTResource, 'sendInvitation', invitation, true);
		};
		getInvitation = (invitationId: string, organization: string = this.AuthToken.getIdO()) => {
			return this.$resourceHelper.resourceRESTCall(this.$InvitationRESTResource, 'getInvitation', {id: invitationId, ido: organization});
		};
		getInvitationOrg = (invitationId: string, organization: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$InvitationRESTResource, 'getInvitation', {ido: organization, id: invitationId});
		};
		getInvitations = (organization: string = this.AuthToken.getIdO()) => {
			return this.$resourceHelper.resourceRESTCall(this.$InvitationRESTResource, 'getInvitations', {ido: organization});
		};
		getInvitationsOrg = (organization: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$InvitationRESTResource, 'getInvitations', {ido: organization});
		};
		updateInvitation = (invitation: any, organization: string = this.AuthToken.getIdO()) => {
			invitation['ido'] = organization;
			return this.$resourceHelper.resourceRESTCall(this.$InvitationRESTResource, 'updateInvitation', invitation);
		};
		updateInvitationOrg = (invitation: any, organization: string) => {
			invitation['ido'] = organization;
			return this.$resourceHelper.resourceRESTCall(this.$InvitationRESTResource, 'updateInvitation', invitation);
		};
		acceptInvitation = (invitation: string) => {
			return this.$resourceHelper.resourceRESTCall(this.$InvitationRESTResource, 'acceptInvitation', { _id: invitation});
		};
	}

	function get$InvitationRESTServiceInstance($http: angular.IHttpService, $InvitationRESTResource: any, 
		$q: any, $resourceHelper: any, AuthToken: any) {
        return new $InvitationRESTService($http, $InvitationRESTResource, $q, $resourceHelper, AuthToken);
    }
	angular
		.module('app.invitation', [])
		.factory('$InvitationRESTResource', $InvitationRESTResource)
		.factory('$InvitationRESTService', get$InvitationRESTServiceInstance);
}