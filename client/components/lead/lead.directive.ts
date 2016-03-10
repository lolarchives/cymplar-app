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
  constructor(){
    
  }
}	


	angular
		.module('app.lead')
	
		.directive('logItem', logItem);
}