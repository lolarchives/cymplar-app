import {SalesLead, SalesLeadContact, SalesLeadOrganizationMember, AccountOrganizationMember, ModelOptions,
	AuthorizationResponse, AddressBookContact} from '../../client/core/dto';
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
				
				if (ObjectUtil.isPresent(data.contacts)) {
					return this.associateContacts(createdSalesLead, leadContactCreationModelOptions, data.contacts);	
				} else {
					return {};
				}
			})
			.then((contacts: AddressBookContact[]) => {	
				
				if (ObjectUtil.isPresent(contacts)) {
					createdSalesLead['contacts'] = contacts;	
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
	
	updateOneContacts(data: SalesLead, newOptions: ModelOptions = {}): Promise<SalesLead> {	
		return new Promise<SalesLead>((resolve: Function, reject: Function) => {
			const updateContactsModelOptions = ObjectUtil.clone(newOptions);
			this.updateOne(data, updateContactsModelOptions)
			.then((salesLead: SalesLead) => {
				if (ObjectUtil.isPresent(data.contacts)) {
					return this.multipleContactUpdate(salesLead, newOptions, data.contacts);
				} else {
					return Promise.resolve(this.loadContacts(salesLead, newOptions));
				}
			})
			.then((salesLeadMultiple: SalesLead) => {
				resolve(salesLeadMultiple);
			})
			.catch((err: Error) => {
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
				distinct: 'lead'
			};
			
			salesLeadContactService.findDistinct({ contact: { $in: contactId }}, salesContactModelOptions)
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
	
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'orgMember':
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.organizationMember._id;
				break;
			default:
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'lead':
				try {
					modelOptions.additionalData['_id'] = modelOptions.authorization.leadMember.lead;
				} catch (error) {
					throw new Error('There is no lead specified, the search could not be executed');
				}
				break;
			default:
				break;
		}
	}
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {

			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse('Sales lead: Unauthorized organization member');
			}
			
			if (modelOptions.onlyValidateParentAuthorization) {
				return this.createAuthorizationResponse();
			}

			if (roles.length > 0 && roles.indexOf(modelOptions.authorization.organizationMember.role.code) < 0) {
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
				
				const accountMemberModelOptions: ModelOptions = {
					authorization: options.authorization,
					additionalData: {
						_id: { $ne: options.authorization.organizationMember._id },
						role: { $in: roles },
						organization: options.authorization.organizationMember.organization
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
				const promises: Promise<SalesLeadOrganizationMember>[] = [];
				
				const leadMemberModelOptions: ModelOptions = {
					authorization: options.authorization,
					requireAuthorization: false
				};
				
				const leadOrganizationMemberCreator: SalesLeadOrganizationMember = {
					lead: data,
					member: options.authorization.organizationMember,
					role: leadRole
				};
				promises.push(salesLeadOrganizationMemberService.createOne(leadOrganizationMemberCreator, leadMemberModelOptions));
				
				for (let i = 0; i < members.length; i++) {
					const leadOrganizationMember: SalesLeadOrganizationMember = {
						lead: data,
						member: members[i]._id,
						role: leadRole
					};
					promises.push(salesLeadOrganizationMemberService.createOne(leadOrganizationMember, leadMemberModelOptions));
				}
				return Promise.all(promises);
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
	
	private loadContacts(data: SalesLead, options: ModelOptions = {}): Promise<SalesLead> {
		return new Promise<SalesLead>((fulfill: Function, reject: Function) => {
			const loadContactsModelOptions: ModelOptions = {
				authorization: options.authorization
			};
			salesLeadContactService.findCurrentLeadContacts({}, loadContactsModelOptions)
			.then((leadContacts: AddressBookContact[]) => {
				data['contacts'] = leadContacts;
				fulfill(data); 
			})
			.catch((err: Error) => reject(err));
		});
	}
	
	private multipleContactUpdate(data: SalesLead, options: ModelOptions = {}, contacts: string[]): Promise<SalesLead> {
		return new Promise<SalesLead>((fulfill: Function, reject: Function) => {		
			this.loadContacts(data, options)
			.then((salesLead: SalesLead) => {
				const toDelete: AddressBookContact[] = [];
				const existent: AddressBookContact[] = [];
				
				for (let i = 0; i < salesLead.contacts.length; i++){
					const currentContact: AddressBookContact = salesLead.contacts[i];
					const positionInContacts = contacts.indexOf(currentContact._id.toString());
					
					if ( positionInContacts < 0) {
						toDelete.push(ObjectUtil.clone(currentContact));
					} else { 
						existent.push(ObjectUtil.clone(currentContact));
						contacts.splice(positionInContacts, 1);
					}
				} 	
						
				const contactsManagementPromises: Promise<AddressBookContact>[] = [];
				contactsManagementPromises.push(Promise.resolve(existent));
				contactsManagementPromises.push(this.associateContacts(data, options, contacts));
				contactsManagementPromises.push(this.disassociateContacts(data, options, toDelete)); 
				return Promise.all(contactsManagementPromises);
			})
			.then((updateContactsResults: any) => { 
				const currentContacts = updateContactsResults[0].concat(updateContactsResults[1]);
				data['contacts'] = currentContacts;
				fulfill(data); 
			})
			.catch((err: Error) => reject(err));
		});
	}
	
	private associateContacts(data: SalesLead, options: ModelOptions = {}, contacts: string[]): Promise<AddressBookContact[]> {
		return new Promise<AddressBookContact[]>((fulfill: Function, reject: Function) => {
			const createContactsPromises: Promise<AddressBookContact>[] = [];	
			for (let i = 0; i < contacts.length; i++)	{
				const leadContact: SalesLeadContact = {
					lead: data._id,
					contact: contacts[i]
				};
				createContactsPromises.push(salesLeadContactService.createOneSimpleContact(leadContact, options));
			}
				
			Promise.all(createContactsPromises)
			.then((createdLeadContacts: AddressBookContact[]) => { 		
				fulfill(createdLeadContacts); 
			})
			.catch((err: Error) => reject(err));
		});
	}
	
	private disassociateContacts(data: SalesLead, options: ModelOptions = {}, contacts: AddressBookContact[]): Promise<SalesLeadContact[]> {
		return new Promise<SalesLeadContact[]>((fulfill: Function, reject: Function) => {
			const deleteContactsPromises: Promise<AddressBookContact>[] = [];
			const leadContactModelOptions: ModelOptions = {
				authorization: options.authorization,
				additionalData: {
					lead: data._id
				},
				requireAuthorization: true,
				copyAuthorizationData: ''
			};
			for (let i = 0; i < contacts.length; i++)	{
				deleteContactsPromises.push(salesLeadContactService.removeOneSimpleContact({contact: contacts[i]._id}, leadContactModelOptions));
			}
				
			Promise.all(deleteContactsPromises)
			.then((deletedLeadContacts: AddressBookContact[]) => { 		
				fulfill(deletedLeadContacts); 
			})
			.catch((err: Error) => reject(err));
		});
	}
}

export const salesLeadService = new SalesLeadService();