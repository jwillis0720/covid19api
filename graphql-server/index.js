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

    async getTimeLinebyCountry(iso3) {
        console.log(iso3)
        const response = await this.get(`historical/${iso3}?lastdays=all`)
        console.log(response)
        //need this
        //    type TimeLine{
        //     date: String
        //     cases: Int
        //     deaths: Int
        //     recovered: Int
        //     fips: Int
        // }

        //from this
        // {
        //     country: 'Brazil',
        //     provinces: [ 'mainland' ],
        //     timeline: {
        //       cases: {
        //         '1/22/20': 0,
        //         '1/23/20': 0,
        //         '1/24/20': 0,
        //         '1/25/20': 0,
        //         '1/26/20': 0,
        //         '1/27/20': 0,
        //         '1/28/20': 0,
        //         '1/29/20': 0,
        //         '1/30/20': 0,
        //         '1/31/20': 0,
        //         '2/1/20': 0,



    }

    async getTimeLinebyState(name) {
        // console.log(name)
        const res = await this.get("nyt/states").then(
            states => states.filter(
                state => {
                    return state.state === name;
                }
            ))
        return res
    }
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
    },

    Country: {
        timeline: async (country, _, { dataSources }) => {
            let iso3 = country.countryInfo.iso3
            return dataSources.ncapi.getTimeLinebyCountry(iso3)
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