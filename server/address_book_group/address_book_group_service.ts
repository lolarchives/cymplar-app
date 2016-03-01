
import {AddressBookGroup, AddressBookContact, AccountUser, ModelOptions, AuthorizationData,
	AuthorizationResponse} from '../../client/core/dto';
import {AddressBookGroupModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {addressBookContactService} from '../address_book_contact/address_book_contact_service';
import {ObjectUtil} from '../../client/core/util';
import {salesLeadContactService} from '../sales_lead_contact/sales_lead_contact_service';


export class AddressBookGroupService extends BaseService<AddressBookGroup> {

	constructor() {
		const modelOptions: ModelOptions = {
			population: [
				{	path: 'industry', select: 'code description' },
				{
					path: 'city',
					populate: {
						path: 'state', 
						model: 'state',
						populate: {
							path: 'country', 
							model: 'country'
						}
					}
				}
			]
		};
		super(AddressBookGroupModel, modelOptions);
	}
	
	findGroupContacts(data: AddressBookGroup, options: ModelOptions = {}): Promise<AddressBookGroup[]> {
		return new Promise<AddressBookGroup[]>((fulfill: Function, reject: Function) => {
			this.find(data, options)		
			.then((groups: AddressBookGroup[]) => {
				
				const childrenModelOptions: ModelOptions = {
					authorization: options.authorization,
					copyAuthorizationData: 'createdBy'
				};
				const loadDataFromGroupPromises: Promise<AddressBookGroup>[] = [];
				for (let i = 0; i < groups.length; i++) {
					loadDataFromGroupPromises.push(this.loadGroup(groups[i], childrenModelOptions));
				}
				
				return Promise.all(loadDataFromGroupPromises);	
			})
			.then((results: any) => fulfill(results))
			.catch((err) => reject(err));
		});
	}
	
	private loadGroup(data: AddressBookGroup,  childrenModelOptions: ModelOptions = {}): Promise<AddressBookGroup> {
		const groupToSend: AddressBookGroup = data;
		return new Promise<AddressBookGroup>((fulfill: Function, reject: Function) => {
			const toLoad: any = [addressBookContactService.find({ group: groupToSend._id }, childrenModelOptions)];
			Promise.all(toLoad)
			.then((results: any) => {
				groupToSend.contacts = results[0];
				fulfill(groupToSend);
			})
			.catch((err) => reject(err));
		});
	}
	
}

export const addressBookGroupService = new AddressBookGroupService();
