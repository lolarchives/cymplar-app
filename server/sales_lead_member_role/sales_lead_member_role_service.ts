import {SalesLeadMemberRole} from '../../client/core/dto';
import {SalesLeadMemberRoleModel} from '../core/model';
import {BaseService} from '../core/base_service';

export class SalesLeadMemberRoleService extends BaseService<SalesLeadMemberRole> {

	constructor() {
		super(SalesLeadMemberRoleModel, { copyAuthorizationData: '' });
	}

}

export const salesLeadMemberRoleService = new SalesLeadMemberRoleService();

