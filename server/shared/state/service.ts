import {State} from '../../../client/core/shared/dto';
import {StateModel} from '../../core/shared/model';
import {BaseService} from '../../core/base_service';

export class StateService extends BaseService<State> {

	constructor() {
		super(StateModel);
	}

}

export const stateService = new StateService();

