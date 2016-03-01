import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {addressBookContactService} from './address_book_contact_service';
import {AddressBookContact, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'createdBy'
  };
  addressBookContactService.createOne(req.body, modelOptions)
    .then((contact: AddressBookContact) => formatSend(res, contact), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  req.body._id = req.params.id;
  addressBookContactService.updateOne(req.body, modelOptions)
    .then((contact: AddressBookContact) => formatSend(res, contact), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  addressBookContactService.removeOneById(req.params.id, modelOptions)
    .then((contact: AddressBookContact) => formatSend(res, contact), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'createdBy'
  };
  addressBookContactService.findAll(req.query, modelOptions)
    .then((contacts: AddressBookContact[]) => formatSend(res, contacts), (err: any) => sendError(res, err));
});

router.get('/_find_lead_status', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  addressBookContactService.getLeadStatusPerContact(req.query, modelOptions)
    .then((contacts: AddressBookContact[]) => formatSend(res, contacts), (err: any) => sendError(res, err));
});

router.get('/_find_lead_status_group', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  addressBookContactService.getLeadPerGroupOldStatus(req.query, modelOptions)
    .then((contacts: AddressBookContact[]) => formatSend(res, contacts), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  addressBookContactService.findOneById(req.params.id, modelOptions)
    .then((contact: AddressBookContact) => formatSend(res, contact), (err: any) => sendError(res, err));
});


export = router;

