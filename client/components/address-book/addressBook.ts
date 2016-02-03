import '../helper/helper';
import '../auth/auth.service';

namespace AddressBook {
    /** @ngInject */
    function config($stateProvider: any) {
        $stateProvider
            .state('main.addressBook', {
                url: '/address_book',
                abstract: true,
                controller: 'AddressBookController',
                controllerAs: 'abCtrl',
                template: '<ui-view class="grid-block vertical"></ui-view>',
                resolve: {
                    countries: ($SignUpRESTService: any) => {
                        return $SignUpRESTService.getCountries().then((response: any) => {
                            return response.data;
                        });
                    },
                    industries: ($SignUpRESTService: any) => {
                        return $SignUpRESTService.getIndustries().then((response: any) => {
                            return response.data;
                        });
                    },
                }
            })
            .state('main.addressBook.newCompany', {
                url: '/new_company',
                templateUrl: 'components/address-book/new_company.html',

            })
            .state('main.addressBook.selectedCompany', {
                url: '/:id',
                templateUrl: 'components/address-book/selected_company.html',
                params: {
                    company: '@',
                },
                onEnter: function($stateParams: any, $AddressBookRESTService: any, $state: any) {
                    //map company to id
                    let availableCompanyId = $AddressBookRESTService.allCompaniesCached.map(function(company: any) {
                        return company._id;
                    });
                    // if the company does not exist
                    let index = availableCompanyId.indexOf($stateParams.id);
                    if (availableCompanyId.indexOf($stateParams.id) === -1) {
                        $state.go('main.dashboard');
                    } else {
                        if ($stateParams.company == '@') { // first load page
                            $stateParams.company = $AddressBookRESTService.allCompaniesCached[index];
                            $AddressBookRESTService.selectedCompany = $stateParams.company;
                        }
                    }
                }
            });

    }

    export class AddressBookController {


        private disableCity: boolean;
        private cachedCities: any[] = [];
        private cachedStates: any[] = [];
        private newCompany: any;
        private queryingCity: boolean;
        private availableCities: any[] = [];
        private editing: boolean = false;
        private editingCompany: any;
        private console: any;
        private sampleContact: any;
        private matching:boolean = false;
        private modal: any;
        /** @ngInject */
        constructor(private $state: any, private countries: any,
            private $SignUpRESTService: any, private industries: any,
            private $AddressBookRESTService: any, private toastr: any, private $scope: any,
            private $uibModal: any) {
            this.console = console;
            $scope.$on('$stateChangeSuccess', () => {
                this.editing = false
            })
            this.sampleContact = {
                "name": "new Contac",
                "description": "The w",
                "position": "Accountant",
                "contactNumber": "11311111",
                "altContactNumber": "",
                "email": "newc@gmail.com",
                "website": "lin website",
                "group": "56972b823381acc03c678293",
                "_id": "56972c1e3381acc03c678294"
            };
        }

        countryChanged(subject: any) {
            // implement caching for higher network efficiency
          
            if (subject._id === undefined) { // this is the new company
                this.newCompany.city = undefined;
            } else {
                this.editingCompany.city = undefined;
            }
            subject.disableCity = true;
            subject.queryingCity = false;
            if (subject.country === undefined || subject.country === null) {
                subject.disableState = true;
                subject.queryingState = false;
                if (subject._id === undefined) { // subject is the new company
                    this.newCompany.state = undefined;
                } else {
                    this.editingCompany.state = undefined;
                }

            } else {
                if (this.cachedStates[subject.country] === undefined) {
                    subject.disableState = true;
                    subject.queryingState = true;
                    this.$SignUpRESTService.getStates(subject.country).then((response: any) => {
                        this.cachedStates[subject.country] = response.data;
                        subject.disableState = false;
                        subject.queryingState = false;
                        subject.availableStates = response.data;
                    });
                } else {
                    subject.disableState = false;
                    subject.availableStates = this.cachedStates[subject.country];
                }
            }


        }
        remove(){
            console.log(this.$AddressBookRESTService.selectedCompany);
            let result: boolean = confirm("Are you sure. All the contact belong to this group will be lost?");
            if (result) {
                this.$AddressBookRESTService.deleteCompany(this.$AddressBookRESTService.selectedCompany._id).then( (response: any) => {
                     if (response.success) {
                        let index = this.$AddressBookRESTService.allCompaniesCached.indexOf(this.$AddressBookRESTService.selectedCompany);
                        this.$AddressBookRESTService.allCompaniesCached.splice(index,1);
                        this.$AddressBookRESTService.selectedCompany = undefined;
                        this.$state.go('main.dashboard');
                    } else {
                        this.toastr.error(response.msg);
                    }
                })
                
            }
            
        }
        stateChanged(subject: any) {
            // implement cac(hing for higher network efficiency
        
            if (subject.state === undefined || subject.state === null) {
                subject.disableCity = true;
                subject.queryingCity = false;
                if (subject._id === undefined) { // this is the new company
                    this.newCompany.city = undefined;
                } else {
                    this.editingCompany.city = undefined;
                }

            } else {
                if (this.cachedCities[subject.state] === undefined) {
                    subject.disableCity = true;
                    subject.queryingCity = true;
                    this.$SignUpRESTService.getCities(subject.state).then((response: any) => {
                        this.cachedCities[subject.country] = response.data;
                        subject.disableCity = false;
                        subject.queryingCity = false;
                        subject.availableCities = response.data;
                    });
                } else {
                    subject.disableCity = false;
                    subject.availableCities = this.cachedCities[subject.state];
                }
            }
        }

