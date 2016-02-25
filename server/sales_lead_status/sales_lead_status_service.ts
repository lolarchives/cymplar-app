import {SalesLeadStatus} from '../../client/core/dto';
import {SalesLeadStatusModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class SalesLeadStatusService extends BaseService<SalesLeadStatus> {

	constructor() {
		super(SalesLeadStatusModel, { copyAuthorizationData: '' });
	}

}

export const salesLeadStatusService = new SalesLeadStatusService();

