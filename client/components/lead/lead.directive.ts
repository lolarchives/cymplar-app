import '../helper/helper';
import '../auth/auth.service';
import './lead';
import {BACK_END_ROUTE, SalesLead} from '../../core/dto';
namespace LeadDirective {
  /** @ngInject */
  export function logItem(): angular.IDirective {

    return {
      restrict: 'E',
      scope: {
        item: '=',
      },
      templateUrl: 'components/lead/log_item.html',
      controller: LogItemController,
      controllerAs: 'liCtrl',
      bindToController: true
    };

  }
  export function leadChatItem(): angular.IDirective {

    return {
      restrict: 'E',
      scope: {
        item: '=',
        user:'='
      },
      templateUrl: 'components/lead/lead_chat_item.html',
      controller: LeadChatItemController,
      controllerAs: 'lciCtrl',
      bindToController: true
    };

  }

  /** @ngInject */
  export class LogItemController {
    private commType: any;
    private fwupType: any;
    private noteType: any;
    private meetType: any;
    private item: any;
    private reactiveFromNow: any;
    constructor(private toastr: any, private $LogItemRESTService: any,
      private moment: any, private ultiHelper: any, private $scope: any
      , private socket: any, private $interval: any, private $uibModal: any) {
      for (let i = 0; i < $LogItemRESTService.allLogItemTypesCached.length; i++) {
        if ($LogItemRESTService.allLogItemTypesCached[i].code === 'COMM') {
          this.commType = $LogItemRESTService.allLogItemTypesCached[i];
        }
        if ($LogItemRESTService.allLogItemTypesCached[i].code === 'NOTE') {
          this.noteType = $LogItemRESTService.allLogItemTypesCached[i];
        }
        if ($LogItemRESTService.allLogItemTypesCached[i].code === 'FWUP') {
          this.fwupType = $LogItemRESTService.allLogItemTypesCached[i];
        }
        if ($LogItemRESTService.allLogItemTypesCached[i].code === 'MEET') {
          this.meetType = $LogItemRESTService.allLogItemTypesCached[i];
        }
      }
      if (this.item !== undefined){
        this.reactiveFromNow = moment(this.item.createdAt).fromNow();
        
      }
      $interval(() => {
        if (this.item !== undefined)
          this.reactiveFromNow = moment(this.item.createdAt).fromNow();
      }, 45000)
        

      
    }
    deleteItem() {
      let result: boolean = confirm('This action is irreseversible. Do you want to proceed?');
      if (result) {
        this.$LogItemRESTService.deleteLogItem(this.item).then((response: any) => {

          if (response.success) {
            let index = this.ultiHelper.indexOfFromId(this.$LogItemRESTService.allLogItemsCached, this.item);
            this.$LogItemRESTService.allLogItemsCached.splice(index, 1);

            const notification = {
              lead: response.data['lead'],
              message: 'this is optional',
              data: this.item
            };

            this.socket.emit('leadLogDeleted', notification);
            this.item = undefined;
            this.toastr.success('Delete item success');

          } else {
            this.toastr.error(response.msg);
          }
        });
      };
    }



    startEditingItem() {
      let modalInstance = this.$uibModal.open({
        animation: true,
        templateUrl: 'components/lead/edit_item.html',
        controller: 'EditItemModalController',
        controllerAs: 'eimCtrl',
        size: 'lg',
        backdrop: 'static',
        resolve: {
          item: () => {
            return angular.copy(this.item);
          },
          commType: () => {
            return this.commType;
          },
          noteType: () => {
            return this.noteType;
          },
          fwupType: () => {
            return this.fwupType;
          },
          meetType: () => {
            return this.meetType;
          }
        }
      });
      modalInstance.result.then((updatedItem: any) => {
        const notification = {
          lead: updatedItem['lead'],
          message: 'this is optional',
          data: updatedItem
        };

        this.socket.emit('leadLogEdit', notification);

        this.toastr.success('Edited item success');
      })
    }
  }
  
  /** @ngInject */
  export class LeadChatItemController {
    
