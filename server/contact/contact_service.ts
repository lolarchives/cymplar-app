import {Contact} from '../../client/core/dto';
import {ContactModel} from '../core/model';
import {BaseService} from '../core/base_service';


export class ContactService extends BaseService<Contact> {

	constructor() {
		super(ContactModel);
	}

}


export const contactService = new ContactService();
