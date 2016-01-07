import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {accountMemberRoleService} from './account_member_role_service';
import {AccountMemberRole, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  accountMemberRoleService.createOne(req.body)
    .then((role: AccountMemberRole) => formatSend(res, role), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  accountMemberRoleService.updateOne(req.body)
    .then((role: AccountMemberRole) => formatSend(res, role), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  accountMemberRoleService.removeOneById(req.params.id)
    .then((role: AccountMemberRole) => formatSend(res, role), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  accountMemberRoleService.find(req.query, modelOptions)
    .then((roles: AccountMemberRole[]) => formatSend(res, roles), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  accountMemberRoleService.findOneById(req.params.id)
    .then((role: AccountMemberRole) => formatSend(res, role), (err: any) => sendError(res, err));
});


export = router;

