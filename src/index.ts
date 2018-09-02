import { Application } from 'probot';

import * as C from './constants';
import CheckSuiteRequested from './events/check-suite-requested';

export = (app: Application) => {
  // Both Check Suite events will require a full analysis of the check runs
  app.on(C.EVENT.CHECK_SUITE.REQUESTED, CheckSuiteRequested);
  app.on(C.EVENT.CHECK_SUITE.REREQUESTED, CheckSuiteRequested);
}
