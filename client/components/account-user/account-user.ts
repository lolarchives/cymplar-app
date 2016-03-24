import {ObjectUtil} from '../../core/util';
import '../auth/auth.service';

namespace accountUserSettings {
	
	/* @ngInject */
	function config($stateProvider: any) {
		$stateProvider
        .state('main-account.user', {
            abstract: true,
            url: '/user',
            views: {
                'main-account': {
                    templateUrl: 'components/account-user/user-main.html',
                    controller: 'AccountUserMainController',
                    controllerAs: 'accUsrMainCtrl'
                }
            },
            resolve: {
                organization: function($http: angular.IHttpService, $AccountRESTService: any, $stateParams: any) {
                    return $AccountRESTService.accountOrganizationParam($stateParams.orgId).then(function(response: any) {
                        if (response.success) {
                            return response.data;
                        }
                    });
                } 
            }
        })
        .state('main-account.user.profile', {
            url: '/profile',
            views: {
                'account-usr-setting': {
                    templateUrl: 'components/account-user/account-user.html',
                    controller: 'AccountUserProfileController',
                    controllerAs: 'accUsrProfCtrl'
                }
            }
        });
	}
	
    export class AccountUserProfileController {
        
        private userBeautified: string;
        private modalProfileInstance: any;
        
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModal: any,
            private user: any) {
            
        }
        
        editProfile(user: any) {
            this.modalProfileInstance = this.$uibModal.open({
                templateUrl: 'components/account-user/account-user-modal.html',
                controller: 'ModalUserProfileInstanceCtrl',
                controllerAs: 'mUsrProfCtrl',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });
            
            this.modalProfileInstance.result.then((selectedItem: any) => {
                this.user = selectedItem;
            });
        };
    }
    
    export class AccountUserMainController {        
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModal: any,
            private user: any, private organization: any, private AuthToken: any) {
        }
        
        goToOrganization() {
            this.AuthToken.setIdO(this.organization._id);
            this.$state.go('main.dashboard');    
        }
    }
    
    export class ModalUserProfileInstanceCtrl {
        
        private newProfile: any;
        private oldProfile: any;
        private errors: Array<string> = [];
        private newPassword: string;
        private passwordConfirmation: string;
		
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModalInstance: any,
            private user: any, private $SignUpRESTService: any, private $AccountRESTService: any) {
            //, private Upload: any
            this.errors = [];
            this.newProfile = ObjectUtil.clone(user);
            this.oldProfile = user;
            this.newPassword = '';
            this.passwordConfirmation = '';
        }
        
        onPasswordChange() {
			this.errors = [];
            
            if (ObjectUtil.isPresent(this.newPassword) && ObjectUtil.isBlank(this.passwordConfirmation)) {
                this.errors.push(`A confirmation of the password is required!`);   
            }
            
            if (this.newPassword !== this.passwordConfirmation) {
                this.errors.push(`Passwords do not match!`);   
            }
		}
        
        isInvalid() {
            console.log(JSON.stringify(this.errors));
			return this.errors.length > 0;
		}
        
        change() {
            /*this.Upload.upload({
                url: `/api/upload`,
                file: this.$scope.file
            })
            .success(function(data: any) {
                console.log(data, 'uploaded');
            });*/   
        }

        save() {
            const modalInstance = this.$uibModalInstance;
            const theProfileToSave = this.newProfile;
            if (ObjectUtil.isPresent(this.newPassword) && this.newPassword.trim().length > 0) {
                theProfileToSave['password'] = this.newPassword; 
            }
            this.$AccountRESTService.saveAccountOrganizationMember(theProfileToSave).then(function(response: any) {
                if (response.success) {
                    this.toastr.info('Your general information was successfully updated');
                    modalInstance.close(response.data);
                } else {
                    this.toastr.error(response.msg);
                }
            });           
        }
        
        cancel() {
            this.$uibModalInstance.dismiss('cancel');          
        }
    }
    
   	angular.module('app.account-user-settings', [
		'ui.router'
        //'ngFileUpload'
	])
	.config(config)
    .controller('AccountUserMainController', AccountUserMainController)
    .controller('AccountUserProfileController', AccountUserProfileController)
    .controller('ModalUserProfileInstanceCtrl', ModalUserProfileInstanceCtrl);
}
