/*
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
*/

import { WebClient }          from '@slack/web-api';
import * as cdk               from '@aws-cdk/core';
import { SlackDeploymentEcs } from '../ecs/SlackDeploymentEcs';

const app = new cdk.App();
const web = new WebClient(process.env.SLACK_API_TOKEN);

exports.handler = async(event: any) => {

  const decodeMessage     = decodeURIComponent(event.body).replace("payload=", "")
  const jsonDecodeMessage = JSON.parse(JSON.parse(JSON.stringify(decodeMessage)))

  var deployMessage: string = ''

  if(jsonDecodeMessage.actions[0].name == 'Deploy') {

    deployMessage = 'イメージがアップされました'

    new SlackDeploymentEcs(app, 'SlackDeploymentEcs')

  } else {
    deployMessage = 'キャンセルされました'
  }

  const params = {
    channel:     process.env.SLACK_CHANNEL!,
    ts:          jsonDecodeMessage.message_ts,
    text:        '',
    attachments: [
      {
        'text': deployMessage
      }
    ]
  }

  await web.chat.update(params).catch(console.error)
}
