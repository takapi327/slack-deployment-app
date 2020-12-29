import * as awsServerlessExpress           from 'aws-serverless-express';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import * as express                        from 'express';

const app = express();
app.use(awsServerlessExpressMiddleware.eventContext());

app.get('/', (req, res) => {
  res.status(200).send('hello');
});

const server = awsServerlessExpress.createServer(app);

exports.handler = (event: any, context: any) => {
  return awsServerlessExpress.proxy(server, event, context);
};
