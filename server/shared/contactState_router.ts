import * as express from 'express';

import {sendError} from '../core/web_util';
import {contactStateService} from './contactState_service';
import {ContactState} from '../../client/core/shared/dto';

const router = express.Router();

router.post('/', (req, res) => {
  contactStateService.createOne(req.body)
    .then((contactState: ContactState) => res.send(contactState), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  contactStateService.updateOne(req.body)
    .then((contactState: ContactState) => res.send(contactState), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  contactStateService.removeOneById(req.params.id)
    .then((contactState: ContactState) => res.send(contactState), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  contactStateService.find()
    .then((contactStates: ContactState[]) => res.send(contactStates), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  contactStateService.findOneById(req.params.id)
    .then((contactState: ContactState) => res.send(contactState), (err: any) => sendError(res, err));
});


export = router;

