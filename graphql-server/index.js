const { ApolloServer, gql } = require('apollo-server');
const fetch = require("node-fetch");
const { RESTDataSource } = require('apollo-datasource-rest');
const { resolveAs } = require('graphql-directive-resolve-as');
const typeDefs = require('./schema')


class NovelCovidAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://corona.lmao.ninja/v2/';
    }

    async getCountries() {
        return this.get("countries")
    }
    async getStates() {
        return this.get("states/")
    }

    async getStatebyName(name) {
        const res = await this.get(`states/${name}`)
        // console.log(res)
        return res
    }


    async getCountrybyID(id) {
        return this.get(`countries/${id}`)

    }

    async getTimeLinebyState(name) {
        console.log(name)
        const res = await this.get(`nyt/states/${name}`)
        return res
    }
    // if (id != null) {
    //     const data = []
    //     data.push(this.get(`countries/${id}`))
    //     return data
    // } else {

    //     // }
    // }
}

const resolvers = {
    Query: {
        Countries: async (_parent, _args, { dataSources }) => {
            return dataSources.ncapi.getCountries()
        },
        Country: async (_, { id }, { dataSources }) => {
            return dataSources.ncapi.getCountrybyID(id)
        },
        States: async (_parent, _args, { dataSources }) => {
            return dataSources.ncapi.getStates()
        },
        State: async (_parent, { name }, { dataSources }) => {
            // console.log(name)
            return dataSources.ncapi.getStatebyName(name)
        }
    },
    State: {
        timeline: async (state, _, { dataSources }) => {
            return dataSources.ncapi.getTimeLinebyState(state.state)
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