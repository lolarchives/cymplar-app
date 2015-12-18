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
  accountOrganizationService.find(req.query, {regularExpresion: false})
    .then((organizations: AccountOrganization[]) => res.send(organizations.length > 0), (err: any) => sendError(res, err));
});

router.get('/:id', (req: express.Request, res: express.Response) => {
  accountOrganizationService.findOneById(req.params.id)
    .then((organization: AccountOrganization) => res.send(organization), (err: any) => sendError(res, err));
});


export = router;

