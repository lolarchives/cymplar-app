import '../helper/helper';

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
                        controller: 'LeadController',
                        controllerAs: 'lCtrl',
                    },
                    'right-bar': {
                        templateUrl: 'components/lead/right_bar.html',
                        controller: 'LeadController',
                        controllerAs: 'lCtrl',
                    },
                },
			})
			.state('main.lead.newLead', {
                url: '/new_lead',
                templateUrl: 'components/lead/new_lead.html',
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
		constructor(){
			
		}
	}
	angular
		.module('app.lead',[
			'ui.router',
			'app.helper'
		])
		.config(config)
		.controller('LeadController',LeadController)
}