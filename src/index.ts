import { Application } from 'probot';

import * as C from './constants';
import CheckSuiteRequested from './events/check-suite-requested';
import MasterBuildingStatus from './events/status';
import { loadMessages } from './helpers/locales';

// @ts-ignore
global.messages = loadMessages();

export = (app: Application) => {
  app.on(C.EVENT.PR.REOPENED, CheckSuiteRequested);
  app.on(C.EVENT.PR.OPENED, CheckSuiteRequested);
  app.on(C.EVENT.CHECK_SUITE.REQUESTED, CheckSuiteRequested);
  app.on(C.EVENT.CHECK_SUITE.REREQUESTED, CheckSuiteRequested);

  app.on(C.EVENT.STATUS, MasterBuildingStatus);
}
