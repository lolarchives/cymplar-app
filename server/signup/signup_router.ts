import * as express from 'express';

import {sendError, formatSend} from '../core/web_util';
import {signupService} from './signup_service';
import {AuthenticationResponse, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    requireAuthorization: false 
  };
  signupService.createOne(req.body, modelOptions)
    .then((authentication: AuthenticationResponse) => formatSend(res, authentication), (err) => sendError(res, err));
});


export = router;

