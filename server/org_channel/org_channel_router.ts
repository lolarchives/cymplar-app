import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {orgChannelService} from './org_channel_service';
import {OrgChannel, ModelOptions} from '../../client/core/dto';

const router = express.Router();
/*
router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  orgChannelService.createOne(req.body, modelOptions)
    .then((orgChannel: OrgChannel) => formatSend(res, orgChannel), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  req.body._id = req.params.id;
  orgChannelService.updateOne(req.body, modelOptions)
    .then((orgChannel: OrgChannel) => formatSend(res, orgChannel), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  orgChannelService.removeOneById(req.params.id, modelOptions)
    .then((orgChannel: OrgChannel) => formatSend(res, orgChannel), (err) => sendError(res, err));
});
*/
router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  orgChannelService.find(req.query, modelOptions)
    .then((orgChannels: OrgChannel[]) => formatSend(res, orgChannels), (err: any) => sendError(res, err));
});

router.get('/_find_just_added', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  orgChannelService.loadJustAdded(req.query, modelOptions)
    .then((orgChannels: OrgChannel[]) => formatSend(res, orgChannels), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organization'
  };
  orgChannelService.findOne(req.params.id, modelOptions)
    .then((orgChannel: OrgChannel) => formatSend(res, orgChannel), (err: any) => sendError(res, err));
});


export = router;

