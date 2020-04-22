const { ApolloServer, gql } = require('apollo-server');
const fetch = require("node-fetch");
const { RESTDataSource } = require('apollo-datasource-rest');
const { resolveAs } = require('graphql-directive-resolve-as');


const typeDefs = `
   directive @resolveAs(name: String) on FIELD_DEFINITION
   type Query {
    Countries(id:Int): [Country]!
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


class NovelCovidAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://corona.lmao.ninja/v2/';
    }

    async getCountries(id) {
        if (id != null) {
            const data = []
            data.push(this.get(`countries/${id}`))
            return data
        } else {
            return this.get("countries")
        }
    }
}

const resolvers = {
    Query: {
        Countries: async (_, { id }, { dataSources }) => {
            return dataSources.ncapi.getCountries(id)
        }
    }

}
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            ncapi: new NovelCovidAPI(),
        }
    },
    schemaDirectives: {
        resolveAs: resolveAs
    },
    tracing: false
})


// Launch the server
server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
})