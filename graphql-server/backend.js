const {gql} = require('apollo-server');
const {RESTDataSource} = require('apollo-datasource-rest');


const typeDefs = gql`
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
      date: String
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
    return this.get('countries');
  }

  async getCountrybyID(id) {
    return this.get(`countries/${id}`);
  }

  async getCountryByName(name) {
    return this.get(`countries/${name}?strict=false`);
  }

  async getTimeLinebyCountry(id) {
    // console.log(iso3)
    const response = await this.get(`historical/${id}?lastdays=all`);
    const {cases, deaths, recovered} = response.timeline;
    const result = Object.keys(cases).map((date) => ({
      date,
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
    const res = await this.get('nyt/states').then(
        (states) => states.filter(
            (state) => {
              return state.state === name;
            },
        ));
    return res;
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
};

module.exports = {typeDefs, resolvers, NovelCovidAPI};
