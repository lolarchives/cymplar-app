import * as express from 'express';

import {sendError} from '../../core/web_util';
import {contactStatusService} from './service';
import {ContactStatus} from '../../../client/core/shared/dto';

const router = express.Router();

router.post('/', (req, res) => {
  contactStatusService.createOne(req.body)
    .then((contactStatus: ContactStatus) => res.send(contactStatus), (err) => sendError(res, err));
});

router.put('/', (req, res) => {
  contactStatusService.updateOne(req.body)
    .then((contactStatus: ContactStatus) => res.send(contactStatus), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  contactStatusService.removeOneById(req.params.id)
    .then((contactStatus: ContactStatus) => res.send(contactStatus), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  contactStatusService.find()
    .then((contactStatuss: ContactStatus[]) => res.send(contactStatuss), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  contactStatusService.findOneById(req.params.id)
    .then((contactStatus: ContactStatus) => res.send(contactStatus), (err: any) => sendError(res, err));
});


export = router;

