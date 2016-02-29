import '../helper/helper';
import './lead.service'
import {SalesLead} from '../../core/dto';
namespace Lead {
    function config($stateProvider: any) {
        $stateProvider
            .state('main.newLead', {
                url: '/lead/new_lead/:status',
                views: {
                    'main': {
                        templateUrl: 'components/lead/new_lead.html',
                        controller: 'NewLeadController',
                        controllerAs: 'nlCtrl',
                    },
                },
                
                params: {
                    status: '@',
                },
                onEnter: function($stateParams: any, $state: any) {
                    console.log($stateParams)
                    if ($stateParams.status !== 'lead' && $stateParams.status !== 'opportunity') {
                        $state.go('main.allLeads');
                    }
                }
            })
            .state('main.allLeads', {
                url: '/lead/all_leads',
                views: {
                    'main': {
                      templateUrl: 'components/lead/all_leads.html',
                    },
                },
            })
            .state('main.selectedLead', {
                url: '/lead/:id',
                 views: {
                    'main': {
                      templateUrl: 'components/lead/selected_lead.html',
                      controller: 'SelectedLeadController',
                      controllerAs: 'slCtrl',
                    },
                    'right-bar': {
                        templateUrl: 'components/lead/right_bar.html',
                        controller: 'SelectedLeadRightBarController',
                        controllerAs: 'slrbCtrl',
                    },
                },
               
                params: {
                    lead: '@',
                },
                resolve:{

                    contacts: function($LeadRESTService: any,$stateParams: any, $state: any) {
                        return $LeadRESTService.findContactsInLead($stateParams.id).then((response: any) => {
                            if (response.success){
                                if ($LeadRESTService.allLeadsCached.length == 0) { // must be newly reload
                           
                                    return $LeadRESTService.allLeads().then((subResponse: any) => {
                                        let availableLeadIds = $LeadRESTService.allLeadsCached.map(function(lead: any) {
                                            return lead._id;
                                        });
                                        let index = availableLeadIds.indexOf($stateParams.id);
                                 
                                        $stateParams.lead = $LeadRESTService.allLeadsCached[index];
                                        $LeadRESTService.selectedLead = $stateParams.lead;
                                        return response.data
                                    })
                                   
                                } else {
                                    if ($stateParams.lead === '@') { // first load page
                                        let availableLeadIds = $LeadRESTService.allLeadsCached.map(function(lead: any) {
                                            return lead._id;
                                        });
                                        // if the company does not exist
                                        let index = availableLeadIds.indexOf($stateParams.id);
                                        $stateParams.lead = $LeadRESTService.allLeadsCached[index];
                                        $LeadRESTService.selectedLead = $stateParams.lead;
                                    }
                                    return response.data
                                }
                            }
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
                    if (index === -1) {
                        $state.go('main.dashboard');
                    } else {                        
                        if ($stateParams.lead === '@') { // first load page
                            $stateParams.lead = $LeadRESTService.allLeadsCached[index];
                            $LeadRESTService.selectedLead = $stateParams.lead;
                        }
                    }
                }
            });
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

        constructor(private $stateParams: any, private $AddressBookRESTService: any, private $LeadRESTService: any, private $state:any) {
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
           
            this.$LeadRESTService.newLead(newLead).then((response: any) => {
                if (response.success) {
                    this.$state.go('main.selectedLead',{id: response.data._id, lead: response.data});
                    this.$LeadRESTService.selectedLead = response.data;
                   
                }
            })
        }
    }
    
    export class SelectedLeadController{
        private selectedLead:any = "selected_lead";
        constructor(private $stateParams: any, private $AddressBookRESTService: any, private $LeadRESTService: any, private $state:any,private roleInLead: any,private contacts: any, private unaddedContacts: any ) {
           
        }
    }
    export class SelectedLeadRightBarController{
        private selectedLead:any = "selected_lead";
        private editing:boolean = false;
        private editingLead: SalesLead;
        constructor(private $stateParams: any, private $AddressBookRESTService: any, private $LeadRESTService: any, private $state:any,private roleInLead: any,private toastr: any, private contacts: any, private unaddedContacts: any) {
           console.log('contact-uncontact',contacts,unaddedContacts); 
           console.log("Your role",roleInLead);
           this.editing = false;
        }
        deleteLead() {
            let result: boolean = confirm("Are you sure. Once delete all the lead data cannot be recovered");
            if (result) {
                this.$LeadRESTService.deleteLead(this.$LeadRESTService.selectedLead._id).then((response: any) => {
                    
                    if (response.success) {
                        let index = this.$LeadRESTService.allLeadsCached.indexOf(this.$LeadRESTService.selectedLead);
                        this.$LeadRESTService.allLeadsCached.splice(index, 1);
                        this.$LeadRESTService.selectedLead = undefined;
                        this.toastr.success("Delete lead success");
                        this.$state.go('main.dashboard');
                    } else {
                      
                        this.toastr.error(response.msg);
                    }
                });
            };
        }
        startEditing() {
            this.editing = true;
            this.editingLead = angular.copy(this.$LeadRESTService.selectedLead)
        }
        submitEditing() {
            
        } 
    }
    
    angular
        .module('app.lead', [
            'ui.router',
            'app.helper',
            'app.addressBook'
        ])
        .config(config)
       
        .controller('NewLeadController', NewLeadController)
        .controller('SelectedLeadController', SelectedLeadController)
        .controller('SelectedLeadRightBarController', SelectedLeadRightBarController)
}