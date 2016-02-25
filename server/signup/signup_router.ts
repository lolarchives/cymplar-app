import * as express from 'express';

import {sendError, formatSend, getAuthorizationData} from '../core/web_util';
import {signupService} from './signup_service';
import {AuthenticationResponse, ModelOptions} from '../../client/core/dto';

const router = express.Router();

router.post('/', (req, res) => {
  const modelOptions: ModelOptions = {
    authorization: getAuthorizationData(req),
    requireAuthorization: false 
  };
  signupService.createOne(req.body, modelOptions)
    .then((authentication: AuthenticationResponse) => formatSend(res, authentication), (err) => sendError(res, err));
});


export = router;

