import {Country} from '../../../client/core/shared/dto';
import {CountryModel} from '../../core/shared/country';
import {BaseService} from '../../core/base_service';

export class CountryService extends BaseService<Country> {

	constructor() {
		super(CountryModel);
	}

}

export const countryService = new CountryService();

