import {ObjectUtil} from '../../core/util';
import {LeadStatus}  from '../../core/dto';
import '../auth/auth.service';

namespace accountSettings {
	
	/* @ngInject */
	function config($stateProvider: any) {
		$stateProvider
        .state('main-account.organization', {
            abstract: true,
            url: '/organization/{orgId:[^/]+}',
            views: {
                'main-account': {
                    templateUrl: 'components/account/organization-main.html',
                    controller: 'AccountOrganizationMainController',
                    controllerAs: 'accOrgMainCtrl'
                }
            },
            resolve: {
                organization: function($http: angular.IHttpService, $AccountRESTService: any, $stateParams: any) {
                    return $AccountRESTService.accountOrganizationParam($stateParams.orgId).then(function(response: any) {
                        if (response.success) {
                            return response.data;
                        }
                    });
                },
                profile: function($http: angular.IHttpService, $AccountRESTService: any, $stateParams: any) {
                    return $AccountRESTService.accountOrganizationMemberParam($stateParams.orgId).then(function(response: any) {
                        if (response.success) {
                            return response.data[0];
                        }
                    });
                },
                team: function($http: angular.IHttpService, $AccountRESTService: any, $stateParams: any) {
                    return $AccountRESTService.accountOrganizationTeam($stateParams.orgId).then(function(response: any) {
                        if (response.success) {
                            return response.data;
                        }
                    });
                }    
            }
        })
        .state('main-account.organization.profile', {
            url: '/profile',
            views: {
                'account-org-setting': {
                    templateUrl: 'components/account/account-profile.html',
                    controller: 'AccountOrganizationProfileController',
                    controllerAs: 'accOrgProfCtrl'
                }
            }
        })
        .state('main-account.organization.team', {
            url: '/team',
            views: {
                'account-org-setting': {
                    templateUrl: 'components/account/account-team.html',
                    controller: 'AccountOrganizationTeamController',
                    controllerAs: 'accOrgTeamCtrl'
                }
            }
        })
        .state('main-account.organization.stages', {
            url: '/stages',
            views: {
                'account-org-setting': {
                    templateUrl: 'components/account/account-settings.html',
                    controller: 'AccountOrganizationSettingController',
                    controllerAs: 'accOrgStgCtrl'
                }
            }
        });
	}
	
	export class AccountOrganizationMainController {        
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModal: any,
            private user: any, private organization: any, private AuthToken: any) {
        }
        
