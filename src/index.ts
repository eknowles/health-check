import { Application } from 'probot';

export = (app: Application) => {
  // Your code here
  app.log('Yay, the app was loaded!');

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/

  app.on(`*`, async context => {
    context.log({event: context.event, action: context.payload.action});
  });
}
