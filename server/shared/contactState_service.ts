import {ContactState} from '../../client/core/shared/dto';
import {ContactStateModel} from '../core/shared/contactState';
import {BaseService} from '../core/base_service';

export class ContactStateService extends BaseService<ContactState> {

	constructor() {
		super(ContactStateModel);
	}

}

export const contactStateService = new ContactStateService();

