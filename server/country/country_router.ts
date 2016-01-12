import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {countryService} from './country_service';
import {Country, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  countryService.createOne(req.body)
    .then((country: Country) => formatSend(res, country), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  countryService.updateOne(req.body)
    .then((country: Country) => formatSend(res, country), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  countryService.removeOneById(req.params.id)
    .then((country: Country) => formatSend(res, country), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true,
    requireAuthorization: false
  };
  countryService.find(req.query, modelOptions)
    .then((countrys: Country[]) => formatSend(res, countrys), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  countryService.findOneById(req.params.id)
    .then((country: Country) => formatSend(res, country), (err: any) => sendError(res, err));
});


export = router;

