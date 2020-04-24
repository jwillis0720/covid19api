/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

const {gql} = require('apollo-server');
const {RESTDataSource} = require('apollo-datasource-rest');
const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');

const typeDefs = gql`
   scalar Date
   directive @resolveAs(name: String) on FIELD_DEFINITION

   type Query {
    AllCountries: [Country]!
    CountryByID(id: Int!) : Country!
    CountryByIDs(ids: [Int]!) : [Country]!
    CountryByName(name: String!) : Country!
    CountryByNames(names: [String]!) : [Country]!
    States: [State]!
    State(name: String): State!
  }
  type CountryInfo{
      id: ID @resolveAs(name: "_id")
      iso2: String
      iso3: String
      lat: Float
      long: Float
      flag: String
  }
  type Country {
      name: ID @resolveAs(name: "country")
      date: Date @resolveAs(name: "updated"),
      datereadable: String,
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
      timeline: [TimeLine]
  }



  type State{
    name: ID @resolveAs(name: "state")
    cummulativeCases : Int @resolveAs(name: "cases")
    todayCases: Int,
    cummulativeDeaths: Int @resolveAs(name:"deaths")
    todayDeaths: Int,
    activeCases: Int @resolveAs(name:"active")
    cummulativeTests: Int @resolveAs(name:"tests")
    testsPerOneMillion: Int
    timeline:[TimeLine]
  }
  type TimeLine{
      id: ID
      date: Date
      datereadable: String
      cases: Int
      deaths: Int
      recovered: Int
      fips: Int
      country: Country
  }
`;

class NovelCovidAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://corona.lmao.ninja/v2/';
  }

  async getCountries() {
    const response = await this.get('countries');
    return response.map((obj)=> {
      return {...obj, datereadable: new Date(obj.updated).toDateString()};
    });
  }

  async getCountrybyID(id) {
    const response = await this.get(`countries/${id}`);
    return {...response, datereadable: new Date(response.updated).toDateString()};
  }

  async getCountryByName(name) {
    const response = await this.get(`countries/${name}?strict=false`);
    return {...response, datereadable: new Date(response.updated).toDateString()};
  }

  async getTimeLinebyCountry(id) {
    // console.log(iso3)
    const response = await this.get(`historical/${id}?lastdays=all`);
    const {cases, deaths, recovered} = response.timeline;
    const result = Object.keys(cases).map((date) => ({
      date: new Date(date).getTime(),
      datereadable: new Date(date).toDateString(),
      cases: cases[date],
      deaths: deaths[date],
      recovered: recovered[date],
      id: id,
    }));
    return result;
  }

  async getStates() {
    return this.get('states/');
  }

  async getStatebyName(name) {
    const res = await this.get(`states/${name}`);
    return res;
  }

  async getTimeLinebyState(name) {
    const response = await this.get('nyt/states');
    return response.filter((states) => {
      return states.state === name;
    }).map((filtered) => {
      return {
        ...filtered,
        date: new Date(filtered.date).getTime(),
        datereadable: new Date(filtered.date).toDateString()};
    });
  }
}

const resolvers = {
  Query: {
    AllCountries: async (_parent, _args, {dataSources}) => {
      return dataSources.ncapi.getCountries();
    },
    CountryByID: async (_, {id}, {dataSources}) => {
      return dataSources.ncapi.getCountrybyID(id);
    },
    CountryByIDs: async (_, {ids}, {dataSources}) => {
      return Promise.all(
          ids.map((id) => dataSources.ncapi.getCountrybyID(id)));
    },
    CountryByName: async (_, {name}, {dataSources}) => {
      return dataSources.ncapi.getCountryByName(name);
    },
    CountryByNames: async (_, {names}, {dataSources}) => {
      return Promise.all(
          names.map((name) => dataSources.ncapi.getCountryByName(name)));
    },

    States: async (_parent, _args, {dataSources}) => {
      return dataSources.ncapi.getStates();
    },
    State: async (_parent, {name}, {dataSources}) => {
      // console.log(name)
      return dataSources.ncapi.getStatebyName(name);
    },
  },

  State: {
    timeline: async (state, _, {dataSources}) => {
      return dataSources.ncapi.getTimeLinebyState(state.state);
    },
  },

  Country: {
    timeline: async (country, _, {dataSources}) => {
      const _id = country.countryInfo._id;
      return dataSources.ncapi.getTimeLinebyCountry(_id);
    },
  },
  TimeLine: {
    country: async (parent, _, {dataSources}) =>{
      return dataSources.ncapi.getCountrybyID(parent.id);
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      // We could do lots of stuff here but lets play it by ear
      console.log('From Client', value);
      return new Date(value).getTime(); // value from the client
    },
    serialize(value) {
      return value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};

module.exports = {typeDefs, resolvers, NovelCovidAPI};
