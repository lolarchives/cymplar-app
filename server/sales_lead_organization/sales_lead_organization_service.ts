import {SalesLeadOrganization, AccountOrganizationMember, AccountOrganization, AuthorizationData, ModelOptions} 
from '../../client/core/dto';
import {SalesLeadOrganizationModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {ObjectUtil} from '../../client/core/util';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';


export class SalesLeadOrganizationService extends BaseService<SalesLeadOrganization> {

	constructor() {
		super(SalesLeadOrganizationModel);
	}

	findOrganizationsAvailableForLead(data: AuthorizationData): Promise<AccountOrganization[]> {
			
		return new Promise<AccountOrganization[]>((resolve: Function, reject: Function) => {
		
			if (ObjectUtil.isBlank(data.leadMember) && ObjectUtil.isBlank(data.leadMember.leadOrganization)) {
				reject(new Error("There is not enough information for adding and organization"));
			}
			
			// Filter existing organizations per lead
			const leadOrgOptions = {
				extendedSearch: { lead: data.leadMember.leadOrganization.lead },
				distinct: 'organization'
			};
			
			// Find existing organizations per logged user that can be added to the lead
			this.findDistinct({}, leadOrgOptions).then((added: string[]) => {
				const orgOptions = {
					extendedSearch: { $ne: added },
					population: 'organization',
					distinct: 'organization'
				};
				
				return accountOrganizationMemberService.findDistinct({user: data.organizationMember.user}, orgOptions);
			})
			.then((available: AccountOrganization[]) => {
				resolve(available);
			})
			.catch((err) => {
				reject(err);
				return;
			});
		});
	}
	
	copySignificantAuthorizationData(data: SalesLeadOrganization, modelOptions: ModelOptions = {}): void {
		if (ObjectUtil.isPresent(modelOptions.authorization) &&
			ObjectUtil.isPresent(modelOptions.authorization.organizationMember)) {
			data.createdBy = modelOptions.authorization.organizationMember._id;
			data.organization = modelOptions.authorization.organizationMember.organization;
		}
		return;
	}
}

export const salesLeadOrganizationService = new SalesLeadOrganizationService();
