import {City} from '../../../client/core/shared/dto';
import {CityModel} from '../../core/shared/model';
import {BaseService} from '../../core/base_service';

export class CityService extends BaseService<City> {

	constructor() {
		super(CityModel);
	}

}

export const cityService = new CityService();

