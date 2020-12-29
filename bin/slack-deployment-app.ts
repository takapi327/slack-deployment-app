#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SlackDeploymentAppStack } from '../lib/slack-deployment-app-stack';

const app = new cdk.App();
new SlackDeploymentAppStack(app, 'SlackDeploymentAppStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION
  }
});
