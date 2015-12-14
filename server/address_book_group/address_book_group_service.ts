import {AddressBookGroup} from '../../client/core/dto';
import {AddressBookGroupModel} from '../core/model';
import {BaseService} from '../core/base_service';
import {addressBookContactService} from '../address_book_contact/address_book_contact_service';

export class AddressBookGroupService extends BaseService<AddressBookGroup> {

	constructor() {
		super(AddressBookGroupModel);
	}
	
	findGroup(data: AddressBookGroup): Promise<AddressBookGroup[]> {

		return new Promise<AddressBookGroup[]>((fulfill: Function, reject: Function) => {

			const populationOpts = [{ path: 'industry', select: 'code description'},
									{ path: 'city', select: 'code description' }];
			
			this.findAndPopulate(data, populationOpts)
				.then((groups: AddressBookGroup[]) => {

				let promises: Promise<AddressBookGroup>[] = [];

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

	removeGroup(data: AddressBookGroup): Promise<AddressBookGroup[]> {
		return this.removeByFilter(data);
	}

	private loadGroup(data: AddressBookGroup): Promise<AddressBookGroup> {

		let groupToSend: AddressBookGroup = data;

		return new Promise<AddressBookGroup>((fulfill: Function, reject: Function) => {

			let toLoad: any = [countryService.findOneById(groupToSend.city.country), 
							   addressBookContactService.findAndPopulate({ group: groupToSend._id }, 'status')];

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

