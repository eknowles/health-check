import { Application } from 'probot';

import * as C from './constants';
import CheckSuiteRequested from './event-handlers/check-suite-requested';

export = (app: Application) => {
  app.on(C.EVENT.CHECK_SUITE.REQUESTED, CheckSuiteRequested);
  app.on(C.EVENT.CHECK_SUITE.REREQUESTED, CheckSuiteRequested);
}
