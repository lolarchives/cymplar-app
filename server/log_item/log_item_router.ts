import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {logItemService} from './log_item_service';
import {LogItem, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  logItemService.createOne(req.body, modelOptions)
    .then((logItemType: LogItem) => formatSend(res, logItemType), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  req.body._id = req.params.id;
  logItemService.updateOne(req.body, modelOptions)
    .then((logItemType: LogItem) => formatSend(res, logItemType), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  logItemService.removeOneById(req.params.id, modelOptions)
    .then((logItemType: LogItem) => formatSend(res, logItemType), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  logItemService.find(req.query, modelOptions)
    .then((logItemTypes: LogItem[]) => formatSend(res, logItemTypes), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  logItemService.findOne(req.params.id, modelOptions)
    .then((logItemType: LogItem) => formatSend(res, logItemType), (err: any) => sendError(res, err));
});


export = router;

