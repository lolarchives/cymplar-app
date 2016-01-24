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
        private newCompany: any;
        private queryingCity: boolean;
        private availableCities: any[] = [];
        private editing: boolean = false;
        private editingCompany: any;
        private console: any;
        private sampleContact: any;
        /** @ngInject */
        constructor(private $state: any, private countries: any,
            private $SignUpRESTService: any, private industries: any,
            private $AddressBookRESTService: any, private toastr: any, private $scope: any) {
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
            console.log(subject);
            if (subject.country === undefined) {
                subject.disableCity = true;
                if (subject._id === undefined) { // this is the new company
                    this.newCompany.city = undefined;
                } else {
                    this.$AddressBookRESTService.selectedCompany.city = undefined;
                }

            } else {
                if (this.cachedCities[subject.country] === undefined) {
                    subject.disableCity = true;
                    subject.queryingCity = true;
                    this.$SignUpRESTService.getCities(subject.country).then((response: any) => {
                        this.cachedCities[subject.country] = response;
                        subject.disableCity = false;
                        subject.queryingCity = false;
                        subject.availableCities = response.data;

                    });
                } else {
                    subject.disableCity = false;
                    subject.availableCities = this.cachedCities[this.newCompany.country];
                }
            }
        }
        startEditing() {
            this.editing = true;
            // pass by memory
    
            this.editingCompany = angular.copy(this.$AddressBookRESTService.selectedCompany);
            //this.editingCompany.country = angular.copy(this.$AddressBookRESTService.selectedCompany.city.country.id);
           
        }

        submitEditing() {
            if (!(this.editingCompany.queryingCity || this.editingCompany.disableCity)) {
                this.$AddressBookRESTService.editCompany(this.editingCompany).then((response: any) => {
                    console.log(response);
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