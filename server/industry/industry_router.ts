import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {industryService} from './industry_service';
import {Industry, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  industryService.createOne(req.body)
    .then((industry: Industry) => formatSend(res, industry), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  industryService.updateOne(req.body)
    .then((industry: Industry) => formatSend(res, industry), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  industryService.removeOneById(req.params.id)
    .then((industry: Industry) => formatSend(res, industry), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    regularExpresion: true,
    requireAuthorization: false
  };
  industryService.find(req.query, modelOptions)
    .then((industries: Industry[]) => formatSend(res, industries), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  industryService.findOneById(req.params.id)
    .then((industry: Industry) => formatSend(res, industry), (err: any) => sendError(res, err));
});


export = router;

