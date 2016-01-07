import * as express from 'express';

import {sendError, formatSend} from '../core/web_util';
import {salesLeadOrganizationService} from './sales_lead_organization_service';
import {SalesLeadOrganization} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  salesLeadOrganizationService.createOne(req.body)
    .then((member: SalesLeadOrganization) => formatSend(res, member), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  salesLeadOrganizationService.updateOne(req.body)
    .then((member: SalesLeadOrganization) => formatSend(res, member), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  salesLeadOrganizationService.removeOneById(req.params.id)
    .then((member: SalesLeadOrganization) => formatSend(res, member), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  salesLeadOrganizationService.find(req.query)
    .then((members: SalesLeadOrganization[]) => formatSend(res, members), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  salesLeadOrganizationService.exist(req.query)
    .then((exist: boolean) => formatSend(res, {exist: exist}), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  salesLeadOrganizationService.findOneById(req.params.id)
    .then((member: SalesLeadOrganization) => formatSend(res, member), (err: any) => sendError(res, err));
});


export = router;

