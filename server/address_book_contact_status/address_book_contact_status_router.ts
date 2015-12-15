import * as express from 'express';

import {sendError} from '../core/web_util';
import {addressBookContactStatusService} from './address_book_contact_status_service';
import {AddressBookContactStatus} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  addressBookContactStatusService.createOne(req.body)
    .then((contactStatus: AddressBookContactStatus) => res.send(contactStatus), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  addressBookContactStatusService.updateOne(req.body)
    .then((contactStatus: AddressBookContactStatus) => res.send(contactStatus), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  addressBookContactStatusService.removeOneById(req.params.id)
    .then((contactStatus: AddressBookContactStatus) => res.send(contactStatus), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  addressBookContactStatusService.find(req.query)
    .then((contactStatuss: AddressBookContactStatus[]) => res.send(contactStatuss), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  addressBookContactStatusService.findOneById(req.params.id)
    .then((contactStatus: AddressBookContactStatus) => res.send(contactStatus), (err: any) => sendError(res, err));
});


export = router;

