import {Group} from '../../../client/core/address_book/dto';
import {GroupModel} from '../../core/address_book/group';
import {BaseService} from '../../core/base_service';

export class GroupService extends BaseService<Group> {

	constructor() {
		super(GroupModel);
	}
}

export const groupService = new GroupService();

