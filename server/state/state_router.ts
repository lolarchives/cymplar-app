import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {stateService} from './state_service';
import {State, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  stateService.createOne(req.body)
    .then((state: State) => formatSend(res, state), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  stateService.updateOne(req.body)
    .then((state: State) => formatSend(res, state), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  stateService.removeOneById(req.params.id)
    .then((state: State) => formatSend(res, state), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true,
    requireAuthorization: false
  };
  stateService.find(req.query, modelOptions)
    .then((states: State[]) => formatSend(res, states), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  stateService.findOneById(req.params.id)
    .then((state: State) => formatSend(res, state), (err: any) => sendError(res, err));
});


export = router;

