import * as express from 'express';

import {sendError} from '../core/web_util';
import {addressBookService} from './address_book_service';
import {Group} from '../../client/core/address_book/dto';

const router = express.Router();

router.get('/group', (req: express.Request, res: express.Response) => {
  addressBookService.findGroup(req.query)
    .then((group: Group[]) => res.send(group), (err: any) => sendError(res, err));
});

router.delete('/group/:id', (req, res) => {
  addressBookService.removeGroup(req.params.id)
    .then((group: Group[]) => res.send(group), (err) => sendError(res, err));
});

export = router;

