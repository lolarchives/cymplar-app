import * as express from 'express';

import {sendError, getAuthorizationData} from '../core/web_util';
import {salesLeadMemberRoleService} from './sales_lead_member_role_service';
import {SalesLeadMemberRole, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  salesLeadMemberRoleService.createOne(req.body)
    .then((member: SalesLeadMemberRole) => res.send(member), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  salesLeadMemberRoleService.updateOne(req.body)
    .then((member: SalesLeadMemberRole) => res.send(member), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  salesLeadMemberRoleService.removeOneById(req.params.id)
    .then((member: SalesLeadMemberRole) => res.send(member), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  salesLeadMemberRoleService.find(req.query, modelOptions)
    .then((members: SalesLeadMemberRole[]) => res.send(members), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  salesLeadMemberRoleService.exist(req.query)
    .then((exist: boolean) => res.send({exist: exist}), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  salesLeadMemberRoleService.findOneById(req.params.id)
    .then((member: SalesLeadMemberRole) => res.send(member), (err: any) => sendError(res, err));
});


export = router;

