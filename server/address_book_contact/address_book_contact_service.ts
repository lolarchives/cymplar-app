import {AddressBookContact} from '../../client/core/dto';
import {AddressBookContactModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class AddressBookContactService extends BaseService<AddressBookContact> {

	constructor() {
		super(AddressBookContactModel);
	}

}

export const addressBookContactService = new AddressBookContactService();

