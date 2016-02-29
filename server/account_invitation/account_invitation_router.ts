import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {accountInvitationService} from './account_invitation_service';
import {AccountInvitation, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'organizationMember'
  };
  accountInvitationService.createOne(req.body, modelOptions)
    .then((accountInvitation: AccountInvitation) => formatSend(res, accountInvitation), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
   const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
  };
  req.body._id = req.params.id;
  accountInvitationService.updateOne(req.body, modelOptions)
    .then((accountInvitation: AccountInvitation) => formatSend(res, accountInvitation), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountInvitationService.removeOneById(req.params.id, modelOptions)
    .then((accountInvitation: AccountInvitation) => formatSend(res, accountInvitation), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountInvitationService.find(req.query, modelOptions)
    .then((accountInvitations: AccountInvitation[]) => formatSend(res, accountInvitations), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountInvitationService.findOneById(req.params.id, modelOptions)
    .then((accountInvitation: AccountInvitation) => formatSend(res, accountInvitation), (err: any) => sendError(res, err));
});


export = router;

