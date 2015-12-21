import {AccountOrganizationMember} from '../../client/core/dto';
import {AccountOrganizationMemberModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class AccountOrganizationMemberService extends BaseService<AccountOrganizationMember> {

	constructor() {
		super(AccountOrganizationMemberModel, {defaultPopulation: 'role'});
	}

}

export const accountOrganizationMemberService = new AccountOrganizationMemberService();

