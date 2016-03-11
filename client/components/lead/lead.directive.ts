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
    constructor(private $LogItemRESTService: any, private moment: any) {
      for (let i = 0; i < $LogItemRESTService.allLogItemTypesCached.length; i++) {
        if ($LogItemRESTService.allLogItemTypesCached[i].code == 'COMM') this.commType = $LogItemRESTService.allLogItemTypesCached[i];
        if ($LogItemRESTService.allLogItemTypesCached[i].code == 'NOTE') this.noteType = $LogItemRESTService.allLogItemTypesCached[i];
        if ($LogItemRESTService.allLogItemTypesCached[i].code == 'FWUP') this.fwupType = $LogItemRESTService.allLogItemTypesCached[i];
        if ($LogItemRESTService.allLogItemTypesCached[i].code == 'MEET') this.meetType = $LogItemRESTService.allLogItemTypesCached[i];
      }
      console.log(moment);
    }
  }


  angular
    .module('app.lead')

    .directive('logItem', logItem);
}