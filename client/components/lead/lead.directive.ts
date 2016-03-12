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

  /** @ngInject */
  export class LogItemController {
    private commType: any;
    private fwupType: any;
    private noteType: any;
    private meetType: any;
    private item: any;
    constructor(private toastr: any, private $LogItemRESTService: any, private moment: any, private ultiHelper: any) {
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

    }
    deleteItem() {
      let result: boolean = confirm('This action is irreseversible. Do you want to proceed?');
      if (result) {
        this.$LogItemRESTService.deleteLogItem(this.item).then((response: any) => {

          if (response.success) {
            let index = this.ultiHelper.indexOfFromId(this.$LogItemRESTService.allLogItemsCached, this.item);
            this.$LogItemRESTService.allLogItemsCached.splice(index, 1);
            this.item = undefined;
            this.toastr.success('Delete item success');
           
          } else {
            this.toastr.error(response.msg);
          }
        });
      };
    }
  }


  angular
    .module('app.lead')

    .directive('logItem', logItem);
}