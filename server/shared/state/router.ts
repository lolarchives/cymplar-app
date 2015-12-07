import * as express from 'express';

import {sendError} from '../../core/web_util';
import {stateService} from './service';
import {State} from '../../../client/core/shared/dto';

const router = express.Router();

router.post('/', (req, res) => {
  stateService.createOne(req.body)
    .then((state: State) => res.send(state), (err) => sendError(res, err));
});

router.put('/', (req, res) => {
  stateService.updateOne(req.body)
    .then((state: State) => res.send(state), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  stateService.removeOneById(req.params.id)
    .then((state: State) => res.send(state), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  stateService.find()
    .then((states: State[]) => res.send(states), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  stateService.findOneById(req.params.id)
    .then((state: State) => res.send(state), (err: any) => sendError(res, err));
});


export = router;

