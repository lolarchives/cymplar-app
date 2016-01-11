import {SalesLeadContact} from '../../client/core/dto';
import {SalesLeadContactModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class SalesLeadContactService extends BaseService<SalesLeadContact> {

	constructor() {
		
		const defaultModelOptions = {
			population: [
				{path: 'contact'},
				{path: 'lead', select: 'name' }]
		};
		
		super(SalesLeadContactModel, defaultModelOptions);
	}

}

export const salesLeadContactService = new SalesLeadContactService();

