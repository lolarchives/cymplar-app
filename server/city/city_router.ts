import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {cityService} from './city_service';
import {City, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  cityService.createOne(req.body)
    .then((city: City) => formatSend(res, city), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  cityService.updateOne(req.body)
    .then((city: City) => formatSend(res, city), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  cityService.removeOneById(req.params.id)
    .then((city: City) => formatSend(res, city), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true,
    requireAuthorization: false 
  };
  cityService.find(req.query, modelOptions)
    .then((citys: City[]) => formatSend(res, citys), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  cityService.findOneById(req.params.id)
    .then((city: City) => formatSend(res, city), (err: any) => sendError(res, err));
});


export = router;

