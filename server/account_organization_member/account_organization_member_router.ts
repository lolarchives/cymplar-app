import * as express from 'express';

import {sendError} from '../core/web_util';
import {accountOrganizationMemberService} from './account_organization_member_service';
import {AccountOrganizationMember} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  accountOrganizationMemberService.createOne(req.body)
    .then((member: AccountOrganizationMember) => res.send(member), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  accountOrganizationMemberService.updateOne(req.body)
    .then((member: AccountOrganizationMember) => res.send(member), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  accountOrganizationMemberService.removeOneById(req.params.id)
    .then((member: AccountOrganizationMember) => res.send(member), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  accountOrganizationMemberService.find(req.query)
    .then((members: AccountOrganizationMember[]) => res.send(members), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  accountOrganizationMemberService.find(req.query, {regularExpresion: false})
    .then((members: AccountOrganizationMember[]) => res.send(members.length > 0), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  accountOrganizationMemberService.findOneById(req.params.id)
    .then((member: AccountOrganizationMember) => res.send(member), (err: any) => sendError(res, err));
});


export = router;

