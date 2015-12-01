import {Contact, Group} from '../../client/core/address_book/dto';
import {contactService} from './contact/contact_service';
import {groupService} from './group/group_service';
import {City, State, Country, Industry, ContactState} from '../../client/core/shared/dto';
import {cityService} from '../shared/city_service'; 
import {stateService} from '../shared/state_service';
import {countryService} from '../shared/country_service'; 
import {industryService} from '../shared/industry_service';
import {contactStateService} from '../shared/contactState_service';

export class AddressBookService {

	findGroup(data: Group): Promise<any> {

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

	private loadGroup(data: Group): Promise<Group> {

		let groupToSend: Group = data;

		return new Promise<Group>((fulfill: Function, reject: Function) => {

			let toLoad: any = [industryService.findOneById(groupToSend.industry), 
							this.findCity(groupToSend.city), 
							contactService.findByFilter({ group: groupToSend._id })];

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
