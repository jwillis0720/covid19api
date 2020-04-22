const { ApolloServer, gql } = require('apollo-server');
const fetch = require("node-fetch");
const { RESTDataSource } = require('apollo-datasource-rest');
const { resolveAs } = require('graphql-directive-resolve-as');


const typeDefs = `
   directive @resolveAs(name: String) on FIELD_DEFINITION
   type Query {
    Countries: [Country]!
  }
  type CountryInfo{
      id: Int @resolveAs(name: "_id")
      iso2: String
      iso3: String
      lat: Float
      long: Float
      flag: String
  }
  type Country {
      name: String @resolveAs(name: "country")
      updated: Float,
      info: CountryInfo @resolveAs(name: "countryInfo") 
      cummulativeCases: Int @resolveAs(name: "cases")
      todayCases: Int,
      cummulativeDeaths: Int @resolveAs(name: "deaths")
      todayDeaths: Int,
      recovered: Int,
      active: Int,
      critical: Int,
      casesPerOneMillion: Int,
      deathsPerOneMillion: Int,
      tests: Int,
      testsPerOneMillion: Int,
      continent: String
  }
`;


const resolvers = {
    Query: {
        Countries: async () => {
            const response = await fetch(`https://corona.lmao.ninja/v2/countries`);
            return response.json()
        }
    }

}
const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
        resolveAs: resolveAs
    },
    tracing: true
})


// Launch the server
server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
})