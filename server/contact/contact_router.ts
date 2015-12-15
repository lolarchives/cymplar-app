import * as express from 'express';

import {sendError} from '../core/web_util';
import {contactService} from './contact_service';
import {Contact} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  contactService.createOne(req.body)
    .then((contact: Contact) => res.send(contact), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  contactService.updateOne(req.body)
    .then((contact: Contact) => res.send(contact), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  contactService.removeOneById(req.params.id)
    .then((contact: Contact) => res.send(contact), (err) => sendError(res, err));
});

router.get('/', (req: express.Request, res: express.Response) => {
  contactService.find(req.query)
    .then((contacts: Contact[]) => res.send(contacts), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  contactService.findOneById(req.params.id)
    .then((contact: Contact) => res.send(contact), (err: any) => sendError(res, err));
});


export = router;
