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
import admin from './database/firebase';

const app = express();

const GQL_PORT = 4500; 

app.use('*', cors());

app.use(bodyParser.json())

app.use('/graphql', (req, res, next) => {
  const {operationName, variables} = req.body
  if (operationName && operationName === 'addUser') {
    admin.auth().createCustomToken(variables.email).then(function(token) {
        req.body.token = token
        next()
    }).catch(function(error) {
        console.log(error)
        next()
    })
  } else {
    next()
  }
});

app.use('/graphql', graphqlExpress(function(req, res) {
  return { 
    schema,
    context: {
      loaders: createLoaders(),
      token: req.body.token,
      response: res
    }
  }
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(GQL_PORT, () => console.log(
  `GraphQL is now running on http://localhost:${GQL_PORT}/graphql`
));