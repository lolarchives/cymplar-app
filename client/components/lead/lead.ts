import '../helper/helper';
import './lead.service'
import {SalesLead} from '../../core/dto';
namespace Lead {
    function config($stateProvider: any) {
        $stateProvider
            .state('main.lead', {
                url: '/lead',
                abstract: true,
                views: {
                    'main': {
                        template: '<ui-view class="grid-block vertical"></ui-view>',

                    },
                    'right-bar': {
                        templateUrl: 'components/lead/right_bar.html',
                    },
                },
                resolve: {
                    statuses: ($LeadRESTService: any) => {
                   
                        return $LeadRESTService.allLeadStatuses().then((response: any) => {
                            if (response.success) {
                                return response.data;
                            } else {
                                return {}
                            }

                        });
                    },

                }
        
            })
            .state('main.lead.newLead', {
                url: '/new_lead/:status',
                templateUrl: 'components/lead/new_lead.html',
                controller: 'NewLeadController',
                controllerAs: 'nlCtrl',
                params: {
                    status: '@',
                },
                onEnter: function($stateParams: any, $state: any) {
                    console.log($stateParams)
                    if ($stateParams.status !== 'lead' && $stateParams.status !== 'opportunity') {
                        $state.go('main.lead.allLeads');
                    }
                }
            })
            .state('main.lead.allLeads', {
                url: '/all_leads',
                templateUrl: 'components/lead/all_leads.html',
            })
            .state('main.lead.selectedLead', {
                url: '/:id',
                templateUrl: 'components/lead/selected_lead.html',
                controller: 'SelectedLeadController',
                controllerAs: 'slCtrl',
                params: {
                    lead: '@',
                },
                resolve:{

                    contacts: function($LeadRESTService: any,$stateParams: any, $state: any) {
                        console.log('resolve this second', $state);
                        return $LeadRESTService.findContactsInLead($stateParams.id).then((response: any) => {
                            if (response.success)
                                return response.data
                            else {
                                $state.go('main.dashboard');
                            } 
                                
                        });
                
                    }, 
                    unaddedContacts: function($LeadRESTService: any,$stateParams: any) {
                        return $LeadRESTService.findContactsNotInLead($stateParams.id).then((response: any) => {
                            if (response.success)
                                return response.data
                        });
                    },
                    roleInLead: function($LeadRESTService: any,$stateParams: any) {
    
                        return $LeadRESTService.roleInLead($stateParams.id).then((response: any) => {
                            if (response.success)
                                return response.data
                        });
                },
                onEnter: function($stateParams: any, $state: any, $LeadRESTService: any) {
                    //map company to id
                        
					let availableLeadIds = $LeadRESTService.allLeadsCached.map(function(lead: any) {
                        return lead._id;
                    });
                    // if the company does not exist
                    let index = availableLeadIds.indexOf($stateParams.id);
                    if (availableLeadIds.indexOf($stateParams.id) === -1) {
                        $state.go('main.dashboard');
                    } else {
                         console.log('checking state params',$stateParams)
                        if ($stateParams.lead === '@') { // first load page
                            $stateParams.lead = $LeadRESTService.allLeadsCached[index];
                            $LeadRESTService.selectedLead = $stateParams.lead;
                            console.log('preparing state params',$stateParams.lead)
                        }
                    }
                }
            });
    }
    export class LeadController {
        private helloWorld: string = "Hello world";
        constructor(private $stateParams: any) {
            alert('hi');
        }

    }

    export interface SalesLead {
        name?: string;
        status?: any;
        contract?: string;
        amount?: number;
        contact?: any;
        members?: any;
    }

    export class NewLeadController {
        private newLead: SalesLead;
        private coldStatusIndex: number;
        private opportunityStatusIndex: number;

        constructor(private $stateParams: any, private $AddressBookRESTService: any, private statuses: any, private $LeadRESTService: any, private $state:any) {
            for (let i = 0; i < $LeadRESTService.allLeadStatusesCached.length; i++) {
                if (this.$LeadRESTService.allLeadStatusesCached[i].code === "COLD") { this.coldStatusIndex = i; }
                if (this.$LeadRESTService.allLeadStatusesCached[i].code === "OPP") { this.opportunityStatusIndex = i; }
            }
        }
        createLead(newLead: SalesLead) {

            if (this.$stateParams.status === "opportunity") { 
                newLead.status = this.$LeadRESTService.allLeadStatusesCached[this.opportunityStatusIndex]; }
            if (this.$stateParams.status === "lead") { 
                newLead.status = this.$LeadRESTService.allLeadStatusesCached[this.coldStatusIndex]; }
            console.log('new lead', this.$LeadRESTService.allLeadStatusesCached, this.coldStatusIndex, this.opportunityStatusIndex, newLead)
            this.$LeadRESTService.newLead(newLead).then((response: any) => {
                if (response.success) {
                    this.$state.go('main.lead.selectedLead',{id: response.data._id, lead: response.data});
                    this.$LeadRESTService.selectedLead = response.data;
                   
                }
            })
        }
    }
    
    export class SelectedLeadController{
        constructor(private $stateParams: any, private $AddressBookRESTService: any, private statuses: any, private $LeadRESTService: any, private $state:any, roleInLead: any) {
            console.log('your role',roleInLead);  
        }
    }
    
    angular
        .module('app.lead', [
            'ui.router',
            'app.helper',
            'app.addressBook'
        ])
        .config(config)
        .controller('LeadController', LeadController)
        .controller('NewLeadController', NewLeadController)
        .controller('SelectedLeadController', SelectedLeadController)
}