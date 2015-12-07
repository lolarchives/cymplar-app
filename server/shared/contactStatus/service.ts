import {ContactStatus} from '../../../client/core/shared/dto';
import {ContactStatusModel} from '../../core/shared/model';
import {BaseService} from '../../core/base_service';

export class ContactStatusService extends BaseService<ContactStatus> {

	constructor() {
		super(ContactStatusModel);
	}

}

export const contactStatusService = new ContactStatusService();

