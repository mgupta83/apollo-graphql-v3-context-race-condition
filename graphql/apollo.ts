import { ApolloServer, CreateHandlerOptions } from 'apollo-server-azure-functions';
import { HttpRequest, Context } from '@azure/functions';
import { ApolloContext } from './apollo-context';
import { createDataSources, DataSources } from './data-sources';

export class ApolloServerRequestHandler {
  private readonly serverConfig = () => {
    return {
      typeDefs,
      resolvers,

      context: async (req: any) => {
        //context loads before data sources
        return await ApolloContext.getContext(
          req,
        );
      },
      // This works
      dataSources: () => createDataSources(),

      // This does not work
      // dataSources: () => { return DataSources; },

      playground: { endpoint: '/api/graphql/playground' },
    };
  };

  public handleRequests(context: Context, req: HttpRequest) {
    req.headers['x-ms-privatelink-id'] = ''; // https://github.com/Azure/azure-functions-host/issues/6013
    return this.graphqlHandlerObj(context, req);
  }

  private readonly graphqlHandlerObj: any;

  constructor() {
    console.log(' -=-=-=-=-=-=-=-=-= INITIALIZING APOLLO -=-=-=-=-=-=-=-=-=');
    const server = new ApolloServer({
      ...this.serverConfig(),
    });

    this.graphqlHandlerObj = server.createHandler({
      cors: {
        origin: true,
        credentials: true,
      },
    } as CreateHandlerOptions);
  }
}


const resolvers = {
  Query: {
    serverDate: async (_, args, context) => {
      const { verifiedJwt, user } = context;
      console.log(`serverDate | ${JSON.stringify(verifiedJwt)} | ${JSON.stringify(user)}`);
      return (new Date()).toString()
    },
    applicant:  async (_, args, context) => { 
      const { verifiedJwt, user, dataSources } = context;
      // console.log(`applicant | ${JSON.stringify(verifiedJwt)} | ${JSON.stringify(user)}`);
      await dataSources.applicantDomainApi.applicantUpdate(); 
      return (new Date()).toString(); 
    }
  },
};

const typeDefs = `#graphql
  type Query {
    serverDate: String
    applicant: String
  }
`;