import {COMMON_DIRECTIVES, COMMON_PIPES, Component, Validators,
ControlGroup, Control, Observable} from 'angular2/angular2';
import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';

import {validateEmail} from '../../core/web_util';
import {Contact} from '../../core/dto';
import {ContactService} from './contact_service';
import {Autofocus} from '../../directives/Autofocus';

@Component({
  selector: 'contact',
  templateUrl: './components/contact/contact.html',
  directives: [COMMON_DIRECTIVES, Autofocus],
  pipes: [COMMON_PIPES],
  viewProviders: [ContactService]
})
export class ContactCmp {

  form: ControlGroup;
  contacts: Contact[];
  contact: Contact = {};

  constructor(private contactService: ContactService) {

    this.form = new ControlGroup({
      _id: new Control(''),
      name: new Control('', Validators.required),
      email: new Control('', validateEmail)
    });

    this.find();
  }

  saveOne() {

    let obs: Observable<Contact>;

    if (this.contact._id) {
      obs = this.contactService.updateOne(this.contact);
    } else {
      obs = this.contactService.createOne(this.contact);
    }

    obs.subscribe((res: Contact) => {
      this.resetForm();
      this.find();
    });
  }

  removeOne(event: Event, data: Contact) {

    event.stopPropagation();

    this.contactService.removeOneById(data._id)
      .subscribe((res: Contact) => {
        this.resetForm();
        this.find();
      });
  }

  selectOne(id: string) {
    this.contactService.findOneById(id)
      .subscribe((res: Contact) => {
        this.resetForm(res);
      });
  }

  find() {
    this.contactService.find().subscribe((res: Contact[]) => {
      this.contacts = res;
    });
  }

  resetForm(data: Contact = {}) {
    this.contact = data;
  }

}