        startEditing() {
            this.matching = true;
            // pass by memory
        
            this.editingCompany = angular.copy(this.$AddressBookRESTService.selectedCompany);
            //this.editingCompany.country = angular.copy(this.$AddressBookRESTService.selectedCompany.city.country.id);
            this.editingCompany.refCity = angular.copy(this.editingCompany.city)
            // match industries
   
            for (let i = 0; i < this.industries.length; i++) {
                if (this.industries[i]._id === this.editingCompany.industry._id) {
                    this.editingCompany.industry = this.industries[i];
                    break;
                }
            }
            // match country
            for (let i = 0; i < this.countries.length; i++) {
                if (this.countries[i]._id === this.editingCompany.refCity.state.country._id) {
                    this.editingCompany.country = this.countries[i]._id;
                    break;
                }
            }


            if (this.cachedStates[this.editingCompany.city.state.country._id] === undefined) {
                this.editingCompany.disableState = true;
                this.editingCompany.queryingState = true;
                this.$SignUpRESTService.getStates(this.editingCompany.city.state.country._id).then((response: any) => {
                    this.cachedStates[this.editingCompany.city.state.country._id] = response.data;
                    this.editingCompany.disableState = false;
                    this.editingCompany.queryingState = false;
                    this.editingCompany.availableStates = response.data;
                    this.matchState();
                });
            } else {
                this.editingCompany.disableState = false;
                this.editingCompany.availableStates = this.cachedStates[this.editingCompany.city.state.country._id];
                this.matchState();
            }
        }

        matchState() {
            if (this.cachedCities[this.editingCompany.city.state._id] === undefined) {
                this.editingCompany.disableCity = true;
                this.editingCompany.queryingCiy = true;
                this.$SignUpRESTService.getCities(this.editingCompany.refCity.state._id).then((response: any) => {
                    this.cachedCities[this.editingCompany.refCity.state._id] = response.data;
                    this.editingCompany.disableCity = false;
                    this.editingCompany.queryingCiy = false;
                    this.editingCompany.availableCities = response.data;
                    this.matchCity();
                });
            } else {
                this.editingCompany.disableCity = false;
                this.editingCompany.availableCities = this.cachedCities[this.editingCompany.city.state._id]
                this.matchCity();
            } 
             
            for (let i = 0; i < this.editingCompany.availableStates.length; i++) {
                if (this.editingCompany.availableStates[i]._id === this.editingCompany.refCity.state._id) {
              
                    this.editingCompany.state = this.editingCompany.availableStates[i]._id;
                    break;
                }
            }
        }
        matchCity() {
            for (let i = 0; i < this.editingCompany.availableCities.length; i++) {
                if (this.editingCompany.availableCities[i]._id === this.editingCompany.refCity._id) {
                    this.editingCompany.city = this.editingCompany.availableCities[i]._id;
                    break;
                }
                
            }
            this.matching = false;
            this.editing = true;
        }

        submitEditing() {
            if (!(this.editingCompany.queryingCity || this.editingCompany.disableCity)) {
                this.$AddressBookRESTService.editCompany(this.editingCompany).then((response: any) => {
                    if (response.success) {
                        let index = this.$AddressBookRESTService.allCompaniesCached.indexOf(this.$AddressBookRESTService.selectedCompany);
                        this.$AddressBookRESTService.allCompaniesCached[index] = response.data;
                        this.$AddressBookRESTService.selectedCompany = this.$AddressBookRESTService.allCompaniesCached[index];
                        this.editing = false;
                    } else {
                        this.toastr.error(response.msg);
                    }
                });
            }
        }

        createCompany(newCompany: any) {

            if (!(newCompany.queryingCity || newCompany.disableCity)) {
                this.$AddressBookRESTService.newCompany(newCompany).then((response: any) => {
                    if (response.success) {
                        this.$AddressBookRESTService.allCompaniesCached.unshift(response.data);
                        this.$AddressBookRESTService.selectedCompany = response.data;
                        this.$state.go('main.addressBook.selectedCompany', { id: response.data._id, company: response.data });
                    } else {
                        if (response.msg.substring(0, 6) === 'E11000') {
                            this.toastr.error('This company already in your address book')
                        } else {
                            this.toastr.error(response.msg);
                        }
                    }
                });
            }
        }
    }

    angular
        .module('app.addressBook', [
            'ui.router',
            'app.helper',
            'app.signup'
        ])
        .config(config)
        .controller('AddressBookController', AddressBookController);

}