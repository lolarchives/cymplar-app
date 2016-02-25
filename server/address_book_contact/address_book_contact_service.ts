import {AddressBookContact, ModelOptions, SalesLeadContact, AddressBookGroup, AuthorizationResponse} from '../../client/core/dto';
import {AddressBookContactModel, StateModel, CountryModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {salesLeadContactService} from '../sales_lead_contact/sales_lead_contact_service';
import {ObjectUtil} from '../../client/core/util';
import {addressBookGroupService} from '../address_book_group/address_book_group_service';
import {salesLeadService} from '../sales_lead/sales_lead_service';

export class AddressBookContactService extends BaseService<AddressBookContact> {

	constructor() {
		const modelOptions: ModelOptions = {
			population: {path: 'group'}
		};
		super(AddressBookContactModel, modelOptions);
	}
	
	createOne(data: AddressBookContact, newOptions: ModelOptions = {}): Promise<AddressBookContact[]> {
		return new Promise<AddressBookContact[]>((resolve: Function, reject: Function) => {

			if (ObjectUtil.isBlank(data.group)) {
				reject(new Error('A group should be specified'));
				return;
			}
				
			const groupModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				population: '',
				additionalData: { _id: data.group },
				validatePostSearchAuthData: false,
				copyAuthorizationData: 'createdBy'
			};

			addressBookGroupService.findOne({}, groupModelOptions)
			.then((group: AddressBookGroup) => {
				if (ObjectUtil.isBlank(group._id)) {
					reject(new Error('A contact cannot be added to a group that does not belong to this user'));
					return;
				}
				return super.createOne(data, newOptions);
			})
			.then((contacts: AddressBookContact[]) => {
				resolve(contacts);
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	findAll(data: AddressBookContact, newOptions: ModelOptions = {}): Promise<AddressBookContact[]> {
		return new Promise<AddressBookContact[]>((resolve: Function, reject: Function) => {
			this.getUsersGroups(data, newOptions)
			.then((idGroups: string[]) => {
				newOptions.additionalData = { group: { $in: idGroups }};
				return super.find(data, newOptions);
			})
			.then((contacts: AddressBookContact[]) => {
				resolve(contacts);
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	getLeadStatusPerContact(data: AddressBookContact, newOptions: ModelOptions = {}): Promise<string[]> {
		return new Promise<string[]>((resolve: Function, reject: Function) => {
			salesLeadService.getStatusAggregationPerContact([data._id])
			.then((contacts: any[]) => {
				resolve(contacts);
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	getLeadStatusPerGroup(data: AddressBookContact, newOptions: ModelOptions = {}): Promise<string[]> {
		return new Promise<string[]>((resolve: Function, reject: Function) => {
			this.getUsersGroups(data, newOptions)
			.then((idGroups: string[]) => {
				newOptions.additionalData = { group: { $in: idGroups }};
				newOptions.distinct = '_id';
				newOptions.copyAuthorizationData = '';
				return this.findDistinct(data, newOptions);
			})
			.then((contacts: string[]) => {
				salesLeadService.getStatusAggregationPerContact(contacts)
				.then((aggregation: any[]) => {
					resolve(aggregation);
				})
				.catch((err) => { 
					reject(err);
					return;
				});
			})
			.catch((err) => { 
				reject(err);
				return;
			});
		});
	}
	
	protected validateAuthDataPostSearchUpdate(modelOptions: ModelOptions = {}, data?: AddressBookContact): AuthorizationResponse {
		if (data.createdBy.toString() !== modelOptions.authorization.user._id.toString()) {
			return this.createAuthorizationResponse('The user cannot perform this action');
		}
		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearchRemove(modelOptions: ModelOptions = {}, data?: AddressBookContact): AuthorizationResponse {
		if (data.createdBy.toString() !== modelOptions.authorization.user._id.toString()) {
			return this.createAuthorizationResponse('The user cannot perform this action');
		}
		return this.createAuthorizationResponse();
	}
	
	protected validateAuthDataPostSearch(modelOptions: ModelOptions = {}, data?: AddressBookContact): AuthorizationResponse {
		if (data.createdBy.toString() !== modelOptions.authorization.user._id.toString()) {
			return this.createAuthorizationResponse('The user cannot perform this action');
		}
		return this.createAuthorizationResponse();
	}

	private getUsersGroups(data: AddressBookContact, newOptions: ModelOptions = {}): Promise<string[]> {
		return new Promise<string[]>((resolve: Function, reject: Function) => {
			const groupModelOptions: ModelOptions = {
				authorization: newOptions.authorization,
				distinct: '_id',
				population: '',
				copyAuthorizationData: 'createdBy'
			};
			
			if (ObjectUtil.isPresent(data.group)) {
				resolve([data.group]);
			} else {
				addressBookGroupService.findDistinct({}, groupModelOptions)
				.then((idGroups: string[]) => {
					resolve(idGroups);
				})
				.catch((err) => { 
					reject(err);
					return;
				});	
			}
		});
	}

}

export const addressBookContactService = new AddressBookContactService();

