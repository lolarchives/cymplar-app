import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {logItemTypeService} from './log_item_type_service';
import {LogItemType, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  logItemTypeService.createOne(req.body, modelOptions)
    .then((logItemType: LogItemType) => formatSend(res, logItemType), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  req.body._id = req.params.id;
  logItemTypeService.updateOne(req.body, modelOptions)
    .then((logItemType: LogItemType) => formatSend(res, logItemType), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  logItemTypeService.removeOneById(req.params._id, modelOptions)
    .then((logItemType: LogItemType) => formatSend(res, logItemType), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  logItemTypeService.find(req.query, modelOptions)
    .then((logItemTypes: LogItemType[]) => formatSend(res, logItemTypes), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  logItemTypeService.findOneById(req.params.id, modelOptions)
    .then((logItemType: LogItemType) => formatSend(res, logItemType), (err: any) => sendError(res, err));
});


export = router;

