import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {orgChatLogService} from './org_chat_log_service';
import {OrgChatLog, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  orgChatLogService.createOne(req.body, modelOptions)
    .then((orgChatLogType: OrgChatLog) => formatSend(res, orgChatLogType), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  req.body._id = req.params.id;
  orgChatLogService.updateOne(req.body, modelOptions)
    .then((orgChatLogType: OrgChatLog) => formatSend(res, orgChatLogType), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  orgChatLogService.removeOneById(req.params.id, modelOptions)
    .then((orgChatLogType: OrgChatLog) => formatSend(res, orgChatLogType), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  orgChatLogService.find(req.query, modelOptions)
    .then((orgChatLogTypes: OrgChatLog[]) => formatSend(res, orgChatLogTypes), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  orgChatLogService.findOne(req.params.id, modelOptions)
    .then((orgChatLogType: OrgChatLog) => formatSend(res, orgChatLogType), (err: any) => sendError(res, err));
});


export = router;

