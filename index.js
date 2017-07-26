import express from 'express';
import bodyParser from 'body-parser';
import { } from 'dotenv/config';
import { 
  graphqlExpress, 
  graphiqlExpress 
} from 'graphql-server-express';

import schema from './api/schema'; // Next step!
import createLoaders from './api/loaders';
import cors from 'cors';

const app = express();

const GQL_PORT = 4500; 

app.use('*', cors());

app.use('/graphql', bodyParser.json(), graphqlExpress({ 
  schema,
  context: {
    loaders: createLoaders()
  }
}));
// A route for accessing the GraphiQL tool

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(GQL_PORT, () => console.log(
  `GraphQL is now running on http://localhost:${GQL_PORT}/graphql`
));