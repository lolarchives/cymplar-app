import {AccountUser} from '../../client/core/dto';
import {AccountUserModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class AccountUserService extends BaseService<AccountUser> {

	constructor() {
		super(AccountUserModel);
	}

}

export const accountUserService = new AccountUserService();

