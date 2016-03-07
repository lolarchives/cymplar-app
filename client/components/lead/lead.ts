import '../helper/helper';
import './lead.service'
import {SalesLead} from '../../core/dto';
namespace Lead {
    function config($stateProvider: any) {
        $stateProvider
            .state('main.newLead', {
                url: '/lead/new_lead/:status/:group_id',
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
                            $LeadRESTService.selectedLead = $LeadRESTService.allLeadsCached[index];
                        }
                    }
                }
            });
    }
    

    export class NewLeadController {
        private newLead: any;
        private coldStatusIndex: number;
        private opportunityStatusIndex: number;


        constructor(private $stateParams: any, private $AddressBookRESTService: any, private $LeadRESTService: any, 
                    private $state:any, private toastr:any, private ultiHelper: any) {

            this.newLead = {};
            if ($stateParams.group_id !== undefined) {
               let index = this.ultiHelper.indexOfFromId(this.$AddressBookRESTService.allCompaniesCached,{_id: this.$stateParams.group_id}) 
              
                if (index == -1) {
                    this.$state.go("main.dashboard");
                } else {
                    this.newLead.group = this.$AddressBookRESTService.allCompaniesCached[index];
                }
            }
        }
        createLead(newLead: SalesLead) {
            if (this.$stateParams.status === "opportunity") { 
                newLead.status = this.$LeadRESTService.allLeadStatusesCached[this.opportunityStatusIndex]; }
            if (this.$stateParams.status === "lead") { 
                newLead.status = this.$LeadRESTService.allLeadStatusesCached[this.coldStatusIndex]; }
           
            this.$LeadRESTService.newLead(newLead).then((response: any) => {
                console.log('response');
                if (response.success) {
                    this.$state.go('main.selectedLead',{id: response.data._id, lead: response.data});
                    this.$LeadRESTService.selectedLead = response.data;           
                } else {
                    this.toastr.error("Cannot create a sale, please check for a sale with the same name")
                }
            })
        }
    }
    
    export class SelectedLeadController{
        private selectedLead:any = "selected_lead";
        constructor(private $stateParams: any, private $AddressBookRESTService: any, private $LeadRESTService: any, private $state:any,private roleInLead: any,private contacts: any, private unaddedContacts: any,
            private socket: any) {
           
        }
    }
    export class SelectedLeadRightBarController{
      
        private selectedLead:any = "selected_lead";
        private editing:boolean = false;
        private editingLead: any;
        private $LeadRESTService: any;
        private showingSliderOptions: any;
        private editingSliderOptions: any;
        private indexOfSelectedStatus: number;
        private indexOfSelectedStatusBackup: number;
        constructor(private $stateParams: any, private $AddressBookRESTService: any, 
            $LeadRESTService: any, private $state:any,private roleInLead: any,private toastr: any, private contacts: any, private unaddedContacts: any,
            private $timeout:any,
            private $filter: any, private ultiHelper: any,
            private $scope: any) {
           $stateParams.lead.contacts = contacts;
           this.$LeadRESTService = $LeadRESTService; 
           this.editing = false;
           
           let stepsArray = this.$stateParams.lead.leadStatuses.map(function(currentValue: any) {
               return currentValue.label;
           })
           this.indexOfSelectedStatus = stepsArray.indexOf(this.$stateParams.lead.currentStatus.label);
            
           this.showingSliderOptions = {
               stepsArray: stepsArray,
               readOnly :true,
               showTicks: true,

           }
           this.editingSliderOptions = {
               stepsArray: stepsArray,
               readOnly :false,
               showTicks: true,

           }   
     
        }
        deleteLead() {
            let result: boolean = confirm("Are you sure. Once delete all the lead data cannot be recovered");
            if (result) {
                this.$LeadRESTService.deleteLead(this.$LeadRESTService.selectedLead._id).then((response: any) => {
                    
                    if (response.success) {
                        let index = this.ultiHelper.indexOfFromId( this.$LeadRESTService.allLeadsCached, this.$LeadRESTService.selectedLead );
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
            this.showingSliderOptions.readOnly = false;
            this.indexOfSelectedStatusBackup = angular.copy(this.indexOfSelectedStatus); 
            this.editingLead = angular.copy(this.$LeadRESTService.selectedLead)
            this.editingLead.softContacts = this.editingLead.contacts;
            this.showingSliderOptions.readOnly = false;
            for (let i = 0; i < this.$LeadRESTService.allLeadStatusesCached.length;i++) {
                if (this.editingLead.status.code == this.$LeadRESTService.allLeadStatusesCached[i].code) {
                    this.editingLead.status = this.$LeadRESTService.allLeadStatusesCached[i]       
                    break;
                }
            }  
        }
        
        submitEditing() {
            this.editingLead.contacts = this.editingLead.softContacts.map((currentValue: any, index:any , array: any)=>{
                return currentValue._id;
            })
            this.editingLead.currentStatus = this.editingLead.leadStatuses[this.indexOfSelectedStatus];
            this.$LeadRESTService.updateLead(this.editingLead).then((response: any) => {
                if (response.success) {
                    let index = this.ultiHelper.indexOfFromId( this.$LeadRESTService.allLeadsCached, this.$LeadRESTService.selectedLead );
                     
                     this.$LeadRESTService.allLeadsCached[index] = response.data;
                     this.$LeadRESTService.selectedLead = this.$LeadRESTService.allLeadsCached[index];
                     this.$stateParams.lead = this.$LeadRESTService.allLeadsCached[index];
                                       
                     this.toastr.success("Update lead success");
                     this.editing = false;
                     this.showingSliderOptions.readOnly = true;
                  
                } else {
                    this.toastr.error('Some error occur, cannot update lead');
                }
            })
            
        } 
        loadContacts($query:any ) {
            console.log($query);
            
            return this.$filter('filter')(this.unaddedContacts,{name:$query});
        }
        contactAdded($tag: any){
            console.log('added',$tag)
        }
        contactRemoved($tag: any){
            console.log('removed',$tag)
             let index = this.ultiHelper.indexOfFromId( this.unaddedContacts, $tag );
            if (index == -1) {
                this.unaddedContacts.push($tag);
            } 
        }
        cancelEdit() {
            this.editing = false;
            this.showingSliderOptions.readOnly = true;
            this.indexOfSelectedStatus = this.indexOfSelectedStatusBackup;
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