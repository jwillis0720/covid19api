import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers/resolvers";
import { resolveAs } from "graphql-directive-resolve-as";
import { NovelCovidAPI, CSVAPI } from "./api";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      ncapi: new NovelCovidAPI(),
      csv: new CSVAPI(),
    };
  },
  schemaDirectives: {
    resolveAs: resolveAs,
  },
  tracing: false,
});

export default server;
