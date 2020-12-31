import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';

export class SlackDeploymentEcs extends cdk.Construct {

  constructor(
    scope: cdk.Construct,
    id:    string
  ) {
    super(scope, id);

    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      isDefault: false,
      tags: {
        ['aws:cloudformation:stack-id']: 'arn:aws:cloudformation:ap-northeast-1:445682127642:stack/EC2ContainerService-cluster-for-cap/0d1bded0-103a-11eb-80c2-064a62427c9e',
        ['Description']: 'Created for ECS cluster cluster-for-cap',
        ['aws:cloudformation:stack-name']: 'EC2ContainerService-cluster-for-cap',
        ['Name']: 'ECS cluster-for-cap - VPC',
        ['aws:cloudformation:logical-id']: 'Vpc'
      },
      vpcId: 'vpc-0b5fbaecebad51289',
      vpcName: 'ECS cluster-for-cap - VPC'
    });

    const image = ecs.ContainerImage.fromRegistry('project/repository_for_cap');

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'taskDefinition', {
      family: 'task-for-cap',
      cpu: 256,
      memoryLimitMiB: 512
    });

    const cluster = ecs.Cluster.fromClusterAttributes(this, 'Cluster', {
      clusterName: 'cluster-for-cap',
      vpc: vpc,
      securityGroups: []
    });

    taskDefinition.addContainer('taskDefinitionContainer', {
      image: image,
      memoryLimitMiB: 512
    }).addPortMappings({
      protocol: ecs.Protocol.TCP,
      hostPort: 9000,
      containerPort: 9000
    });

    /*
    ecs.FargateService.fromFargateServiceAttributes(this, 'ServiceFargate', {
      cluster: cluster,
      serviceName: 'container-for-cap-service'
    });
    */

    new ecs.FargateService(this, 'ServiceFargate', {
      cluster: cluster,
      serviceName: 'container-for-cap-service',
      taskDefinition: taskDefinition
    });

  }
}
