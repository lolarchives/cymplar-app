import {Contact} from '../../client/core/dto';
import {ContactModel} from '../core/model';


export class ContactService {

	createOne(data: Contact): Promise<Contact> {
		delete data._id;
		const contact = new ContactModel(data);
		return new Promise<Contact>((resolve: Function, reject: Function) => {
			contact.save((err: Error, savedContact: any) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(<Contact> savedContact.toObject());
			});	
		});		
	}

	updateOne(data: Contact): Promise<Contact> {
		return new Promise<Contact>((resolve: Function, reject: Function) => {
			ContactModel.findById(data._id, (err: Error, foundContact: any) => {
				if (err) {
					reject(err);
					return;
				}
				for (let prop in data) {
					foundContact[prop] = data[prop];
				}
				foundContact.save((err: Error, savedContact: any) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(<Contact>savedContact.toObject());
				});
			});
		});
	}

	removeOneById(id: string): Promise<Contact> {
		return new Promise<Contact>((resolve: Function, reject: Function) => {
			ContactModel.findById(id, (err, foundContact) => {
				if (err) {
					reject(err);
					return;
				}
				foundContact.remove((err: Error) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(foundContact.toObject());
				});
			});
		});
	}

	find(): Promise<Contact[]> {
		return new Promise<Contact>((resolve: Function, reject: Function) => {
			ContactModel.find({}, null, { lean: true }, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(res);
			});
		});
	}

	findOneById(id: string): Promise<Contact> {
		return new Promise<Contact>((resolve: Function, reject: Function) => {
			ContactModel.findById(id, null, { lean: true }, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(res);
			});
		});
	}

}


export const contactService = new ContactService();
