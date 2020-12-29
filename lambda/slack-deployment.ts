import * as awsServerlessExpress           from 'aws-serverless-express';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import { App, ExpressReceiver }            from '@slack/bolt';

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!
});

const app = new App({
  token:                 process.env.SLACK_BOT_TOKEN,
  receiver:              receiver,
  processBeforeResponse: true
});

app.message('hello', async({ message, say }: {message: any, say: any}) => {
  await say(`hello ${message.user}`);
});

receiver.app.use(awsServerlessExpressMiddleware.eventContext());

const server = awsServerlessExpress.createServer(receiver.app);

exports.handler = (event: any, context: any) => {
  return awsServerlessExpress.proxy(server, event, context);
};
