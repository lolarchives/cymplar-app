import * as express from 'express';

import {sendError} from '../core/web_util';
import {addressBookContactService} from './address_book_contact_service';
import {AddressBookContact} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  addressBookContactService.createOne(req.body)
    .then((contact: AddressBookContact) => res.send(contact), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  addressBookContactService.updateOne(req.body)
    .then((contact: AddressBookContact) => res.send(contact), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  addressBookContactService.removeOneById(req.params.id)
    .then((contact: AddressBookContact) => res.send(contact), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  addressBookContactService.find(req.query)
    .then((contacts: AddressBookContact[]) => res.send(contacts), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  addressBookContactService.findOneById(req.params.id)
    .then((contact: AddressBookContact) => res.send(contact), (err: any) => sendError(res, err));
});


export = router;

