import {State} from '../../client/core/dto';
import {StateModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class StateService extends BaseService<State> {

	constructor() {
		super(StateModel, { copyAuthorizationData: '' });
	}

}

export const stateService = new StateService();

