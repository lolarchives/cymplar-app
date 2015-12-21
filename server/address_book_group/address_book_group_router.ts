import * as express from 'express';

import {sendError} from '../core/web_util';
import {addressBookGroupService} from './address_book_group_service';
import {AddressBookGroup} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  req.body.owner = req.body.tempCymplar.sub;
  addressBookGroupService.createOne(req.body)
    .then((group: AddressBookGroup) => res.send(group), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  req.body.owner = req.body.tempCymplar.sub;
  addressBookGroupService.updateOne(req.body)
    .then((group: AddressBookGroup) => res.send(group), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  addressBookGroupService.removeOneById(req.params.id)
    .then((group: AddressBookGroup) => res.send(group), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  req.body.owner = req.body.tempCymplar.sub;
  addressBookGroupService.findGroup(req.query)
    .then((groups: AddressBookGroup[]) => res.send(groups), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  addressBookGroupService.findOneById(req.params.id)
    .then((group: AddressBookGroup) => res.send(group), (err: any) => sendError(res, err));
});


export = router;

