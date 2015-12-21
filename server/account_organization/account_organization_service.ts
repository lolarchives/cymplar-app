import {AccountOrganization} from '../../client/core/dto';
import {AccountOrganizationModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class AccountOrganizationService extends BaseService<AccountOrganization> {

	constructor() {
		super(AccountOrganizationModel);
	}

}

export const accountOrganizationService = new AccountOrganizationService();

