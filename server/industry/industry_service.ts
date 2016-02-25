import {Industry} from '../../client/core/dto';
import {IndustryModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class IndustryService extends BaseService<Industry> {

	constructor() {
		super(IndustryModel, { copyAuthorizationData: '' });
	}

}

export const industryService = new IndustryService();

