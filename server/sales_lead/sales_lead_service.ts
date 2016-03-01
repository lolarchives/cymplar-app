import {SalesLead, SalesLeadContact, SalesLeadOrganizationMember, AccountOrganizationMember, ModelOptions,
	AuthorizationResponse, AccountOrganization} from '../../client/core/dto';
import {SalesLeadModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {salesLeadContactService} from '../sales_lead_contact/sales_lead_contact_service';
import {salesLeadOrganizationMemberService} from '../sales_lead_organization_member/sales_lead_organization_member_service';
import {accountOrganizationMemberService} from '../account_organization_member/account_organization_member_service';
import {ObjectUtil} from '../../client/core/util';
import {salesLeadMemberRoleService} from '../sales_lead_member_role/sales_lead_member_role_service';
import {accountMemberRoleService} from '../account_member_role/account_member_role_service';

export class SalesLeadService extends BaseService<SalesLead> {

	constructor() {
		super(SalesLeadModel, { population: 'status' });
	}
	
	createOne(data: SalesLead, newOptions: ModelOptions = {}): Promise<SalesLead> {
		
		let createdSalesLead: SalesLead = {};
		
		return new Promise<SalesLead>((fulfill: Function, reject: Function) => {
			super.createOne(data, newOptions)
			.then((salesLead: SalesLead) => {
				createdSalesLead = salesLead;
				const leadMemberCreationModelOptions: ModelOptions = {
					authorization: newOptions.authorization,
					requireAuthorization: false,
					validatePostSearchAuthData: false,
					copyAuthorizationData: ''
				};	   
				return this.associateOrganizationMembers(createdSalesLead, leadMemberCreationModelOptions); 
			})
			.then((members: SalesLeadOrganizationMember[]) => {
				const leadContactCreationModelOptions: ModelOptions = {
					authorization: newOptions.authorization,
					copyAuthorizationData: 'lead',
					population: 'contact'
				};
				leadContactCreationModelOptions.authorization.leadMember = members[0];	// Assigns creator
				
				if (ObjectUtil.isPresent(data.contact)) {
					return this.associateContact(createdSalesLead, leadContactCreationModelOptions, data.contact);	
				} else {
					return {};
				}
			})
			.then((contact: SalesLeadContact) => {	
				
				if (ObjectUtil.isPresent(contact) && ObjectUtil.isPresent(contact.contact)) {
					createdSalesLead['contacts'] = [contact.contact];	
				}
				 
				fulfill(createdSalesLead); 
			})
			.catch((err) => {
				if (ObjectUtil.isPresent(createdSalesLead._id)) {
					this.removeSkipingHooks({_id: createdSalesLead._id});
					salesLeadContactService.removeSkipingHooks({lead: createdSalesLead._id});
					salesLeadOrganizationMemberService.removeSkipingHooks({lead: createdSalesLead._id});
					}
				reject(err);
				return;
			});
		});
	}
	
	updateOne(data: SalesLead, newOptions: ModelOptions = {}): Promise<SalesLead> {	
		return new Promise<SalesLead>((resolve: Function, reject: Function) => {
			const txModelOptions = this.obtainTransactionModelOptions(newOptions);			
			this.preUpdateOne(data, txModelOptions)
			.then((objectToUpdate: any) => {
				
				// TO DO: report log of status change
				/*if (ObjectUtil.isPresent(data['currentStatus']) && (objectToUpdate['currentStatus'] !== data['currentStatus'])) {
				}*/	
					
				for (let prop in data) {
					objectToUpdate[prop] = data[prop];
				}
				
				objectToUpdate.save((err: Error, savedDoc: any) => {
					if (err) {
						reject(err);
						return;
					}
					savedDoc.populate(txModelOptions.population, (err: Error, populatedObj: any) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(populatedObj.toObject());
						return;
					});
				});
			})
			.catch((err) => {
				reject(err);
				return;
			});
		});
	}
	
	findPerOrganization(data: SalesLead, newOptions: ModelOptions = {}): Promise<SalesLead[]> {
		return new Promise<SalesLead>((fulfill: Function, reject: Function) => {
			const salesLeadOrgMembOptions: ModelOptions = {
				authorization: newOptions.authorization
			};
			salesLeadOrganizationMemberService.findLeadsPerOrganization(salesLeadOrgMembOptions)
			.then((salesLeads: string[]) => {
				newOptions.additionalData = { _id: { $in: salesLeads }};
				newOptions.requireAuthorization = false;
				return super.find(data, newOptions); 
			})
			.then((leads: SalesLead[]) => {	
				fulfill(leads); 
			})
			.catch((err) => {
				reject(err);
				return;
			});
		});
	}
	
	findPerUser(data: SalesLead, newOptions: ModelOptions = {}): Promise<SalesLead[]> {
		return new Promise<SalesLead>((fulfill: Function, reject: Function) => {
			const salesLeadOrgMembOptions: ModelOptions = {
				authorization: newOptions.authorization
			};
			salesLeadOrganizationMemberService.findLeadsPerOrganization(salesLeadOrgMembOptions)
			.then((salesLeads: string[]) => {
				newOptions.additionalData = { _id: { $in: salesLeads }};
				newOptions.requireAuthorization = false;
				return super.find(data, newOptions); 
			})
			.then((leads: SalesLead[]) => {	
				fulfill(leads);
				})
			.catch((err) => {
				reject(err);
				return;
			});
		});
	}

	getStatusAggregationPerContact(contactId: string[]): Promise<SalesLead[]> {
		return new Promise<SalesLead>((fulfill: Function, reject: Function) => {
			const salesContactModelOptions: ModelOptions = {
				requireAuthorization: false,
				copyAuthorizationData: '',
				validatePostSearchAuthData: false,
				distinct: 'lead',
				additionalData: { contact: { $in: contactId } }
			};
			
			salesLeadContactService.findDistinct({}, salesContactModelOptions)
			.then((leads: string[]) => {	
							
				const aggregationCondition = [
					{ $match: { _id: { $in: leads } } },
					{ $group: { _id: '$currentStatus.label' , amount: { $sum: 1 } } }
				];
				
				this.Model.aggregate(aggregationCondition).exec((err, results) => {
					if (err) {
						reject(err);
						return;
					}

					fulfill(results);
					return;
				});
			})
			.catch((err) => {
				reject(err);
				return;
			});
		});
	}
	
	// TO DO: Delete once the customized states are used
	getLeadsPerGroupWithStatus(contactId: string[]): Promise<SalesLead[]> {
		return new Promise<SalesLead>((fulfill: Function, reject: Function) => {
			const salesContactModelOptions: ModelOptions = {
				requireAuthorization: false,
				copyAuthorizationData: '',
				validatePostSearchAuthData: false,
				distinct: 'lead',
			};
			salesLeadContactService.findDistinct({ contact: { $in: contactId }}, salesContactModelOptions)
			.then((leads: string[]) => {				
				const salesLeadModelOptions: ModelOptions = {
					requireAuthorization: false,
					population: {
						path: 'status'
					},
					copyAuthorizationData: '',
					validatePostSearchAuthData: false
				};
				return this.find({ _id: { $in: leads }}, salesLeadModelOptions);
			})
			.then((leads: SalesLead[]) => fulfill(leads))
			.catch((err) => reject(err));
		});
	}
	
	/* tslint:disable */ // In this switches the default is not needed
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'orgMember':
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.organizationMember._id;
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'lead':
				modelOptions.additionalData['_id'] = modelOptions.authorization.leadMember.lead;
				break;
		}
	}
	/* tslint:enable */
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {

			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse('Sales lead: Unauthorized organization member');
			}
			
			if (modelOptions.onlyValidateParentAuthorization) {
				return this.createAuthorizationResponse();
			}

			if (roles.length > 0 && this.isAuthorizedInLead(modelOptions.authorization, roles)) {
				return this.createAuthorizationResponse('Sales lead member: Unauthorized member role');
			}
		}
		return this.createAuthorizationResponse();
	}
	
	private associateOrganizationMembers(data: SalesLead, options: ModelOptions = {}): Promise<SalesLeadOrganizationMember[]> {
		return new Promise<SalesLeadOrganizationMember[]>((fulfill: Function, reject: Function) => {
			
			const roleModelOptions: ModelOptions = {
				authorization: options.authorization,
				additionalData: { code: 'OWNER' },
				distinct: '_id'
			};

			accountMemberRoleService.findDistinct({}, roleModelOptions)
			.then((roles: string[]) => {
				const nextStagePromises: any = [];
				
				const organization: AccountOrganization = ObjectUtil.getBaseDtoObject(options.authorization.organizationMember.organization);
				const accountMemberModelOptions: ModelOptions = {
					authorization: options.authorization,
					additionalData: {
						_id: { $ne: options.authorization.organizationMember._id },
						role: { $in: roles },
						organization: organization._id
					},
					requireAuthorization: false,
					copyAuthorizationData: ''
				};
				
				nextStagePromises.push(accountOrganizationMemberService.find({}, accountMemberModelOptions));
				
				const leadRoleModelOptions: ModelOptions = {
					authorization: options.authorization,
					distinct: '_id',
					additionalData: { code: 'OWNER' }
				};
				nextStagePromises.push(salesLeadMemberRoleService.findDistinct({}, leadRoleModelOptions));
				
				return Promise.all(nextStagePromises);
			})						
			.then((results: any[]) => {
				const members: AccountOrganizationMember[] = results[0];
				const leadRole = results[1];
				const membersToAddPromises: Promise<SalesLeadOrganizationMember>[] = [];
				
				const leadMemberModelOptions: ModelOptions = {
					authorization: options.authorization,
					requireAuthorization: false
				};
				
				const leadOrganizationMemberCreator: SalesLeadOrganizationMember = {
					lead: data,
					member: options.authorization.organizationMember,
					role: leadRole
				};
				membersToAddPromises.push(salesLeadOrganizationMemberService.createOne(leadOrganizationMemberCreator, leadMemberModelOptions));
				
				for (let i = 0; i < members.length; i++) {
					const leadOrganizationMember: SalesLeadOrganizationMember = {
						lead: data,
						member: members[i]._id,
						role: leadRole
					};
					membersToAddPromises.push(salesLeadOrganizationMemberService.createOne(leadOrganizationMember, leadMemberModelOptions));
				}
				return Promise.all(membersToAddPromises);
			})
			.then((results: any) => {
				fulfill(results);
			})
			.catch((err: any) => {
				reject(err);
				return;
			});
		});
	}
	
	private associateContact(data: SalesLead, options: ModelOptions = {}, contact: String): Promise<SalesLeadContact> {
		return new Promise<SalesLeadContact>((fulfill: Function, reject: Function) => {
			const leadContact: SalesLeadContact = {
				lead: data._id,
				contact: contact,
			};
			salesLeadContactService.createOne(leadContact, options)
			.then((createdLeadContact: SalesLeadContact) => { 		
				fulfill(createdLeadContact); 
			})
			.catch((err) => {
				reject(err); 
				return;
			});
		});
	}
}

export const salesLeadService = new SalesLeadService();