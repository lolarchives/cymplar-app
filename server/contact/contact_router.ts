import * as express from 'express';

import {sendError} from '../core/web_util';
import {contactService} from './contact_service';
import {Contact} from '../../client/components/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  contactService.createOne(req.body)
    .then((contact: Contact) => res.send(contact), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  contactService.updateOne(req.body)
    .then((contact: Contact) => res.send(contact), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  contactService.removeOneById(req.params.id)
    .then((contact: Contact) => res.send(contact), (err) => sendError(res, err));
});

router.get('/_find', (req, res) => {
  contactService.find()
    .then((contacts: Contact[]) => res.send(contacts), (err) => sendError(res, err));
});

router.get('/:id', (req, res) => {
  contactService.findOneById(req.params.id)
    .then((contact: Contact) => res.send(contact), (err) => sendError(res, err));
});


export = router;
