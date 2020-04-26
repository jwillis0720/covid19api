const {ApolloServer} = require('apollo-server');
const {resolveAs} = require('graphql-directive-resolve-as');
const {NovelCovidAPI, CSVAPI} = require('./api');
const {resolvers} = require('./resolvers/resolvers');
const typeDefs = require('./schema');
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      ncapi: new NovelCovidAPI(),
      csv: new CSVAPI()
    };
  },
  schemaDirectives: {
    resolveAs: resolveAs,
  },
  tracing: false,
});


// Launch the server
server.listen(4000).then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
