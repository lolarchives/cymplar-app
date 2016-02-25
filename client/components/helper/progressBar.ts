namespace progressBar {
	export class ProgressBarController {
		private progressValue: number;
		private loading: boolean;
		private type: string;
		/** @ngInject */
		constructor (private $log: any, private $state: any, private $scope: any, private $interval: any, private $timeout: any) {
			$scope.$on('$stateChangeStart', (event: any, toState: any, toParams: any, fromState: any, fromParams: any) => {
			
				this.progressValue = 50;
				this.loading = true;
				
				this.type = 'info';
			}) ;
			
			$scope.$on('$stateChangeSuccess', (event: any, toState: any, toParams: any, fromState: any, fromParams: any) => {
			
				this.progressValue = 100;
				this.type = 'success';
				$timeout(() => {
						this.loading = false;
				}, 700);
			}) ;
			$scope.$on('$stateChangeError', (event: any, toState: any, toParams: any, fromState: any, fromParams: any) => {
				this.progressValue = 50;
				this.type = 'danger';
				
				 
			}) ;
			
		}
	}
	angular
		.module('app.ui.helper', [])
		.controller('ProgressBarController', ProgressBarController);
}