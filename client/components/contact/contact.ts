import {Component, Validators, CORE_DIRECTIVES, ViewEncapsulation,
FORM_DIRECTIVES, ControlGroup, Control} from 'angular2/angular2';
import * as Rx from '@reactivex/rxjs/dist/cjs/Rx';

import {validateEmail} from '../../core/util';
import {Contact} from '../../core/dto';
import {ContactService} from './contact_service';
import {Autofocus} from '../../directives/Autofocus';
import {CustomOrderByPipe} from '../../pipes/CustomOrderByPipe';

@Component({
  selector: 'contact',
  templateUrl: './components/contact/contact.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, Autofocus],
  pipes: [CustomOrderByPipe],
  viewProviders: [ContactService]
})
export class ContactCmp {

  form: ControlGroup;
  contacts: Contact[];

  constructor(private contactService: ContactService) {

    this.form = new ControlGroup({
      _id: new Control(null),
      name: new Control(null, Validators.required),
      email: new Control(null, validateEmail)
    });

    this.find();
  }

  saveOne() {

    const data: Contact = this.form.value;

    let obs: Rx.Observable<Contact>;

    if (data._id) {
      obs = this.contactService.updateOne(data);
    } else {
      obs = this.contactService.createOne(data);
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

  selectOne(data: Contact) {
    this.contactService.findOneById(data._id)
      .subscribe((res: Contact) => {
        this.resetForm(res);
      });
  }

  find() {
    this.contactService.find()
      .subscribe((res: Contact[]) => {
        this.contacts = res;
      });
  }

  resetForm(data: Contact = {}) {
    for (let prop in this.form.controls) {
      (<Control>this.form.controls[prop]).updateValue(data[prop]);
    }
  }

}
