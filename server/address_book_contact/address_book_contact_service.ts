import {AddressBookContact, ModelOptions} from '../../client/core/dto';
import {AddressBookContactModel, StateModel, CountryModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class AddressBookContactService extends BaseService<AddressBookContact> {

	constructor() {
		const modelOptions: ModelOptions = {
			population: [
				{path: 'city',
					populate: {
						path: 'state', 
						model: StateModel,
						populate: {
							path: 'country', 
							model: CountryModel
						}
					}
				}
			]
		};
		super(AddressBookContactModel, modelOptions);
	}

}

export const addressBookContactService = new AddressBookContactService();

