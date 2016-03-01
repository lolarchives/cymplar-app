import {LogItemType, ModelOptions, AuthorizationResponse} from '../../client/core/dto';
import {LogItemTypeModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class LogItemTypeService extends BaseService<LogItemType> {

	constructor() {
		super(LogItemTypeModel, { copyAuthorizationData: '' });
	}
}

export const logItemTypeService = new LogItemTypeService();

