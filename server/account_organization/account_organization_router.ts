import * as express from 'express';

import {sendError} from '../core/web_util';
import {accountOrganizationService} from './account_organization_service';
import {AccountOrganization} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  accountOrganizationService.createOne(req.body)
    .then((organization: AccountOrganization) => res.send(organization), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  accountOrganizationService.updateOne(req.body)
    .then((organization: AccountOrganization) => res.send(organization), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  accountOrganizationService.removeOneById(req.params.id)
    .then((organization: AccountOrganization) => res.send(organization), (err) => sendError(res, err));
});

router.get('/_find', (req: express.Request, res: express.Response) => {
  accountOrganizationService.find(req.query)
    .then((organizations: AccountOrganization[]) => res.send(organizations), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  accountOrganizationService.exist(req.query)
    .then((exist: boolean) => res.send(exist), (err: any) => sendError(res, err));
});

router.get('/_login', (req, res) => {
  accountOrganizationService.findOne(req.query, {regularExpresion: false, projection: '_id'})
    .then((organization: AccountOrganization) => res.send(organization), (err) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  accountOrganizationService.findOneById(req.params.id)
    .then((organization: AccountOrganization) => res.send(organization), (err: any) => sendError(res, err));
});


export = router;

