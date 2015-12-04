import {Contact, Group} from '../../client/core/address_book/dto';
import {contactService} from './contact/service';
import {groupService} from './group/service';
import {City, State, Country, Industry, ContactState} from '../../client/core/shared/dto';
import {cityService} from '../shared/city/service'; 
import {stateService} from '../shared/state/service';
import {countryService} from '../shared/country/service'; 
import {industryService} from '../shared/industry/service';
import {contactStateService} from '../shared/contactStatus/service';

export class AddressBookService {

	findGroup(data: Group): Promise<Group[]> {

		return new Promise<Group[]>((fulfill: Function, reject: Function) => {

			groupService.findByFilter(data)
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
				.catch((err) => {
					reject(err);
				});

		});
	}

	removeGroup(data: Group): Promise<any> {

		return new Promise<Group[]>((fulfill: Function, reject: Function) => {

			groupService.removeByFilter(data)
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
				.catch((err) => {
					reject(err);
				});
		});
	}


	findContact(data: Contact): Promise<Contact[]> {

		return new Promise<Contact[]>((fulfill: Function, reject: Function) => {

			contactService.findByFilter(data)
				.then((contacts: Contact[]) => {

				let promises: Promise<Contact>[] = [];

					for (let i = 0; i < contacts.length; i++) {
						promises.push(this.loadContact(contacts[i]));
					}

					return Promise.all(promises);

				})
				.then((results: any) => {
					fulfill(results);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	private findCity(id: string): Promise<City> {

		let cityConst: City = {};

		return new Promise<City>((fulfill: Function, reject: Function) => {

			cityService.findOneById(id)
				.then((city: City) => {
					cityConst = city;

					return stateService.findOneById(cityConst.state);
				})
				.then((state: State) => {
					cityConst.state = state;

					return countryService.findOneById(cityConst.state.country);
				})
				.then((country: Country) => {
					cityConst.state.country = country;

					fulfill(cityConst);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	private loadContact(data: Contact): Promise<Contact> {

		let contactToSend: Contact = data;

		return new Promise<Contact>((fulfill: Function, reject: Function) => {

			let toLoad: any = [contactStateService.findOneById(contactToSend.state)];

			Promise.all(toLoad)
			.then((results: any) => {

				contactToSend.state = results[0];

				fulfill(contactToSend);
			})
			.catch((err: any) => {
				reject(err);
			});
		});
	}

	private loadGroup(data: Group): Promise<Group> {

		let groupToSend: Group = data;

		return new Promise<Group>((fulfill: Function, reject: Function) => {

			let toLoad: any = [industryService.findOneById(groupToSend.industry), 
							this.findCity(groupToSend.city), 
							this.findContact({ group: groupToSend._id })];

			Promise.all(toLoad)
			.then((results: any) => {

				groupToSend.industry = results[0];
				groupToSend.city = results[1];
				groupToSend.contacts = results[2];

				fulfill(groupToSend);
			})
			.catch((err: any) => {
				reject(err);
			});
		});
	}

	private removeGroupDependencies(data: Group): Promise<Group> {

		let groupToSend: Group = data;

		return new Promise<Group>((fulfill: Function, reject: Function) => {

			let toLoad: any = [contactService.removeByFilter({ group: groupToSend._id })];

			Promise.all(toLoad)
			.then((results: any) => {

				fulfill(groupToSend);
			})
			.catch((err: any) => {
				reject(err);
			});
		});
	}
}

export const addressBookService = new AddressBookService();
