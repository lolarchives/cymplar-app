import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {leadChatLogService} from './lead_chat_log_service';
import {LeadChatLog, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  leadChatLogService.createOne(req.body, modelOptions)
    .then((leadChatLogType: LeadChatLog) => formatSend(res, leadChatLogType), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  req.body._id = req.params.id;
  leadChatLogService.updateOne(req.body, modelOptions)
    .then((leadChatLogType: LeadChatLog) => formatSend(res, leadChatLogType), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  leadChatLogService.removeOneById(req.params.id, modelOptions)
    .then((leadChatLogType: LeadChatLog) => formatSend(res, leadChatLogType), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  leadChatLogService.find(req.query, modelOptions)
    .then((leadChatLogTypes: LeadChatLog[]) => formatSend(res, leadChatLogTypes), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'lead'
  };
  leadChatLogService.findOne(req.params.id, modelOptions)
    .then((leadChatLogType: LeadChatLog) => formatSend(res, leadChatLogType), (err: any) => sendError(res, err));
});


export = router;

