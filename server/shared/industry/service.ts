import {Industry} from '../../../client/core/shared/dto';
import {IndustryModel} from '../../core/shared/model';
import {BaseService} from '../../core/base_service';

export class IndustryService extends BaseService<Industry> {

	constructor() {
		super(IndustryModel);
	}

}

export const industryService = new IndustryService();

