import '../helper/helper';
import '../auth/auth.service';
import './lead';
import {BACK_END_ROUTE, SalesLead} from '../../core/dto';
namespace LeadService {
	function $LeadRESTResource($resource: angular.resource.IResourceService,
		AuthToken: any): angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource('', {}, {
			'newLead': {
				method: 'POST',
				url: BACK_END_ROUTE + '/sales-lead'
			},
			'allLeads': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead/_find'
			},
			'findContactsNotInLead': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead-contact/_find_to_add'
			},
			'findContactsInLead': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead-contact/_find'
			},
			'allLeadStatuses': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead-status/_find'
			},
			'deleteLead': {
				method: 'DELETE',
				url: BACK_END_ROUTE + '/sales-lead/:id'
			},
			'updateLead': {
				method: 'PUT',
				url: BACK_END_ROUTE + '/sales-lead/:id',
				params: {
					id: '@_id',
					idl: '@_id',
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
			private $resourceHelper: any, private AuthToken: any, $rootScope: any) {
			$rootScope.$on('updateLead', function(event: any, lead: any, index: number) {
				console.log('update lead ', lead, index);
			});
		}
		allLeads() {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, 'allLeads', { ido: this.AuthToken.getIdO() })
				.then((response: any) => {
					if (response.success) {
						this.allLeadsCached = response.data;
						return this.allLeadsCached;
					}
				});
		}
		allLeadStatuses() {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, 'allLeadStatuses').then((response: any) => {
				if (response.success) {
					this.allLeadStatusesCached = response.data;
				}
				return response;
			});
		}
		findContactsInLead(leadId: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, 'findContactsInLead',
				{ ido: this.AuthToken.getIdO(), idl: leadId });
		}
		findContactsNotInLead(leadId: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, 'findContactsNotInLead',
				{ ido: this.AuthToken.getIdO(), idl: leadId });
		}
		newLead(lead: SalesLead) {
			lead['ido'] = this.AuthToken.getIdO();
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, 'newLead', lead, true).then((response: any) => {
				if (response.success) {
					this.allLeadsCached.push(response.data);

				}
				return response;
			});
		}
		updateLead(lead: SalesLead) {
			lead['ido'] = this.AuthToken.getIdO();
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, 'updateLead', lead, true).then((response: any) => {
				return response;
			});
		}
		roleInLead(leadId: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, 'roleInLead',
				{ idl: leadId, ido: this.AuthToken.getIdO() });
		}
		deleteLead(leadId: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, 'deleteLead',
				{ id: leadId, idl: leadId, ido: this.AuthToken.getIdO() }, true);
		}
	}

	function get$LeadRESTServiceInstance($http: angular.IHttpService, $LeadRESTResource: any, $q: any, $resourceHelper: any,
		AuthToken: any, $rootScope: any) {
        return new $LeadRESTService($http, $LeadRESTResource, $q, $resourceHelper, AuthToken, $rootScope);
    }


	function $LogItemRESTResource($resource: angular.resource.IResourceService,
		AuthToken: any, $LeadRESTService: any, $stateParams: any): angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource('', {}, {
			'getLogItemTypes': {
				method: 'GET',
				url: BACK_END_ROUTE + '/log-item-type/_find'
			},
			'deleteLogItem': {
				method: 'DELETE',
				url: BACK_END_ROUTE + '/log-item/:id',
				params: {
					id: 'id'
				}
			},
			'editLogItem': {
				method: 'PUT',
				url: BACK_END_ROUTE + '/log-item/:id',
				params: {
					id: '@_id',
					ido: '@ido',
					idl: '@idl'
				}

			},
			'newLogItem': {
				method: 'POST',
				url: BACK_END_ROUTE + '/log-item/?ido=' + AuthToken.getIdO()

			},
			'loadLogItem': {
				method: 'GET',
				url: BACK_END_ROUTE + '/log-item/_find'
			}
		});
		return resources;
	}
	export class $LogItemRESTService {
		private allLogItemsCached: any[] = [];
		private selectedLead: any;
		private loadMore: boolean;
		private allLogItemTypesCached: any[] = [];
		constructor(private $LeadRESTResource: any, private $LogItemRESTResource: any,
			private $resourceHelper: any, private AuthToken: any, private $LeadRESTService: any) {

		}
		getLogItemTypes() {
			return this.$resourceHelper.resourceRESTCall(this.$LogItemRESTResource, 'getLogItemTypes').then((response: any) => {
				if (response.success) {
					this.allLogItemTypesCached = response.data;
					return response.data;
				};

			});
		}
		deleteLogItem(logItem: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LogItemRESTResource, 'deleteLogItem',
				{ idl: this.$LeadRESTService.selectedLead._id, id: logItem._id, ido: this.AuthToken.getIdO() }, true);
		}
		editLogItem(logItem: any) {
			logItem.idl = this.$LeadRESTService.selectedLead._id;
			logItem.ido = this.AuthToken.getIdO();

			return this.$resourceHelper.resourceRESTCall(this.$LogItemRESTResource, 'editLogItem',
				logItem, true).then((response: any) => {
					if (response.success) {
						let index = -1;
						for (let i = 0; i < this.allLogItemsCached.length; i++) {
							if (this.allLogItemsCached[i]._id === response.data._id) {
								index = i;
							}
						}
						this.allLogItemsCached[index] = response.data;
					}
					return response;
				});
		}
		newLogItem(logItem: any) {
			logItem.idl = this.$LeadRESTService.selectedLead._id;
			return this.$resourceHelper.resourceRESTCall(this.$LogItemRESTResource, 'newLogItem', logItem, true);
		}
		preloadLogItem(selectedLeadId: string) {
			return this.$resourceHelper.resourceRESTCall(this.$LogItemRESTResource, 'loadLogItem',
				{ idl: selectedLeadId, ido: this.AuthToken.getIdO() }).then((response: any) => {
					if (response.success) {
						this.allLogItemsCached = response.data;
						if (response.data.length < 20) {
							this.loadMore = false;
						} else {
							this.loadMore = true;
						}
						return response.data;
					} else {
						return {};
					}
				});
		}
		loadMoreLogItem(lastItem: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LogItemRESTResource, 'loadLogItem').then((response: any) => {
				if (response.success) {
					this.allLogItemsCached.push(response.data);
					if (response.data.length < 20) {
						this.loadMore = false;
					} else {
						this.loadMore = true;
					}
					return response.data;
				}
			});
		}

	}

	function get$LogItemRESTServiceInstance($LeadRESTResource: any, $LogItemRESTResource: any, $resourceHelper: any,
		AuthToken: any, $LeadRESTService: any) {
        return new $LogItemRESTService($LeadRESTResource, $LogItemRESTResource, $resourceHelper, AuthToken, $LeadRESTService);
    }


	angular
		.module('app.lead')
		.factory('$LeadRESTResource', $LeadRESTResource)
		.factory('$LeadRESTService', get$LeadRESTServiceInstance)
		.factory('$LogItemRESTResource', $LogItemRESTResource)
		.factory('$LogItemRESTService', get$LogItemRESTServiceInstance);
}