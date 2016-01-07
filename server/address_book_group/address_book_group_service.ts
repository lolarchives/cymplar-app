import {AddressBookGroup, AccountUser, ModelOptions, AuthorizationData} from '../../client/core/dto';
import {AddressBookGroupModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {addressBookContactService} from '../address_book_contact/address_book_contact_service';
import {countryService} from '../country/country_service';
import {ObjectUtil} from '../../client/core/util';

export class AddressBookGroupService extends BaseService<AddressBookGroup> {

	constructor() {
		super(AddressBookGroupModel);
	}
	
	findGroup(data: AddressBookGroup, options: ModelOptions = {}): Promise<AddressBookGroup[]> {

		return new Promise<AddressBookGroup[]>((fulfill: Function, reject: Function) => {			
			this.find(data, options)
			.then((groups: AddressBookGroup[]) => {

				const promises: Promise<AddressBookGroup>[] = [];

				for (let i = 0; i < groups.length; i++) {
					promises.push(this.loadGroup(groups[i]));
				}

				return Promise.all(promises);
			})
			.then((results: any) => {
				fulfill(results);
			})
			.catch((err: any) => {
				reject(err);
			});
		});
	}
	
	copySignificantAuthorizationData(data: AccountUser, modelOptions: ModelOptions = {}): void {
		const authorization = modelOptions.authorization;
		if (ObjectUtil.isPresent(authorization) && ObjectUtil.isPresent(authorization.organizationMember)) {
			data.createdBy = authorization.organizationMember.user;
		}
	}
	
	
	private loadGroup(data: AddressBookGroup): Promise<AddressBookGroup> {

		const groupToSend: AddressBookGroup = data;
		
		return new Promise<AddressBookGroup>((fulfill: Function, reject: Function) => {
			
			const modelOptions: ModelOptions = { requireAuthorization: false };
			const toLoad: any = [countryService.findOneById(groupToSend.city.country, modelOptions), 
							   addressBookContactService.find({ group: groupToSend._id }, modelOptions)];

			Promise.all(toLoad)
			.then((results: any) => {
				groupToSend.city.country = results[0];
				groupToSend.contacts = results[1];

				fulfill(groupToSend);
			})
			.catch((err: any) => {
				reject(err);
			});
		});
	}
}

export const addressBookGroupService = new AddressBookGroupService();
