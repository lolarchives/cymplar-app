import {City} from '../../../client/core/shared/dto';
import {CityModel} from '../../core/shared/city';
import {BaseService} from '../../core/base_service';

export class CityService extends BaseService<City> {

	constructor() {
		super(CityModel);
	}

}

export const cityService = new CityService();

