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
			},
			'findFilteredStages': {
				method: 'GET',
				url: BACK_END_ROUTE + '/sales-lead/_find_latest_status'
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
		
		findFilteredStages() {
			return this.$resourceHelper.resourceRESTCall(this.$LeadRESTResource, 'findFilteredStages',
			{ ido: this.AuthToken.getIdO() }, true).then((response: any) => {
				return response;
			});
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
		private loadingMore: boolean = false;
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
		loadMoreLogItem() {
			
			let data = {_id: this.allLogItemsCached[this.allLogItemsCached.length-1]._id,
				idl : this.$LeadRESTService.selectedLead._id,
				ido : this.AuthToken.getIdO()
			};
			
			
			
			console.log(data) 
			this.loadingMore = true;
			return this.$resourceHelper.resourceRESTCall(this.$LogItemRESTResource, 'loadLogItem',data).then((response: any) => {
				this.loadingMore = false;
				if (response.success) {
					console.log('response',response.data,data)
					if (data.idl === this.$LeadRESTService.selectedLead._id) {
						this.allLogItemsCached = this.allLogItemsCached.concat(response.data);
						if (response.data.length < 20) {
							this.loadMore = false;
						} else {
							this.loadMore = true;
						}	
					}  
					
					
					return response.data;
				}
			});
		}

	}
	
	function $LeadChatItemRESTResource($resource: angular.resource.IResourceService,
		AuthToken: any, $LeadRESTService: any, $stateParams: any): angular.resource.IResourceClass<any> {
		let resources: angular.resource.IResourceClass<any> = $resource('', {}, {
			
			'deleteLeadChatItem': {
				method: 'DELETE',
				url: BACK_END_ROUTE + '/lead-chat-log/:id',
				params: {
					id: 'id'
				}
			},
			'editLeadChatItem': {
				method: 'PUT',
				url: BACK_END_ROUTE + '/lead-chat-log/:id',
				params: {
					id: '@_id',
					ido: '@ido',
					idl: '@idl'
				}

			},
			'newLeadChatItem': {
				method: 'POST',
				url: BACK_END_ROUTE + '/lead-chat-log/?ido=' + AuthToken.getIdO()

			},
			'loadLeadChatItem': {
				method: 'GET',
				url: BACK_END_ROUTE + '/lead-chat-log/_find'
			}
		});
		return resources;
	}
	
	export class $LeadChatItemRESTService {
		private allLeadChatItems: any[] = [];
		
		private loadMore: boolean;
		
		private loadingMore: boolean = false;
		constructor(private $LeadRESTResource: any, private $LeadChatItemRESTResource: any,
			private $resourceHelper: any, private AuthToken: any, private $LeadRESTService: any) {

		}

		deleteLeadChatItem(leadChatItem: any) {
			return this.$resourceHelper.resourceRESTCall(this.$LeadChatItemRESTResource, 'deleteLeadChatItem',
				{ idl: this.$LeadRESTService.selectedLead._id, id: leadChatItem._id, ido: this.AuthToken.getIdO() }, true);
		}
		editLeadChatItem(leadChatItem: any) {
			leadChatItem.idl = this.$LeadRESTService.selectedLead._id;
			leadChatItem.ido = this.AuthToken.getIdO();

			return this.$resourceHelper.resourceRESTCall(this.$LeadChatItemRESTResource, 'editLogItem',
				leadChatItem, true).then((response: any) => {
					if (response.success) {
						let index = -1;
						for (let i = 0; i < this.allLeadChatItems.length; i++) {
							if (this.allLeadChatItems[i]._id === response.data._id) {
								index = i;
							}
						}
						this.allLeadChatItems[index] = response.data;
					}
					return response;
				});
		}
		
		newLeadChatItem(leadChatItem: any) {
			
			leadChatItem.idl = this.$LeadRESTService.selectedLead._id;
			return this.$resourceHelper.resourceRESTCall(this.$LeadChatItemRESTResource, 'newLeadChatItem', leadChatItem);
		}
		preloadLeadChatItem(selectedLeadId: string) {
			console.log('in here 2');
			return this.$resourceHelper.resourceRESTCall(this.$LeadChatItemRESTResource, 'loadLeadChatItem',
				{ idl: selectedLeadId, ido: this.AuthToken.getIdO() }).then((response: any) => {
					if (response.success) {
						this.allLeadChatItems = response.data;
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
		loadMoreLeadChatItem() {
			
			let data = {_id: this.allLeadChatItems[this.allLeadChatItems.length-1]._id,
				idl : this.$LeadRESTService.selectedLead._id,
				ido : this.AuthToken.getIdO()
			};
			
			
			
			console.log(data) 
			this.loadingMore = true;
			return this.$resourceHelper.resourceRESTCall(this.$LeadChatItemRESTResource, 'loadLogItem',data).then((response: any) => {
				this.loadingMore = false;
				if (response.success) {
					console.log('response',response.data,data)
					if (data.idl === this.$LeadRESTService.selectedLead._id) {
						this.allLeadChatItems = this.allLeadChatItems.concat(response.data);
						if (response.data.length < 20) {
							this.loadMore = false;
						} else {
							this.loadMore = true;
						}	
					}  
					
					
					return response.data;
				}
			});
		}

	}
	
	function get$LeadChatItemRESTServiceInstance($LeadRESTResource: any, $LeadChatItemRESTResource: any, $resourceHelper: any,
		AuthToken: any, $LeadRESTService: any) {
        return new $LeadChatItemRESTService($LeadRESTResource, $LeadChatItemRESTResource, $resourceHelper, AuthToken, $LeadRESTService);
    }
	
	function get$LogItemRESTServiceInstance($LeadRESTResource: any, $LogItemRESTResource: any, $resourceHelper: any,
		AuthToken: any, $LeadRESTService: any) {
        return new $LogItemRESTService($LeadRESTResource, $LogItemRESTResource, $resourceHelper, AuthToken, $LeadRESTService);
    }


	angular
		.module('app.lead')
		.factory('$LeadRESTResource', $LeadRESTResource)
		.factory('$LeadRESTService', get$LeadRESTServiceInstance)
		.factory('$LeadChatItemRESTResource', $LeadChatItemRESTResource)
		.factory('$LeadChatItemRESTService', get$LeadChatItemRESTServiceInstance)
		.factory('$LogItemRESTResource', $LogItemRESTResource)
		.factory('$LogItemRESTService', get$LogItemRESTServiceInstance);
}