        goToOrganization() {
            this.AuthToken.setIdO(this.organization._id);
            this.$state.go('main.dashboard');    
        }
    }
    
    export class AccountOrganizationProfileController {
        
        private userBeautified: string;
        private modalProfileInstance: any;
        
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModal: any,
            private organization: any, private profile: any) {
            
        }
        
        editProfile(profile: any) {
            this.modalProfileInstance = this.$uibModal.open({
                templateUrl: 'components/account/account-profile-modal.html',
                controller: 'ModalProfileInstanceCtrl',
                controllerAs: 'mProfCtrl',
                resolve: {
                    profile: function () {
                        return profile;
                    },
                    roles: function ($SignUpRESTService: any) {
                        return $SignUpRESTService.getRoles({}).then(function(response: any) {
                            if (response.success) {
                                return response.data;
                            }
                        });
                    }
                }
            });
            
            this.modalProfileInstance.result.then((selectedItem: any) => {
                this.profile = selectedItem;
            });
        };
    }
    
    export class ModalProfileInstanceCtrl {
        
        private checkingEmail: boolean;
		private availableEmail: boolean;
        private newProfile: any;
        private oldProfile: any;
		
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModalInstance: any,
            private profile: any, private roles: any, private $SignUpRESTService: any, private $AccountRESTService: any) {
            this.newProfile = ObjectUtil.clone(profile);
            this.oldProfile = profile;
        }
  
        save() {
            const modalInstance = this.$uibModalInstance;
            const theProfileToSave = this.newProfile;
            this.$AccountRESTService.saveAccountOrganizationMember(theProfileToSave).then(function(response: any) {
                if (response.success) {
                    modalInstance.close(response.data);
                } else {
                    this.toastr.error(response.msg);
                }
            });           
        }
        
        cancel() {
            this.$uibModalInstance.dismiss('cancel');          
        }
        
        emailChanged() {
			this.checkingEmail = true;
			this.availableEmail = undefined;
			if (this.newProfile.email !== undefined && this.newProfile.email.trim() !== '' && this.newProfile.email.trim() !== this.profile.email) {
				this.$SignUpRESTService.isAccountOrganizatioMemberExisted(this.newProfile.email).then((response: any) => {
					this.checkingEmail = false;
					this.availableEmail = !response.data.exist;
				});
			} else {
				this.checkingEmail = false;
			}
		}
        
        unAuthorized(): boolean {
            return this.profile.role.code !== 'OWNER';
        }
    }
    
    export class AccountOrganizationTeamController {
        
        private userBeautified: string;
        private modalTeamMemberInstance: any;
        private modalTeamInvitationInstance: any;
        
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModal: any,
            private user: any, private profile: any, private organization: any, private team: any) {
        }
        
        editProfile(member: any) {
            this.modalTeamMemberInstance = this.$uibModal.open({
                templateUrl: 'components/account/account-team-member-modal.html',
                controller: 'ModalTeamMemberInstanceCtrl',
                controllerAs: 'mTeamMemberCtrl',
                resolve: {
                    profile: function () {
                        return member;
                    },
                    roles: function ($SignUpRESTService: any) {
                        return $SignUpRESTService.getRoles({}).then(function(response: any) {
                            if (response.success) {
                                return response.data;
                            }
                        });
                    }
                }
            });
            
            this.modalTeamMemberInstance.result.then((selectedItem: any) => {
                console.log('updated ' + selectedItem);
            });
        }
        
        sendInvitation() {
            const currentOrganization = this.organization;
            this.modalTeamInvitationInstance = this.$uibModal.open({
                templateUrl: 'components/account/account-team-invitation-modal.html',
                controller: 'ModalTeamInvitationInstanceCtrl',
                controllerAs: 'mTeamInvitationCtrl',
                resolve: {
                    organization: function () {
                        return currentOrganization;
                    },
                    roles: function ($SignUpRESTService: any) {
                        return $SignUpRESTService.getRoles({}).then(function(response: any) {
                            if (response.success) {
                                return response.data;
                            }
                        });
                    }
                }
            });
            
            this.modalTeamInvitationInstance.result.then((selectedItem: any) => {
                console.log('sent ' + selectedItem);
            });
        }
        
        isAuthorized(): boolean {
            return this.profile.role.code === 'OWNER';
        }
    }
    
    export class ModalTeamMemberInstanceCtrl {
        
        private newProfile: any;
        private oldProfile: any;
		
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModalInstance: any,
            private profile: any, private roles: any, private $SignUpRESTService: any, private $AccountRESTService: any) {
            this.newProfile = ObjectUtil.clone(profile);
            this.oldProfile = profile;
        }
  
        save() {
            const modalInstance = this.$uibModalInstance;
            const theProfileToSave = this.newProfile;
            this.$AccountRESTService.saveAccountOrganizationMember(theProfileToSave).then(function(response: any) {
                if (response.success) {
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
    
    export class ModalTeamInvitationInstanceCtrl {
        
        private checkingEmail: boolean;
		private availableEmail: boolean;
        private invitation: any;
		
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModalInstance: any,
             private organization: any, private roles: any, private $SignUpRESTService: any, private $InvitationRESTService: any) {
            
        }
  
        save(invitation: any) {
            const modalInstance = this.$uibModalInstance;
            this.$InvitationRESTService.sendInvitation(invitation, this.organization._id).then(function(response: any) {
                if (response.success) {
                    modalInstance.close(response.data);
                } else {
                    this.toastr.error(response.msg);
                }
            });           
        }
        
        cancel() {
            this.$uibModalInstance.dismiss('cancel');          
        }
        
        emailChanged() {
			this.checkingEmail = true;
			this.availableEmail = undefined;
			if (this.invitation.email !== undefined && this.invitation.email.trim() !== '') {
				this.$SignUpRESTService.isAccountOrganizatioMemberExisted(this.invitation.email).then((response: any) => {
					this.checkingEmail = false;
					this.availableEmail = !response.data.exist;
				});
			} else {
				this.checkingEmail = false;
			}
		}
    }

    export class AccountOrganizationSettingController {
        
        private modalStateInstance: any;
        private errors: string[];
        private previousOrganizationStages: any;
        
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModal: any,
            private user: any, private profile: any, private organization: any, private $AccountRESTService: any) {
                this.previousOrganizationStages = ObjectUtil.clone(organization.projectDefaultStatuses);
        }
        
        edit(stage: any) {
            const theOrganization = this.organization;
            this.modalStateInstance = this.$uibModal.open({
                templateUrl: 'components/account/account-settings-modal.html',
                controller: 'ModalStagesInstanceCtrl',
                controllerAs: 'mStagesCtrl',
                resolve: {
                    stage: function () {
                        return stage;
                    },
                    organization: function () {
                        return theOrganization;
                    }
                }
            });
            
           this.modalStateInstance.result.then((newStageArray: LeadStatus[]) => {
                this.errors = [];
                /*const statePercentageTotal = newStageArray.reduce((currentStatus, nextStatus) => {
                    return currentStatus.value + nextStatus.value;
                });
                
                if (statePercentageTotal !== 100) {
                    this.toastr.error('There are some things you should check before save changes');
                    this.errors.push('The sumatory of statuses should be 100%');
                }*/
            });
        }
        
        delete(index: any) {
            this.organization.projectDefaultStatuses.splice(index, 1);
        }
        
        saveChanges() {
            let currentOrg = this.organization;
            currentOrg['previousOrganizationStages'] = this.previousOrganizationStages; 
            const toastrInstance = this.toastr;
            this.$AccountRESTService.saveAccountOrganization(currentOrg).then((response: any) => {
                if (response.success) {
                    currentOrg = response.data;
                } else {
                    toastrInstance.error('The stages information could not be updated');    
                }
            });
		}

        isAuthorized(): boolean {
            return this.profile.role.code === 'OWNER';
        }
    }
    
    export class ModalStagesInstanceCtrl {
        
        private newStage: any[];
        private oldStage: any[];
        private currentStage: any;
		
        /** @ngInject */
        constructor(private $state: any, $stateParams: any, private toastr: any, private $scope: any, private $uibModalInstance: any,
            private stage: number, private organization: any) {
            this.newStage = organization.projectDefaultStatuses;
            this.oldStage = ObjectUtil.clone(organization.projectDefaultStatuses);
            
           if (stage < 0) {
                this.newStage.push({});
                stage = this.newStage.length - 1;
            } 
            
            this.currentStage = this.newStage[stage];
            this.currentStage['id'] = stage;
        }
  
        save() {
            if (!this.currentStage['label'] || this.currentStage['label'].trim() === '' ) {
                return this.toastr.error('A name is required');
            }
            
            if (!this.currentStage['value'] || this.currentStage['value'].trim() === '' ) {
                return this.toastr.error('A value is required');
            }
            
            this.$uibModalInstance.close(this.newStage);           
        }
        
        cancel() {
            this.organization.projectDefaultStatuses = this.oldStage;
            this.$uibModalInstance.dismiss(this.oldStage);          
        }
    }
    
   	angular.module('app.account-settings', [
		'ui.router'
	])
	.config(config)
    .controller('AccountOrganizationMainController', AccountOrganizationMainController)
    .controller('AccountOrganizationProfileController', AccountOrganizationProfileController)
    .controller('ModalProfileInstanceCtrl', ModalProfileInstanceCtrl)
    .controller('AccountOrganizationTeamController', AccountOrganizationTeamController)
    .controller('ModalTeamMemberInstanceCtrl', ModalTeamMemberInstanceCtrl)
    .controller('ModalTeamInvitationInstanceCtrl', ModalTeamInvitationInstanceCtrl)
    .controller('AccountOrganizationSettingController', AccountOrganizationSettingController)
    .controller('ModalStagesInstanceCtrl', ModalStagesInstanceCtrl);
}