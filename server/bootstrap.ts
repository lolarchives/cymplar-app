import * as connectLivereload from 'connect-livereload';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as openResource from 'open';
import * as serveStatic from 'serve-static';
import {resolve} from 'path';
import * as socketIO from 'socket.io';

import {APP_BASE, LIVE_RELOAD_PORT, PATH, PORT} from '../tools/config';
import {authentication} from './authentication/authentication_middleware';
import * as contactRouter from './contact/contact_router';

import * as countryRouter from './country/country_router';
import * as stateRouter from './state/state_router';
import * as cityRouter from './city/city_router';
import * as industryRouter from './industry/industry_router';
import * as addressBookGroupRouter from './address_book_group/address_book_group_router';
import * as addresssBookContactRouter from './address_book_contact/address_book_contact_router';
import * as loginRouter from './login/login_router';
import * as signupRouter from './signup/signup_router';
import * as accountUserRouter from './account_user/account_user_router';
import * as accountOrganizationRouter from './account_organization/account_organization_router';
import * as accountOrganizationMemberRouter from './account_organization_member/account_organization_member_router';
import * as accountMemberRoleRouter from './account_member_role/account_member_role_router';
import * as accountInvitationRouter from './account_invitation/account_invitation_router';
import * as salesLeadRouter from './sales_lead/sales_lead_router';
import * as salesLeadOrganizationMemberRouter from './sales_lead_organization_member/sales_lead_organization_member_router';
import * as salesLeadMemberRoleRouter from './sales_lead_member_role/sales_lead_member_role_router';
import * as salesLeadContactRouter from './sales_lead_contact/sales_lead_contact_router';
import * as salesLeadStatusRouter from './sales_lead_status/sales_lead_status_router';
import * as logItemRouter from './log_item/log_item_router';
import * as logItemTypeRouter from './log_item_type/log_item_type_router';
import {SocketIOCymplarService} from './socket_io_cymplar/socket_io_cymplar_service';

const INDEX_DEST_PATH = resolve(PATH.cwd, PATH.dest.app.base, 'index.html');

const server = express();

server.use(
  APP_BASE,
  connectLivereload({ port: LIVE_RELOAD_PORT }),
  serveStatic(resolve(PATH.cwd, PATH.dest.app.base))
);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.all('/api/*', authentication.validate);
server.use('/api/contact', contactRouter);

server.use('/api/country', countryRouter);
server.use('/api/state', stateRouter);
server.use('/api/city', cityRouter);
server.use('/api/industry', industryRouter);
server.use('/api/address-book-group', addressBookGroupRouter);
server.use('/api/address-book-contact', addresssBookContactRouter);

server.use('/api/login', loginRouter);
server.use('/api/signup', signupRouter);
server.use('/api/account-user', accountUserRouter);
server.use('/api/account-organization', accountOrganizationRouter);
server.use('/api/account-organization-member', accountOrganizationMemberRouter);
server.use('/api/account-organization-member-role', accountMemberRoleRouter);
server.use('/api/account-invitation', accountInvitationRouter);

server.use('/api/sales-lead', salesLeadRouter);
server.use('/api/sales-lead-organization-member', salesLeadOrganizationMemberRouter);
server.use('/api/sales-lead-organization-member-role', salesLeadMemberRoleRouter);
server.use('/api/sales-lead-contact', salesLeadContactRouter);
server.use('/api/sales-lead-status', salesLeadStatusRouter);
server.use('/api/log-item', logItemRouter);
server.use('/api/log-item-type', logItemTypeRouter);

server.all(APP_BASE + '*', (req, res) =>
  res.sendFile(INDEX_DEST_PATH)
);

const httpServer = server.listen(PORT, () => {
  const url = 'http://localhost:' + PORT + APP_BASE;
  if (process.env.RESTART) {     
    console.log('Server restarted at: ', url);
  } else {
    openResource(url);
    console.log('Server started at: ', url);
  }
});

const socketIoServerService = new SocketIOCymplarService(socketIO(httpServer));

