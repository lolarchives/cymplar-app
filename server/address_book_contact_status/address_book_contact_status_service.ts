import {AddressBookContactStatus} from '../../client/core/dto';
import {AddressBookContactStatusModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class AddressBookContactStatusService extends BaseService<AddressBookContactStatus> {

	constructor() {
		super(AddressBookContactStatusModel);
	}

}

export const addressBookContactStatusService = new AddressBookContactStatusService();

