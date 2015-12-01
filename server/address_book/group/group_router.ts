import * as express from 'express';

import {sendError} from '../../core/web_util';
import {groupService} from './group_service';
import {Group} from '../../../client/core/address_book/dto';

const router = express.Router();

router.post('/', (req, res) => {
  groupService.createOne(req.body)
    .then((group: Group) => res.send(group), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  groupService.updateOne(req.body)
    .then((group: Group) => res.send(group), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  groupService.removeOneById(req.params.id)
    .then((group: Group) => res.send(group), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  groupService.find()
    .then((groups: Group[]) => res.send(groups), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  groupService.findOneById(req.params.id)
    .then((group: Group) => res.send(group), (err: any) => sendError(res, err));
});


export = router;

