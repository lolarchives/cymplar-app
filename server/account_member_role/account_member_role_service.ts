import {AccountMemberRole, ModelOptions} from '../../client/core/dto';
import {AccountMemberRoleModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class AccountMemberRoleService extends BaseService<AccountMemberRole> {

	constructor() {
		super(AccountMemberRoleModel, { copyAuthorizationData: '' });
	}
}

export const accountMemberRoleService = new AccountMemberRoleService();

