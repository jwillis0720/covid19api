/* eslint-disable require-jsdoc */
const {ApolloServer} = require('apollo-server');
const {resolveAs} = require('graphql-directive-resolve-as');
const {typeDefs, resolvers, NovelCovidAPI} = require('./backend');
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      ncapi: new NovelCovidAPI(),
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
