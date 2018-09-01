import { Application } from 'probot';

import * as C from './constants';

export = (app: Application) => {
  app.on(C.EVENT.CHECK_SUITE.REQUESTED, async context => {
    context.log(context);
  });
}
