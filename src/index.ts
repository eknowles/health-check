import { Application, Context } from 'probot';

import * as C from './constants';
import CheckSuiteRequested from './events/check-suite-requested';

export = (app: Application) => {
  // Both Check Suite events will require a full analysis of the check runs
  app.on(C.EVENT.CHECK_SUITE.REQUESTED, CheckSuiteRequested);
  app.on(C.EVENT.CHECK_SUITE.REREQUESTED, CheckSuiteRequested);
  app.on(C.EVENT.CHECK_RUN.REREQUESTED, async (context: Context) => {
    console.log(context.payload);
    return;
  });
}
