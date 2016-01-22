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
				template: '<ui-view></ui-view>'
			})
			.state('main.addressBook.newCompany', {
				url: '/new_company',
				template: 'Address book - new Company'
			})
			.state('main.addressBook.selectedCompany', {
				url: '/:id',
				template: '{{$stateParams}}'
			});

	}

	export class AddressBookController {
		/** @ngInject */
		constructor(private $state: any, private $stateParams: any) {
			console.log('initialize address book update');
		}
	}

	angular
		.module('app.addressBook', [
			'ui.router',
			'app.helper',
		])
		.config(config)
		.controller('AddressBookController', AddressBookController);
	
}