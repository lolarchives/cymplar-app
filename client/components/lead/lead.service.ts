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
				url: BACK_END_ROUTE + '/sales-lead',
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
			}
		});
		return resources;
	}
	export class $LeadRESTService {
		constructor(private $http: angular.IHttpService, private $LeadRESTResource: any, private $q: any, 
			private $resourceHelper: any,private AuthToken: any) {
		}
		allLeads() {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "allLeads");
		}
		allLeadStatuses() {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "allLeadStatuses");
		}
		findContactsNotInLead() {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "findContactsNotInLead", {ido: this.AuthToken.getIdO()});
		}
		newLead(lead: SalesLead) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, "newLead", lead, true);
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