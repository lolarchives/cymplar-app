import {Contact} from '../../../client/core/address_book/dto';
import {ContactModel} from '../../core/address_book/contact';
import {BaseService} from '../../core/base_service';

export class ContactService extends BaseService<Contact> {

	constructor() {
		super(ContactModel);
	}

}

export const contactService = new ContactService();

