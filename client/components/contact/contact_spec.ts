import {provide, Observable, Injector} from 'angular2/angular2';
import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
  ResponseOptions, RequestMethods
} from 'angular2/http';
import {TestComponentBuilder, describe, expect, inject, injectAsync, it,
  beforeEachProviders
} from 'angular2/testing';

import {ObjectUtil} from '../../core/util';
import {HttpClient} from '../../core/http_client';
import {Contact} from '../../core/dto';
import {ContactCmp} from './contact';
import {ContactService} from './contact_service';
import {contacts, buildContact} from './contact_mock';


export function main() {

  describe('Contact component', () => {

    it('should work', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.overrideViewProviders(ContactCmp, [provide(ContactService, { useClass: ContactServiceMock })])
        .createAsync(ContactCmp).then((fixture) => {

          fixture.detectChanges();

          const contactCmp: ContactCmp = fixture.debugElement.componentInstance;
          const compiled = fixture.debugElement.nativeElement;
          const itemsSelector = 'tbody tr';

          function obtainContactsLenght() {
            return compiled.querySelectorAll(itemsSelector).length;
          }

          const originalLength = obtainContactsLenght();
          let newLength = originalLength;
          expect(originalLength).toBe(contacts.length);
          contactCmp.resetForm({ name: `Some new task #: ${originalLength + 1}` });
          contactCmp.saveOne();

          fixture.detectChanges();

          newLength++;

          expect(obtainContactsLenght()).toBe(newLength);
          const existingContact = ObjectUtil.clone(contacts[0]);
          existingContact.name = `Changed attr ${Date.now() }`;
          contactCmp.resetForm(existingContact);
          contactCmp.saveOne();

          fixture.detectChanges();

          expect(obtainContactsLenght()).toBe(newLength);

          contactCmp.selectOne(existingContact);

          fixture.detectChanges();

          const selectedContact = contactCmp.form.value;

          expect(selectedContact._id).toBe(existingContact._id);
          expect(selectedContact.name).toBe(existingContact.name);

          contactCmp.removeOne(new Event('mock'), existingContact);

          fixture.detectChanges();

          newLength--;

          expect(obtainContactsLenght()).toBe(newLength);
        });
    }));

  });


  class ContactServiceMock {

    createOne(data: Contact): Observable<Contact> {
      const contact = buildContact(data);
      contacts.push(contact);
      return Observable.of(contact);
    }

    updateOne(data: Contact): Observable<Contact> {
      return this.findOneById(data._id).map((contact: Contact) => {
        ObjectUtil.merge(contact, data);
        return contact;
      });
    }

    removeOneById(id: string): Observable<Contact> {
      const index = this._findIndex(id);
      const removed = contacts.splice(index, 1);
      return Observable.of(removed);
    }

    find(): Observable<Contact[]> {
      return Observable.of(contacts);
    }

    findOneById(id: string): Observable<Contact> {
      const index = this._findIndex(id);
      const contact = contacts[index];
      return Observable.of(contact);
    }

    private _findIndex(id: string): number {
      const n = contacts.length;
      for (let i = 0; i < n; i++) {
        const it = contacts[i];
        if (it._id === id) {
          return i;
        }
      }
      return -1;
    }

  }

}

