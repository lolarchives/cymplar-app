import {Contact, Group} from '../../client/core/address_book/dto';
import {contactService} from './contact/service';
import {groupService} from './group/service';
import {City, State, Country, Industry, ContactStatus} from '../../client/core/shared/dto';
import {cityService} from '../shared/city/service'; 
import {stateService} from '../shared/state/service';
import {countryService} from '../shared/country/service'; 
import {industryService} from '../shared/industry/service';
import {contactStatusService} from '../shared/contactStatus/service';

export class AddressBookService {

	findGroup(data: Group): Promise<Group[]> {

		return new Promise<Group[]>((fulfill: Function, reject: Function) => {

			const populationOpts = [{ path: 'industry', select: 'code description'},
									{ path: 'city', select: 'code description state' }];
			
			groupService.findAndPopulate(data, populationOpts)
				.then((groups: Group[]) => {

				let promises: Promise<Group>[] = [];

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

	removeGroup(data: Group): Promise<Group[]> {
		return groupService.removeByFilter(data);
	}

	private loadGroup(data: Group): Promise<Group> {

		let groupToSend: Group = data;

		return new Promise<Group>((fulfill: Function, reject: Function) => {

			let toLoad: any = [stateService.findOneByIdPopulate(groupToSend.city.state, 'country'), 
							   contactService.findAndPopulate({ group: groupToSend._id }, 'status')];

			Promise.all(toLoad)
			.then((results: any) => {
				groupToSend.city.state = results[0];
				groupToSend.contacts = results[1];

				fulfill(groupToSend);
			})
			.catch((err: any) => {
				reject(err);
			});
		});
	}

}

export const addressBookService = new AddressBookService();