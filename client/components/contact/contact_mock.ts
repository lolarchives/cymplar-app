import {ObjectUtil} from '../../core/util';
import {Contact} from '../../core/dto';

let seq = 0;

export const contacts: Contact[] = [
  buildContact({ name: 'Michael Jackson', email: 'michael_jackson@example.com' }),
  buildContact({ name: 'Madonna', email: 'madonna@example.com' }),
  buildContact({ name: 'The Beatles', email: 'the_beatles@example.com' }),
  buildContact({ name: 'Adelle', email: 'adelle@example.com' })
]; 

function nextId() {
  return `${++seq}`;
}

export function buildContact(data?: Contact, generateId = true): Contact {
  const contact: Contact = {};  
  contact.createdAt = Date.now();
  ObjectUtil.merge(contact, data);
  if (generateId) {
    contact._id = nextId();
  }
  return contact;
} 
