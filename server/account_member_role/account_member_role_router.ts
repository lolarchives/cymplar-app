import * as express from 'express';

import {sendError} from '../core/web_util';
import {accountMemberRoleService} from './account_member_role_service';
import {AccountMemberRole} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  accountMemberRoleService.createOne(req.body)
    .then((profile: AccountMemberRole) => res.send(profile), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  accountMemberRoleService.updateOne(req.body)
    .then((profile: AccountMemberRole) => res.send(profile), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  accountMemberRoleService.removeOneById(req.params.id)
    .then((profile: AccountMemberRole) => res.send(profile), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  accountMemberRoleService.find(req.query)
    .then((profiles: AccountMemberRole[]) => res.send(profiles), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  accountMemberRoleService.findOneById(req.params.id)
    .then((profile: AccountMemberRole) => res.send(profile), (err: any) => sendError(res, err));
});


export = router;

