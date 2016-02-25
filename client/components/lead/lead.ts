import '../helper/helper';
import './lead.service'
import {AddressBookContact} from '../../core/dto';
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
                    }
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
                params: {
                    lead: '@',
                },
                onEnter: function($stateParams: any, $state: any) {
                    //map company to id
                    console.log($stateParams);
					/*let availableCompanyId = $AddressBookRESTService.allCompaniesCached.map(function(company: any) {
                        return company._id;
                    });
                    // if the company does not exist
                    let index = availableCompanyId.indexOf($stateParams.id);
                    if (availableCompanyId.indexOf($stateParams.id) === -1) {
                        $state.go('main.dashboard');
                    } else {
                        if ($stateParams.company === '@') { // first load page
                            $stateParams.company = $AddressBookRESTService.allCompaniesCached[index];
                            $AddressBookRESTService.selectedCompany = $stateParams.company;
                        }
                    }*/
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
        
        constructor(private $stateParams: any, private $AddressBookRESTService: any, private statuses: any,private $LeadRESTService: any) {
            for (let i = 0; i< statuses.length;i++) {
                if (statuses[i].code === "COLD") {this.coldStatusIndex = i;}
                if (statuses[i].code === "OPP") {this.opportunityStatusIndex = i;}
            }
        }
        createLead(newLead: SalesLead) {
            if (this.$stateParams.status === "opportunity") { newLead.status = this.statuses[this.opportunityStatusIndex]; }
            if (this.$stateParams.status === "lead") { newLead.status = this.statuses[this.coldStatusIndex];}
            this.$LeadRESTService.newLead(newLead).then((response: any) => {
                
            })
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
}