import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {salesLeadOrganizationMemberService} from './sales_lead_organization_member_service';
import {SalesLeadOrganizationMember, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
   const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: 'createdBy'
  };
  salesLeadOrganizationMemberService.createOne(req.body, modelOptions)
    .then((member: SalesLeadOrganizationMember) => formatSend(res, member), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: ''
  };
  req.body._id = req.params.id;
  salesLeadOrganizationMemberService.updateOne(req.body, modelOptions)
    .then((member: SalesLeadOrganizationMember) => formatSend(res, member), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: '',
    population: [
      {	path: 'role' },
      {   path: 'member',
          populate: {
            path: 'role',
            model: 'accountMemberRole'
          } 
      }
    ]
  };
  salesLeadOrganizationMemberService.removeOneByIdWithValidation(req.params.id, modelOptions)
    .then((member: SalesLeadOrganizationMember) => formatSend(res, member), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  salesLeadOrganizationMemberService.findCurrentLeadMembersPopulated(req.query, modelOptions)
    .then((members: SalesLeadOrganizationMember[]) => formatSend(res, members), (err: any) => sendError(res, err));
});

router.get('/_find_to_add', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  salesLeadOrganizationMemberService.findMembersToAddPerLead(req.query, modelOptions)
    .then((members: SalesLeadOrganizationMember[]) => formatSend(res, members), (err: any) => sendError(res, err));
});

router.get('/_find_all', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: '',
    requireAuthorization: false,
    validatePostSearchAuthData: false
  };
  salesLeadOrganizationMemberService.find({}, modelOptions)
    .then((members: SalesLeadOrganizationMember[]) => formatSend(res, members), (err: any) => sendError(res, err));
});

router.get('/_find_membership', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  salesLeadOrganizationMemberService.returnCurrentLeadMember(modelOptions)
    .then((member: SalesLeadOrganizationMember) => formatSend(res, member), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req)
  };
  salesLeadOrganizationMemberService.exist(req.query)
    .then((exist: boolean) => formatSend(res, {exist: exist}), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    copyAuthorizationData: ''
  };
  salesLeadOrganizationMemberService.findOneById(req.params.id, modelOptions)
    .then((member: SalesLeadOrganizationMember) => formatSend(res, member), (err: any) => sendError(res, err));
});


export = router;

