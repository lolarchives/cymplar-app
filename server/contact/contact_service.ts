import * as mongoose from 'mongoose';

import {ObjectUtil} from '../../client/components/core/util';
import {Contact} from '../../client/components/core/dto';
import {ContactModel} from '../core/model';


export class ContactService {

	createOne(data: Contact): Promise<Contact> {
		const contact = new ContactModel(data);
		return new Promise<Contact>((resolve, reject) => {
			contact.save((err: Error, savedContact: any) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(<Contact> savedContact.toObject());
			});	
		});		
	}

	updateOne(data: Contact): mongoose.Promise<Contact> {
		return ContactModel.findById(data.id).exec().then(foundContact => {
			ObjectUtil.merge(foundContact, data);
			return new Promise<Contact>((resolve, reject) => {
				foundContact.save((err: Error, savedContact: any) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(<Contact> savedContact.toObject());
				});
			});			
		});
	}

	removeOneById(id: string): mongoose.Promise<Contact> {
		return ContactModel.findById(id).exec().then((foundContact: any) => {
			return new Promise<Contact>((resolve, reject) => {
				foundContact.remove((err: Error) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(<Contact> foundContact.toObject());
				});
			});	
		});
	}

	find(): mongoose.Promise<Contact[]> {		
		return ContactModel.find({}, null, {lean: true}).exec();
	}

	findOneById(id: string): mongoose.Promise<Contact> {
		return ContactModel.findById(id, null, {lean: true}).exec();
	}

}


export const contactService = new ContactService();
