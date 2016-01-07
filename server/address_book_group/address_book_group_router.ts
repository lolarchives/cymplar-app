import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {addressBookGroupService} from './address_book_group_service';
import {AddressBookGroup, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  addressBookGroupService.createOne(req.body, modelOptions)
    .then((group: AddressBookGroup) => formatSend(res, group), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  addressBookGroupService.updateOne(req.body, modelOptions)
    .then((group: AddressBookGroup) => formatSend(res, group), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    additionalData: {_id: req.params.id}
  };
  addressBookGroupService.removeOneById(req.params.id, modelOptions)
    .then((group: AddressBookGroup) => formatSend(res, group), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    population: [
					{ path: 'industry', select: 'code description' },
					{ path: 'city', select: 'code name country' }
				]
  };
  addressBookGroupService.findGroup(req.query, modelOptions)
    .then((groups: AddressBookGroup[]) => formatSend(res, groups), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  addressBookGroupService.findOneById(req.params.id, modelOptions)
    .then((group: AddressBookGroup) => formatSend(res, group), (err: any) => sendError(res, err));
});


export = router;

