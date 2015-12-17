import {Country} from '../../client/core/dto';
import {CountryModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class CountryService extends BaseService<Country> {

	constructor() {
		super(CountryModel);
	}

}

export const countryService = new CountryService();

