import { WebClient } from '@slack/web-api';
//import * as cdk from '@aws-cdk/core';
//import { SlackDeploymentEcs } from '../ecs/SlackDeploymentEcs';

//const app = new cdk.App();
const web = new WebClient(process.env.SLACK_API_TOKEN);

exports.handler = async(event: any) => {

  const decodeMessage     = decodeURIComponent(event.body).replace("payload=", "")
  const jsonDecodeMessage = JSON.parse(JSON.parse(JSON.stringify(decodeMessage)))

  var deployMessage: string = ''

  if(jsonDecodeMessage.actions[0].name == 'Deploy') {

    deployMessage = 'イメージがアップされました'

    //new SlackDeploymentEcs(app, 'SlackDeploymentEcs')

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
