import {SalesLeadContact, ModelOptions, AuthorizationResponse, AddressBookContact} from '../../client/core/dto';
import {SalesLeadContactModel, AddressBookContactModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {addressBookContactService} from '../address_book_contact/address_book_contact_service';

export class SalesLeadContactService extends BaseService<SalesLeadContact> {

	constructor() {
		const defaultModelOptions: ModelOptions = {
			population: [
				{ 
					path: 'contact',
					populate: {
						path: 'group',
						model: 'addressBookGroup'
					}
				}
			]
		};
		super(SalesLeadContactModel, defaultModelOptions);
	}

	createOneSimpleContact(data: SalesLeadContact, newOptions: ModelOptions = {}): Promise<AddressBookContact> {
		return new Promise<AddressBookContact>((resolve: Function, reject: Function) => {
			this.createOne(data, newOptions)
			.then((contact: SalesLeadContact) => {
				resolve(contact.contact);
			})
			.catch((err) => { 
				return reject(err);
			});
		});
	}
	
	removeOneSimpleContact(data: SalesLeadContact, newOptions: ModelOptions = {}): Promise<AddressBookContact> {
		return new Promise<AddressBookContact>((resolve: Function, reject: Function) => {
			this.removeOne(data, newOptions)
			.then((contact: SalesLeadContact) => {
				resolve(contact.contact);
			})
			.catch((err) => { 
				return reject(err);
			});
		});
	}
	
	//Returns the contacts that are part of the lead
	findContactsPerLead(newOptions: ModelOptions = {}): Promise<string[]> {
		return new Promise<string[]>((resolve: Function, reject: Function) => {
			const salesLeadModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				population: {
					path: 'contact -_id'
				},
				distinct: 'contact',
				copyAuthorizationData: 'lead'
			};
		
			this.findDistinct({}, salesLeadModelOptions)
			.then((contacts: string[]) => {
				resolve(contacts);
			})
			.catch((err) => reject(err));
		});
	}
	
	findCurrentLeadContacts(data: AddressBookContact, newOptions: ModelOptions = {}): Promise<AddressBookContact[]> {
		return new Promise<AddressBookContact[]>((resolve: Function, reject: Function) => {
			this.findContactsPerLead(newOptions)
			.then((leadContacts: string[]) => {		
				newOptions.additionalData = {
					_id: { $in: leadContacts }
				};
				newOptions.copyAuthorizationData = '';
				
				return addressBookContactService.find(data, newOptions);
			})
			.then((leadContacts: AddressBookContact[]) => {
				resolve(leadContacts);
			})
			.catch((err) => reject(err));
		});
	}
	
	findContactsToAddPerLead(data: AddressBookContact, newOptions: ModelOptions = {}): Promise<AddressBookContact[]> {
		return new Promise<AddressBookContact[]>((resolve: Function, reject: Function) => {
			const salesLeadModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				population: 'contact',
				projection: 'contact -_id',
				copyAuthorizationData: 'lead'
			};
		
			this.find({}, salesLeadModelOptions)
			.then((leadContacts: AddressBookContact[]) => {
				
				if (leadContacts.length > 0) {
					const groups: string[] = [];
					const contacts: string[] = [];
					
					for (let i = 0; i < leadContacts.length; i++ ) {
						const current = leadContacts[i]['contact'];
						contacts.push(current._id);
						if (groups.indexOf(current['group']) < 0) {
							groups.push(current['group']);
						}
					}
					
					newOptions.additionalData = {};
					
					if (contacts.length > 0) {
						newOptions.additionalData['_id']  = { $nin: contacts };
					}
					
					if (groups.length > 0) {
						newOptions.additionalData['group']  = { $in: groups };
					}
				}
				
				newOptions.copyAuthorizationData = 'createdBy';
				return addressBookContactService.find(data, newOptions);
			})
			.then((leadContacts: AddressBookContact[]) => {
				resolve(leadContacts);
			})
			.catch((err: Error) => reject(err));
		});
	}
	
	/* tslint:disable */ // In this switches the default is not needed
	protected addAuthorizationDataInCreate(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'lead':
				modelOptions.additionalData['lead'] = modelOptions.authorization.leadMember.lead;
				modelOptions.additionalData['createdBy'] = modelOptions.authorization.leadMember._id;
				break;
		}
	}
	
	protected addAuthorizationDataPreSearch(modelOptions: ModelOptions = {}) {
		switch (modelOptions.copyAuthorizationData) {
			case 'lead':
				modelOptions.additionalData['lead'] = modelOptions.authorization.leadMember.lead;
				break;
		}
	}
	/* tslint:enable */
	
	protected authorizationEntity(modelOptions: ModelOptions = {}, roles: string[] = []): AuthorizationResponse {
		if (modelOptions.requireAuthorization) {
			
			if (!this.existsOrganizationMember(modelOptions.authorization)) {
				return this.createAuthorizationResponse('Sales lead: Unauthorized organization contact');
			}
			
			if (modelOptions.onlyValidateParentAuthorization) {
				return this.createAuthorizationResponse();
			}

			if (roles.length > 0 && !this.isAuthorizedInLead(modelOptions.authorization, roles)) {
				return this.createAuthorizationResponse('Sales lead contact: Unauthorized contact role');
			}
		}

		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, 
		data?: SalesLeadContact): AuthorizationResponse {
		const isLeadMember =  modelOptions.authorization.leadMember.lead === data.lead;
		if (isLeadMember) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document update');
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, 
		data?: SalesLeadContact): AuthorizationResponse {
		const authRoles = ['OWNER'];
		const isOrgOwner = this.isAuthorizedInOrg(modelOptions.authorization, authRoles);
		const isLeadMember =  modelOptions.authorization.leadMember.lead === data.lead;
		if (isOrgOwner || isLeadMember) {
			return this.createAuthorizationResponse();
		}
		return this.createAuthorizationResponse('Unauthorized document remove');
	}
}

export const salesLeadContactService = new SalesLeadContactService();

