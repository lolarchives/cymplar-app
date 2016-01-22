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
				template: '{{$stateParams}}'
			});

	}

	export class AddressBookController {
		private disableCity: boolean;
		private cachedCities: any[] = [];
		private newCompany: any;
		private queryingCity: boolean;
		private availableCities: any[] = [];
		/** @ngInject */
		constructor(private $state: any, private $stateParams: any, private countries: any, 
				private $SignUpRESTService: any, private industries: any, private $AddressBookRESTService: any) {
			console.log($AddressBookRESTService);
		}

		countryChanged() {
			// implement caching for higher network efficiency

			if (this.newCompany.country === undefined) {
				this.disableCity = true;
				this.newCompany.city = undefined;
			} else {
				if (this.cachedCities[this.newCompany.country] === undefined) {
					this.disableCity = true;
					this.queryingCity = true;
					this.$SignUpRESTService.getCities(this.newCompany.country).then((response: any) => {
						this.cachedCities[this.newCompany.country] = response;
						this.disableCity = false;
						this.queryingCity = false;
						this.availableCities = response.data;

					});
				} else {
					this.disableCity = false;
					this.availableCities = this.cachedCities[this.newCompany.country];
				}
			}
		}
		
		createCompany(newCompany: any) {
			this.$AddressBookRESTService.newCompany(newCompany).then((response: any) => {
				if (response.success) {
					
				} else {
					alert(response.msg);
				}
			});	
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