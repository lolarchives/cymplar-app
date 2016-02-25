import {City} from '../../client/core/dto';
import {CityModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class CityService extends BaseService<City> {

	constructor() {
		super(CityModel, { copyAuthorizationData: '' });
	}

}

export const cityService = new CityService();

