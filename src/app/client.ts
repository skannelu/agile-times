import { ApolloClient, createNetworkInterface } from 'apollo-client';

// https://api.graph.cool/simple/v1/cj7wlr0tj0jce0138dmbj27da
// Info: https://github.com/graphcool-examples/angular-apollo-instagram-example#2-create-graphql-api-with-graphcool
const networkInterface = createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/cj7wlr0tj0jce0138dmbj27da' })

const client = new ApolloClient({ networkInterface });

export function provideClient(): ApolloClient {
  return client;
}