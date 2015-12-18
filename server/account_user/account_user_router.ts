import * as express from 'express';

import {sendError} from '../core/web_util';
import {accountUserService} from './account_user_service';
import {AccountUser} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  accountUserService.createOne(req.body)
    .then((user: AccountUser) => res.send(user), (err) => sendError(res, err));
});

router.put('/:id', (req, res) => {
  req.body._id = req.params.id;
  accountUserService.updateOne(req.body)
    .then((user: AccountUser) => res.send(user), (err) => sendError(res, err));
});

router.delete('/:id', (req, res) => {
  accountUserService.removeOneById(req.params.id)
    .then((user: AccountUser) => res.send(user), (err) => sendError(res, err));
});

router.get('/_find', (req, res) => {
  accountUserService.find(req.query)
    .then((users: AccountUser[]) => res.send(users), (err: any) => sendError(res, err));
});

router.get('/_exist', (req, res) => {
  accountUserService.find(req.query, {regularExpresion: false})
    .then((users: AccountUser[]) => res.send(users.length > 0), (err: any) => sendError(res, err));
});

router.get('/:id', (req, res) => {
  accountUserService.findOneById(req.params.id)
    .then((user: AccountUser) => res.send(user), (err: any) => sendError(res, err));
});


export = router;

