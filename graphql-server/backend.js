/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

const {RESTDataSource} = require('apollo-datasource-rest');
const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');


class NovelCovidAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://corona.lmao.ninja/v2/';
  }

  async getCountries() {
    const response = await this.get('countries');
    return response.map((obj) => {
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

  async getTimeLinebyCountry2(countryInfo) {
    // console.log(countryInfo.iso3);
    let response = [];
    try {
      response = await this.get(`historical/${countryInfo.iso3}?lastdays=all`);
    } catch (err) {
      console.error(`iso3 ${countryInfo.iso3} failed, trying _id`);
      try {
        response = await this.get(`historical/${countryInfo._id}?lastdays=all`);
      } catch (err) {
        console.error(`error with _id- ${countryInfo._id} returning nothing`);
        return response;
      }
    }
    // .catch(await this.get(`historical/${countryInfo._id}?lastdays=all`))
    // .catch(
    // console.log(response);
    const {cases, deaths, recovered} = response.timeline;
    const result = Object.keys(cases).map((date) => ({
      date: new Date(date).getTime(),
      datereadable: new Date(date).toDateString(),
      cases: cases[date],
      deaths: deaths[date],
      recovered: recovered[date],
      countryInfo: [countryInfo],
    }));
    return result;
  }


  async getTimeLinebyCountry(countryInfo) {
    // console.log(countryInfo.iso3);
    // let response = [];
    const potentialIds = [
      countryInfo._id,
      countryInfo.iso3,
      countryInfo.iso2,
    ];

    let response = Object();
    for (const index of potentialIds) {
      // console.log(index);
      try {
        response = await this.get(`historical/${index}?lastdays=all`);
        break;
      } catch (err) {
        console.log(err);
      }
    }

    if (Object.keys(response).length===0) {
      return [];
    }

    // console.log(response);
    const {cases, deaths, recovered} = response.timeline;
    const result = Object.keys(cases).map((date) => ({
      date: new Date(date).getTime(),
      datereadable: new Date(date).toDateString(),
      cases: cases[date],
      deaths: deaths[date],
      recovered: recovered[date],
      countryInfo: [countryInfo],
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
        datereadable: new Date(filtered.date).toDateString(),
      };
    });
  }

  async getYesterday(name) {
    // console.log(name);
    const response = await this.get(`states/${name}?yesterday=true`);
    return response
  }
}

// I think that maybe these should not be async functions since
// some of them don't return promises and we resolve them in the RESTAPI
// while this probably doesn't matter, I just want to be a good programmer
const resolvers = {
  Query: {
    AllCountries: (_parent, _args, {dataSources}) => {
      return dataSources.ncapi.getCountries();
    },
    CountryByID: (_, {id}, {dataSources}) => {
      return dataSources.ncapi.getCountrybyID(id);
    },
    CountryByIDs: (_, {ids}, {dataSources}) => {
      // no reseaon to return promise.all since get country by id is not returning promises
      return ids.map((id) => dataSources.ncapi.getCountrybyID(id));
    },
    CountryByName: (_, {name}, {dataSources}) => {
      return dataSources.ncapi.getCountryByName(name);
    },
    CountryByNames: (_, {names}, {dataSources}) => {
      return names.map((name) => dataSources.ncapi.getCountryByName(name));
    },

    AllStates: (_parent, _args, {dataSources}) => {
      return dataSources.ncapi.getStates();
    },
    StateByName: (_parent, {name}, {dataSources}) => {
      // console.log(name)
      return dataSources.ncapi.getStatebyName(name);
    },
    StateByNames: (_parent, {names}, {dataSources}) => {
      // console.log(name)
      return names.map((name) => dataSources.ncapi.getStatebyName(name));
    },
  },

  State: {
    timeline: async (state, _, {dataSources}) => {
      return dataSources.ncapi.getTimeLinebyState(state.state);
    },
    yesterdayCases: async (state, _, {dataSources}) =>{
      const response = await dataSources.ncapi.getYesterday(state.state);
      // console.log(response)
      return response.todayCases;
    },
    yesterdayDeaths: async (state, _, {dataSources}) =>{
      const response = await dataSources.ncapi.getYesterday(state.state);
      return response.todayDeaths;
    },
  },

  Country: {
    timeline: async (country, _, {dataSources}) => {
      const countryInfo = country.countryInfo;
      return dataSources.ncapi.getTimeLinebyCountry(countryInfo);
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

module.exports = {resolvers, NovelCovidAPI};
