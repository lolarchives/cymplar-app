import {ObjectUtil} from '../../core/util';
import {Contact} from '../../core/dto';

let seq = 0;

export const contacts: Contact[] = [
  buildContact({ name: 'Michael Jackson' }),
  buildContact({ name: 'Madonna' }),
  buildContact({ name: 'The Beatles' }),
  buildContact({ name: 'Adelle' })
]; 

function nextId() {
  return `${++seq}`;
}

export function buildContact(data?: Contact, generateId = true): Contact {
  const contact: Contact = {};  
  contact.createdAt = new Date();
  ObjectUtil.merge(contact, data);
  if (generateId) {
    contact._id = nextId();
  }
  return contact;
} 