    private item: any;
    private reactiveFromNow: any;
    constructor(private toastr: any, private $LeadChatItemRESTService: any,
      private moment: any, private ultiHelper: any, private $scope: any
      , private socket: any, private $LeadRESTService: any, private $interval: any, private $uibModal: any) {
     
      
      this.reactiveFromNow = moment(this.item.createdAt).fromNow();

      $interval(() => {
        if (this.item !== undefined)
          this.reactiveFromNow = moment(this.item.createdAt).fromNow();
      }, 45000)
    }
    
    retryingChat() {
          this.item.status = "Sending";    
          this.$LeadChatItemRESTService.newLeadChatItem(this.item).then((response: any) => {
            console.log('response', this.item);
            if (response.success) {
              const chatItem = {
                lead: this.$LeadRESTService.selectedLead._id,
                message: 'optional',
                data: response.data
              };
              let index = this.ultiHelper.indexOfFromId(this.$LeadChatItemRESTService.allLeadChatItems,
                this.item);
              this.$LeadChatItemRESTService.allLeadChatItems.splice(index, 1);
              this.$LeadChatItemRESTService.allLeadChatItems.unshift(response.data);
              this.socket.emit('leadChatAdd', chatItem);
            } else {
              console.log('in failed')
              this.item.status = 'Failed'
            }
          }
    }
    
    deleteItem() {
      let result: boolean = confirm('This action is irreseversible. Do you want to proceed?');
      if (result) {
        this.$LeadChatItemRESTService.deleteLeadChatItem(this.item).then((response: any) => {

          if (response.success) {
            let index = this.ultiHelper.indexOfFromId(this.$LeadChatItemRESTService.allLeadChatItems, this.item);
            this.$LeadChatItemRESTService.allLeadChatItems.splice(index, 1);

            const notification = {
              lead: response.data['lead'],
              message: 'this is optional',
              data: this.item
            };

            this.socket.emit('leadChatDelete', notification);
            this.item = undefined;
            this.toastr.success('Delete item success');

          } else {
            this.toastr.error(response.msg);
          }
        });
      };
    }



    startEditingItem() {
      let modalInstance = this.$uibModal.open({
        animation: true,
        templateUrl: 'components/lead/edit_item.html',
        controller: 'EditItemModalController',
        controllerAs: 'eimCtrl',
        size: 'lg',
        backdrop: 'static',
        resolve: {
          item: () => {
            return angular.copy(this.item);
          },
        }
      });
      modalInstance.result.then((updatedItem: any) => {
        const notification = {
          lead: updatedItem['lead'],
          message: 'this is optional',
          data: updatedItem
        };

        this.socket.emit('leadLogEdit', notification);

        this.toastr.success('Edited item success');
      })
    }
  }

  export function EditItemModalController($uibModalInstance: any,
    item: any, noteType: any, commType: any, fwupType: any,
    meetType: any, $LogItemRESTService: any) {

    this.item = item;
    this.noteType = noteType;
    this.commType = commType;
    this.fwupType = fwupType;
    this.meetType = meetType;
    this.dateOpen = false;
    this.pleasePickADate = false;
    this.itemType = this.item.type;

    this.datePicker = item.dateTime == undefined ? undefined : new Date(this.item.dateTime);


    console.log('item', this.itemType, this.commType, this.itemType == this.commType);
    this.editLogItem = () => {
      this.item.type = this.itemType;
      this.pleasePickADate = false;

      if (this.itemType._id === this.fwupType._id || this.itemType._id === this.meetType._id) {
        if (this.datePicker !== undefined) {
          this.item.dateTime = this.datePicker.valueOf();
        } else {
          this.pleasePickADate = true;
        }
      }

      if (!this.pleasePickADate) {
        $LogItemRESTService.editLogItem(this.item).then((response: any) => {
          if (response.success) {
            $uibModalInstance.close(response.data);

          }
        })
      }
    }
    this.cancel = () => {
      $uibModalInstance.dismiss('cancel');
    }
  }

  angular
    .module('app.lead')
    .controller('EditItemModalController', EditItemModalController)
    .directive('logItem', logItem)
    .directive('leadChatItem', leadChatItem);
}