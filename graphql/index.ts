import { Context, HttpRequest } from '@azure/functions';
import { ApolloServerRequestHandler } from './apollo';

let apolloServerRequestHandler = new ApolloServerRequestHandler();

// Execute the following with every http request
export default (context: Context, req: HttpRequest) => {
  return apolloServerRequestHandler.handleRequests(context, req);
};
