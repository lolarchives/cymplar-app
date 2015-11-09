import {provide, Injector} from 'angular2/angular2';
import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
  ResponseOptions, RequestMethods
} from 'angular2/http';
import {TestComponentBuilder, describe, expect, inject, injectAsync, it,
  beforeEachProviders
} from 'angular2/testing';

import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';

import {ObjectUtil} from '../../core/util';
import {Contact} from '../../core/dto';
import {ContactCmp} from './contact';
import {ContactService} from './contact_service';
import {contacts, buildContact} from './contact_mock';


export function main() {

  describe('ContactCmp', () => {

    it('crud should work', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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

  describe('ContactService', () => {

    const contact = contacts[0];

    let injector: Injector;
    let backend: MockBackend;
    let contactService: ContactService;

    beforeEach(() => {
      injector = Injector.resolveAndCreate([
        BaseRequestOptions,
        MockBackend,
        provide(Http, {useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]}),
        provide(ContactService, {useFactory: (http: Http) => {
          return new ContactService(http);
        }, deps: [Http]})
      ]);
      backend = injector.get(MockBackend);
      contactService = injector.get(ContactService);
    });

    afterEach(() => backend.verifyNoPendingRequests());

    it('perform find', (done: Function) => {
      ensureCommunication(backend, RequestMethods.Get, contacts);
      contactService.find().subscribe((resp: Contact[]) => {
        expect(resp).toBe(contacts);
        done();
      });
    });

    it('perform findOneById', (done: Function) => {
      ensureCommunication(backend, RequestMethods.Get, contact);
      contactService.findOneById(contact._id).subscribe((resp: Contact) => {
        expect(resp).toBe(contact);
        done();
      });
    });

    it('perform createOne', (done: Function) => {
      ensureCommunication(backend, RequestMethods.Post, contact);
      contactService.createOne(contact).subscribe((resp: Contact) => {
        expect(resp).toBe(contact);
        done();
      });
    });

    it('perform updateOne', (done: Function) => {
      ensureCommunication(backend, RequestMethods.Put, contact);
      contactService.updateOne(contact).subscribe((resp: Contact) => {
        expect(resp).toBe(contact);
        done();
      });
    });

    it('perform removeOneById', (done: Function) => {
      ensureCommunication(backend, RequestMethods.Delete, contact);
      contactService.removeOneById(contact._id).subscribe((resp: Contact) => {
        expect(resp).toBe(contact);
        done();
      });
    });

  });


  class ContactServiceMock {

    createOne(data: Contact): Rx.Observable<Contact> {
      const contact = buildContact(data);
      contacts.push(contact);
      return Rx.Observable.from([contact]);
    }

    updateOne(data: Contact): Rx.Observable<Contact> {
      return this.findOneById(data._id).map((contact: Contact) => {
        ObjectUtil.merge(contact, data);
        return contact;
      });
    }

    removeOneById(id: string): Rx.Observable<Contact> {
      const index = this._findIndex(id);
      const removed = contacts.splice(index, 1);
      return Rx.Observable.from(removed);
    }

    find(): Rx.Observable<Contact[]> {
      return Rx.Observable.from([contacts]);
    }

    findOneById(id: string): Rx.Observable<Contact> {
      const index = this._findIndex(id);
      const contact = contacts[index];
      return Rx.Observable.from([contact]);
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


  function ensureCommunication (backend: MockBackend, reqMethod: RequestMethods, expectedBody: string | Object) {
    backend.connections.subscribe((c: any) => {
      expect(c.request.method).toBe(reqMethod);
      c.mockRespond(new Response(new ResponseOptions({body: expectedBody})));
    });
  }

}

