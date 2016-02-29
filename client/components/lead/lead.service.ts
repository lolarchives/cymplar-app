import '../helper/helper';
import '../auth/auth.service';
import './lead';
import {BACK_END_ROUTE, SalesLead} from '../../core/dto';
namespace LeadService {
	function $LeadRESTResource($resource: angular.resource.IResourceService,
		AuthToken: any) : angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource("", {}, {
			'newLead': {
				method: 'POST',
				url: BACK_END_ROUTE + '/sales-lead?ido='+ AuthToken.getIdO()
			},
			'allLeads': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead/_find?ido='+ AuthToken.getIdO()
			},
			'findContactsNotInLead': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead-contact/_find_to_add',
			},
			'findContactsInLead': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead-contact/_find',
			},
			'allLeadStatuses': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead-status/_find',
			},
			'deleteCompany': {
				method: 'DELETE',
				url: BACK_END_ROUTE + '/address-book-group/:id',

			},
			'newContact': {
				method: 'POST',
				url: BACK_END_ROUTE + '/address-book-contact'
			},
			'editContact': {
				method: 'PUT',
				url: BACK_END_ROUTE + '/address-book-contact/:id',
				params: {
					id: '@_id',
				}
			},
			'deleteContact': {
				method: 'DELETE',
				url: BACK_END_ROUTE + '/address-book-contact/:_id',
				params: {
					id: '@_id',
				}
			},
			'roleInLead': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead-organization-member/_find_membership'
			}
		});
		return resources;
	}
	export class $LeadRESTService {
		private allLeadsCached: any[] = [];
		private selectedLead: any;
		private allLeadStatusesCached: any[] = [];
		constructor(private $http: angular.IHttpService, private $LeadRESTResource: any, private $q: any, 
			private $resourceHelper: any,private AuthToken: any) {
		}
		allLeads() {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "allLeads").then((response: any) => {
				if (response.success) {
					this.allLeadsCached = response.data;
					return this.allLeadsCached;
				};
			});
		}
		allLeadStatuses() {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "allLeadStatuses").then( (response: any) => {
				if (response.success) {
					this.allLeadStatusesCached = response.data;
					return this.allLeadStatusesCached;
				};
			});
		}
		findContactsInLead(leadId: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "findContactsInLead", {ido: this.AuthToken.getIdO(), idl: leadId});
		}
		findContactsNotInLead(leadId: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "findContactsNotInLead", {ido: this.AuthToken.getIdO(),idl: leadId});
		}
		newLead(lead: SalesLead) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "newLead", lead, true).then( (response: any) => {
				if (response.success) {
					this.allLeadsCached.push(response.data);
					return response;
				};
			});
		}
		roleInLead(leadId: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "roleInLead", {idl: leadId, ido: this.AuthToken.getIdO()})
			
		}
	}

	function get$LeadRESTServiceInstance($http: angular.IHttpService, $LeadRESTResource: any, $q: any, $resourceHelper: any, AuthToken: any) {
        return new $LeadRESTService($http, $LeadRESTResource, $q, $resourceHelper, AuthToken);
    }


	angular
		.module('app.addressBook')
		.factory('$LeadRESTResource', $LeadRESTResource)
		.factory('$LeadRESTService', get$LeadRESTServiceInstance);
}