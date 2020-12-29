import * as cdk    from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw  from '@aws-cdk/aws-apigateway';

export class SlackDeploymentAppStack extends cdk.Stack {

  constructor(
    scope:  cdk.Construct,
    id:     string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    /** Configuration for Lambda */
    const SlackDeployment = new lambda.Function(this, 'SlackDeploymentHandler', {

      /** Specify the version of Node.js to run */
      runtime: lambda.Runtime.NODEJS_12_X,

      /** Specify the directory of the Code to be executed */
      code: lambda.Code.fromAsset('lambda'),

      /** Specify the Lambda function to be executed */
      handler: 'slack-deployment.handler'

    });

    /** Connect Lambda to the API Gateway */
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: SlackDeployment
    });
  }
}
