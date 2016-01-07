import {SalesLeadOrganizationMember, ModelOptions} from '../../client/core/dto';
import {SalesLeadOrganizationMemberModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';

export class SalesLeadOrganizationMemberService extends BaseService<SalesLeadOrganizationMember> {

	constructor() {
		super(SalesLeadOrganizationMemberModel);
	}
}

export const salesLeadOrganizationMemberService = new SalesLeadOrganizationMemberService();

