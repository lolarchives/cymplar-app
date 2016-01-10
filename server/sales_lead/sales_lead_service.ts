import {SalesLead, SalesLeadContact, SalesLeadOrganization, SalesLeadOrganizationMember,
	AccountOrganizationMember, ModelOptions} from '../../client/core/dto';
import {SalesLeadModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {salesLeadContactService} from '../sales_lead_contact/sales_lead_contact_service';
import {salesLeadOrganizationService} from '../sales_lead_organization/sales_lead_organization_service';
import {salesLeadOrganizationMemberService} from '../sales_lead_organization_member/sales_lead_organization_member_service';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';
import {ObjectUtil} from '../../client/core/util';

export class SalesLeadService extends BaseService<SalesLead> {

	constructor() {
		super(SalesLeadModel);
	}
	
	createOne(data: SalesLead, newOptions: ModelOptions = {}): Promise<SalesLead> {
		
		let createdSalesLead: SalesLead;
		
		return new Promise<SalesLead>((fulfill: Function, reject: Function) => {
			super.createOne(data, newOptions)
			.then((salesLead: SalesLead) => {
				createdSalesLead = salesLead;
				const chainCreationModelOptions: ModelOptions = {
					requireAuthorization: false, // As it is a creation in chain the authorization validation can be skipped
					authorization: newOptions.authorization
				};
				const toAssociate: any = [this.associateOrganization(createdSalesLead, chainCreationModelOptions), 
							   this.associateContact(createdSalesLead, chainCreationModelOptions, data.contact)];
							   
				return Promise.all(toAssociate); 
			})
			.then((results: any) => {
				const leadOrganization: SalesLeadOrganization = results[0];
				const leadContact: SalesLeadContact = results[1];
				const membersCreationModelOptions: ModelOptions = {
					requireAuthorization: false, // As it is a creation in chain the authorization validation can be skipped
					authorization: newOptions.authorization
				};
				return this.associateOrganizationMembers(leadOrganization, membersCreationModelOptions); 
			})
			.then((salesLeadOrganizationMember: SalesLeadOrganizationMember) => { 		
				fulfill(createdSalesLead); 
			})
			.catch((err) => {
				if (ObjectUtil.isPresent(createdSalesLead._id)) {
					this.removeOneById(createdSalesLead._id);
				} 
				reject(err); 
			});
		});
	}
	
	private associateOrganization(data: SalesLead, options: ModelOptions = {}): Promise<SalesLeadOrganization> {

		return new Promise<SalesLeadOrganization>((fulfill: Function, reject: Function) => {
			const leadOrganization: SalesLeadOrganization = {
				lead: data,
				organization: options.authorization.organizationMember.organization
			};
			salesLeadOrganizationService.createOne(leadOrganization, options)
			.then((createdLeadOrganization: SalesLeadOrganization) => { 
				fulfill(createdLeadOrganization); 
			})
			.catch((err) => {
				reject(err); 
			});
		});
	}
	
	private associateContact(data: SalesLead, options: ModelOptions = {}, contact: String): Promise<SalesLeadContact> {

		return new Promise<SalesLeadContact>((fulfill: Function, reject: Function) => {
			const leadContact: SalesLeadContact = {
				lead: data._id,
				contact: contact
			};
			
			salesLeadContactService.createOne(leadContact, options)
			.then((createdLeadContact: SalesLeadContact) => { 		
				fulfill(createdLeadContact); 
			})
			.catch((err) => {
				reject(err); 
			});
		});
	}
	
	private associateOrganizationMembers(organizationLead: SalesLeadOrganization,
		options: ModelOptions = {}): Promise<SalesLeadOrganizationMember[]> {

		return new Promise<SalesLeadOrganizationMember>((fulfill: Function, reject: Function) => {
			
			const orgMemberModelOptions: ModelOptions = { 
				complexSearch: { 
					$or: [ { 'organization': organizationLead._id, 'role.code': { $in: ['OWNER'] } }, 
							{ '_id': options.authorization.organizationMember._id } ]
				},
				population: 'role',
				requireAuthorization: false,
				authorization: options.authorization,
				copyAuthorizationData: false
			};
			
			accountOrganizationMemberService.find({}, orgMemberModelOptions)
			.then((members: AccountOrganizationMember[]) => {
				const organizationMembersToCreate: Promise<SalesLeadOrganizationMember>[] = [];
				const leadOrgMemberOptions: ModelOptions = { 
						requireAuthorization: false,
						authorization: options.authorization
					};
					
				for (let i = 0; i < members.length; i++) {
					const leadOrganizationMember = {
						leadOrganization: organizationLead._id,
						member: members[i]
					};
					organizationMembersToCreate.push(salesLeadOrganizationMemberService.createOne(leadOrganizationMember, leadOrgMemberOptions));
				}
				 
				return Promise.all(organizationMembersToCreate); 
			})
			.then((leadMembers: SalesLeadOrganizationMember[]) => {
				fulfill(leadMembers);
			})
			.catch((err: any) => {
				reject(err);
			});
		});
	}
}

export const salesLeadService = new SalesLeadService();